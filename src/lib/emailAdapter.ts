import type { EmailAdapter } from 'payload'
import { sendMail } from './mailer'

/** Payload's own emails (password resets) go through the same SMTP settings as leads. */
export const siteSettingsEmailAdapter: EmailAdapter = ({ payload }) => ({
  name: 'site-settings-smtp',
  defaultFromAddress: process.env.EMAIL_FROM || 'no-reply@localhost',
  defaultFromName: 'Website',
  sendEmail: async (message) => {
    const to = Array.isArray(message.to) ? message.to.join(',') : String(message.to)
    return sendMail(payload, { to, subject: String(message.subject || ''), html: String(message.html || message.text || '') })
  },
})
