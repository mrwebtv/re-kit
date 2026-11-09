import type { CollectionAfterChangeHook, CollectionBeforeValidateHook, Field } from 'payload'
import { APIError } from 'payload'
import { esc, getSettingsAdmin, layout, sendMail } from '@/lib/mailer'

export const consentFields: Field[] = [
  { name: 'consent', type: 'checkbox', admin: { readOnly: true, position: 'sidebar', description: 'Visitor agreed to the privacy policy' } },
  { name: 'consentAt', type: 'date', admin: { readOnly: true, position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
]

/** Public submissions must tick the consent box. */
export const requireConsent: CollectionBeforeValidateHook = ({ operation, req, data }) => {
  if (operation !== 'create' || req.user || req.payloadAPI === 'local' || !data) return data
  if (data.consent !== true) throw new APIError('Please tick the box to agree to the privacy policy.', 400)
  data.consentAt = new Date().toISOString()
  return data
}

const TYPE: Record<string, string> = { property: 'Property enquiry', valuation: 'Valuation request', contact: 'General enquiry' }

/** On a new lead: email the agent (or leads inbox), confirm to the visitor, and post to the CRM webhook if enabled. */
export const handleNewLead =
  (kind: 'enquiry' | 'viewing'): CollectionAfterChangeHook =>
  async ({ doc, operation, req }) => {
    if (operation !== 'create') return doc
    const { payload } = req
    // Run after the response so the visitor never waits on SMTP or a webhook.
    setTimeout(async () => {
      try {
        const s = await getSettingsAdmin(payload)
        let agentEmail: string | undefined
        let agentName: string | undefined
        let propertyTitle = ''
        let propertyUrl = ''
        if (doc.property) {
          const property = await payload.findByID({ collection: 'properties', id: typeof doc.property === 'object' ? doc.property.id : doc.property, depth: 1, overrideAccess: true })
          propertyTitle = property.title
          propertyUrl = `${process.env.SITE_URL || ''}/properties/${property.slug}`
          if (property.agent && typeof property.agent === 'object') {
            agentEmail = property.agent.email
            agentName = property.agent.name
          }
        }
        const label = kind === 'viewing' ? 'Viewing request' : TYPE[doc.type] || 'Enquiry'
        const fallback = s.leadsInbox || s.email || undefined
        const to = Array.from(new Set([agentEmail || fallback, s.copyAllLeads ? fallback : undefined].filter(Boolean))) as string[]
        const rows = Object.entries({
          Type: label,
          Name: doc.name,
          Email: doc.email,
          Phone: doc.phone,
          Property: propertyTitle,
          'Property address': doc.propertyAddress,
          'Preferred date': doc.preferredDate ? new Date(doc.preferredDate).toUTCString() : undefined,
          Message: doc.message,
        })
          .filter(([, v]) => v)
          .map(([k, v]) => `<p style="margin:0 0 10px"><strong>${k}:</strong> ${esc(v)}</p>`)
          .join('')
        const adminLink = `${process.env.SITE_URL || ''}/admin/collections/${kind === 'viewing' ? 'viewings' : 'enquiries'}/${doc.id}`
        if (to.length) {
          await sendMail(payload, { to: to.join(','), replyTo: doc.email, subject: `${label}${propertyTitle ? `: ${propertyTitle}` : ''} from ${doc.name}`, html: layout(s, `<h2 style="margin:0 0 16px;font-size:20px">${label}</h2>${rows}<p style="margin-top:20px"><a href="${adminLink}">Open in the admin</a></p>`) }, s)
        }
        await sendMail(payload, {
          to: doc.email,
          subject: `We received your ${label.toLowerCase()}`,
          html: layout(s, `<p>Hi ${esc(doc.name)},</p><p>Thanks for your ${label.toLowerCase()}${propertyTitle ? ` about <a href="${propertyUrl}">${esc(propertyTitle)}</a>` : ''}. ${agentName ? esc(agentName) : 'We'} will be in touch shortly.</p><p>${esc(s.agencyName)}</p>`),
        }, s)
        if (s.features?.crmWebhook && s.features.webhookUrl) {
          await fetch(s.features.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: s.agencyName,
              leadType: kind === 'viewing' ? 'viewing' : doc.type,
              id: doc.id,
              name: doc.name,
              firstName: String(doc.name || '').split(' ')[0],
              lastName: String(doc.name || '').split(' ').slice(1).join(' '),
              email: doc.email,
              phone: doc.phone,
              message: doc.message,
              preferredDate: doc.preferredDate,
              propertyAddress: doc.propertyAddress,
              property: propertyTitle,
              propertyUrl,
              agent: agentName,
              createdAt: doc.createdAt,
            }),
          }).then((r) => {
            if (!r.ok) payload.logger.warn(`CRM webhook returned ${r.status}`)
          })
        }
      } catch (err) {
        payload.logger.error({ err, msg: `Lead follow-up failed for ${kind} ${doc.id}` })
      }
    }, 0)
    return doc
  }
