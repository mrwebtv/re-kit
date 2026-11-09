import type { CollectionAfterChangeHook, CollectionBeforeValidateHook, Field, Payload, Where } from 'payload'
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

const TYPE: Record<string, string> = { property: 'Property enquiry', valuation: 'Valuation request', contact: 'General enquiry', signup: 'Email signup' }

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
        let agentId: number | undefined
        let propertyTitle = ''
        let propertyUrl = ''
        let propertyId: number | undefined
        let price: number | undefined
        if (doc.property) {
          const property = await payload.findByID({ collection: 'properties', id: typeof doc.property === 'object' ? doc.property.id : doc.property, depth: 1, overrideAccess: true })
          propertyTitle = property.title
          propertyId = property.id
          price = property.price
          propertyUrl = `${process.env.SITE_URL || ''}/properties/${property.slug}`
          if (property.agent && typeof property.agent === 'object') {
            agentEmail = property.agent.email
            agentName = property.agent.name
            agentId = property.agent.id
          }
        }
        const label = kind === 'viewing' ? 'Viewing request' : TYPE[doc.type] || 'Enquiry'
        await recordDeal(payload, { kind, doc, label, propertyId, propertyTitle, agentId, price }).catch((err) => payload.logger.error({ err, msg: 'Could not create CRM deal' }))
        if (doc.type === 'signup') {
          if (s.leadsInbox || s.email) await sendMail(payload, { to: (s.leadsInbox || s.email)!, subject: `New email signup: ${doc.email}`, html: layout(s, `<p>${esc(doc.email)} signed up on the website.</p>`) }, s)
          return
        }
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

type DealInput = { kind: 'enquiry' | 'viewing'; doc: Record<string, any>; label: string; propertyId?: number; propertyTitle: string; agentId?: number; price?: number }

/** Every lead lands in the CRM: a new deal, or a new activity on the open deal for the same person and property. */
async function recordDeal(payload: Payload, d: DealInput) {
  if (d.doc.type === 'signup') return
  const leadRef = { relationTo: d.kind === 'viewing' ? 'viewings' : 'enquiries', value: d.doc.id } as const
  const and: Where[] = [{ contactEmail: { equals: d.doc.email } }, { stage: { not_in: ['completed', 'lost'] } }]
  if (d.propertyId) and.push({ property: { equals: d.propertyId } })
  const open = await payload.find({ collection: 'deals', where: { and }, limit: 1, depth: 0, overrideAccess: true })
  const when = d.doc.preferredDate ? ` for ${new Date(d.doc.preferredDate).toUTCString().slice(0, 22)}` : ''
  const summary = `${d.label}${when}`
  if (open.docs[0]) {
    const deal = open.docs[0]
    await payload.create({ collection: 'activities', data: { deal: deal.id, type: d.kind === 'viewing' ? 'viewing' : 'email', summary, details: d.doc.message || undefined }, overrideAccess: true })
    if (d.kind === 'viewing' && deal.stage === 'new') await payload.update({ collection: 'deals', id: deal.id, data: { stage: 'viewing' }, overrideAccess: true })
    return
  }
  const deal = await payload.create({
    collection: 'deals',
    data: {
      title: `${d.doc.name}${d.propertyTitle ? ` · ${d.propertyTitle}` : d.doc.propertyAddress ? ` · ${d.doc.propertyAddress}` : ''}`,
      stage: d.kind === 'viewing' ? 'viewing' : 'new',
      contactName: d.doc.name,
      contactEmail: d.doc.email,
      contactPhone: d.doc.phone || undefined,
      property: d.propertyId,
      agent: d.agentId,
      value: d.price,
      source: d.kind === 'viewing' ? 'viewing' : d.doc.type,
      lead: leadRef,
    },
    overrideAccess: true,
  })
  await payload.create({ collection: 'activities', data: { deal: deal.id, type: d.kind === 'viewing' ? 'viewing' : 'email', summary, details: d.doc.message || undefined }, overrideAccess: true })
}
