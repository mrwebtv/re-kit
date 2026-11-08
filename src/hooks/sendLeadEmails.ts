import type { CollectionAfterChangeHook } from 'payload'

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)

/** Emails the property's agent (or the fallback inbox) and sends the visitor an autoresponder. */
export const sendLeadEmails =
  (kind: 'enquiry' | 'viewing'): CollectionAfterChangeHook =>
  async ({ doc, operation, req }) => {
    if (operation !== 'create') return doc
    const { payload } = req
    let agentEmail = process.env.LEADS_INBOX
    let propertyTitle = ''
    if (doc.property) {
      const property = await payload.findByID({
        collection: 'properties',
        id: typeof doc.property === 'object' ? doc.property.id : doc.property,
        depth: 1,
        req,
      })
      propertyTitle = property.title
      if (property.agent && typeof property.agent === 'object') agentEmail = property.agent.email
    }
    const label = kind === 'viewing' ? 'viewing request' : 'enquiry'
    const rows = Object.entries({
      Name: doc.name,
      Email: doc.email,
      Phone: doc.phone,
      Property: propertyTitle,
      'Preferred date': doc.preferredDate,
      Message: doc.message,
    })
      .filter(([, v]) => v)
      .map(([k, v]) => `<p><strong>${k}:</strong> ${esc(v)}</p>`)
      .join('')
    try {
      if (agentEmail)
        await payload.sendEmail({
          to: agentEmail,
          replyTo: doc.email,
          subject: `New ${label}${propertyTitle ? `: ${propertyTitle}` : ''}`,
          html: rows,
        })
      await payload.sendEmail({
        to: doc.email,
        subject: `We received your ${label}`,
        html: `<p>Hi ${esc(doc.name)},</p><p>Thanks for your ${label}${
          propertyTitle ? ` about ${esc(propertyTitle)}` : ''
        }. We'll be in touch shortly.</p>`,
      })
    } catch (err) {
      payload.logger.error({ err, msg: `Lead email failed for ${kind} ${doc.id}` })
    }
    return doc
  }
