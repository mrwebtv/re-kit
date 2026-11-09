import nodemailer, { type Transporter } from 'nodemailer'
import type { Payload } from 'payload'
import type { SiteSetting } from '@/payload-types'

export async function getSettingsAdmin(payload: Payload): Promise<SiteSetting> {
  return payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: true })
}

let cached: { key: string; t: Transporter } | null = null

function transportFor(s: SiteSetting): { t: Transporter; from: string } | null {
  const host = s.smtpHost || process.env.SMTP_HOST
  if (!host) return null
  const port = Number(s.smtpPort || process.env.SMTP_PORT || 465)
  const user = s.smtpUser || process.env.SMTP_USER
  const pass = s.smtpPass || process.env.SMTP_PASS
  const key = [host, port, user, pass].join('|')
  if (!cached || cached.key !== key) {
    cached = { key, t: nodemailer.createTransport({ host, port, secure: port === 465, auth: user ? { user, pass } : undefined }) }
  }
  const fromAddr = s.emailFrom || process.env.EMAIL_FROM || user || 'no-reply@localhost'
  return { t: cached.t, from: `"${(s.agencyName || 'Website').replace(/"/g, '')}" <${fromAddr}>` }
}

export const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)

/** Simple branded HTML email body. */
export function layout(s: SiteSetting, inner: string) {
  const accent = s.colors?.primary || s.accentColor || '#1b1b19'
  return `<!doctype html><html><body style="margin:0;background:#f4f4f2;font-family:Arial,Helvetica,sans-serif;color:#1b1b19">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:560px;background:#fff" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 32px;border-bottom:3px solid ${accent};font-size:20px;font-weight:bold">${esc(s.agencyName)}</td></tr>
<tr><td style="padding:28px 32px;font-size:15px;line-height:1.6">${inner}</td></tr>
<tr><td style="padding:16px 32px;background:#fafaf8;font-size:12px;color:#777">${esc([s.address, s.phone, s.email].filter(Boolean).join(' · '))}</td></tr>
</table></td></tr></table></body></html>`
}

export type Mail = { to: string; subject: string; html: string; replyTo?: string }

/** Sends with the SMTP details from Site Settings (or env), else logs through Payload. */
export async function sendMail(payload: Payload, mail: Mail, s?: SiteSetting) {
  const settings = s || (await getSettingsAdmin(payload))
  const tr = transportFor(settings)
  if (!tr) {
    payload.logger.info(`Email not sent (SMTP not set up). To: ${mail.to}, Subject: ${mail.subject}`)
    return { sent: false as const }
  }
  await tr.t.sendMail({ from: tr.from, to: mail.to, subject: mail.subject, html: mail.html, replyTo: mail.replyTo })
  return { sent: true as const }
}
