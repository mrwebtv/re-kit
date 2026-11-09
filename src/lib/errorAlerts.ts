import type { Payload } from 'payload'
import { esc, getSettingsAdmin, layout, sendMail } from './mailer'

let lastSent = 0
let hooked = false

export async function reportError(payload: Payload, err: unknown, where: string) {
  try {
    if (Date.now() - lastSent < 15 * 60 * 1000) return
    const s = await getSettingsAdmin(payload)
    if (!s.features?.errorAlerts || !s.features.errorAlertEmail) return
    lastSent = Date.now()
    const e = err instanceof Error ? err : new Error(String(err))
    await sendMail(payload, {
      to: s.features.errorAlertEmail,
      subject: `[${s.agencyName}] Website error`,
      html: layout(s, `<p><strong>${esc(where)}</strong></p><p>${esc(e.message)}</p><pre style="white-space:pre-wrap;font-size:12px;background:#f6f6f4;padding:12px">${esc((e.stack || '').slice(0, 3000))}</pre><p style="font-size:12px;color:#777">Further errors are held back for 15 minutes.</p>`),
    }, s)
  } catch {
    // never let alerting throw
  }
}

export function hookProcessErrors(payload: Payload) {
  if (hooked || process.env.NEXT_PHASE === 'phase-production-build') return
  hooked = true
  process.on('unhandledRejection', (reason) => void reportError(payload, reason, 'Unhandled promise rejection'))
  process.on('uncaughtException', (err) => void reportError(payload, err, 'Uncaught exception'))
}
