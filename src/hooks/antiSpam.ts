import type { CollectionBeforeValidateHook, Field } from 'payload'
import { APIError } from 'payload'

/** Hidden "website" field: real visitors never see or fill it, bots usually do. */
export const honeypotField: Field = {
  name: 'website',
  type: 'text',
  admin: { hidden: true },
  validate: (value: string | null | undefined) => !value || 'Rejected',
}

const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

/** Limits public form submissions to 5 per 10 minutes per IP. Logged-in admins are not limited. */
export const rateLimitPublic: CollectionBeforeValidateHook = ({ operation, req, data }) => {
  if (operation !== 'create' || req.user || req.payloadAPI === 'local') return data
  const fwd = req.headers.get('x-forwarded-for') || ''
  const ip = fwd.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    throw new APIError('Too many requests. Please try again in a few minutes.', 429)
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return data
}

/** Token from Turnstile / reCAPTCHA, checked and never stored. */
export const captchaField: Field = { name: 'captchaToken', type: 'text', virtual: true, admin: { hidden: true } }

/** When Site Settings > Features > Spam check is on, public submissions need a valid captcha token. */
export const verifyCaptcha: CollectionBeforeValidateHook = async ({ operation, req, data }) => {
  if (operation !== 'create' || req.user || req.payloadAPI === 'local' || !data) return data
  const s = (await req.payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })) as {
    features?: { captcha?: boolean | null; captchaProvider?: string | null; captchaSecret?: string | null }
  }
  const f = s.features
  if (!f?.captcha || !f.captchaSecret) return data
  const token = data.captchaToken
  if (!token) throw new APIError('Please complete the spam check and try again.', 400)
  const url = f.captchaProvider === 'recaptcha' ? 'https://www.google.com/recaptcha/api/siteverify' : 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  try {
    const res = await fetch(url, { method: 'POST', body: new URLSearchParams({ secret: f.captchaSecret, response: String(token) }), signal: AbortSignal.timeout(8000) })
    const j = (await res.json()) as { success?: boolean; score?: number }
    if (!j.success || (typeof j.score === 'number' && j.score < 0.5)) throw new Error('failed')
  } catch {
    throw new APIError('The spam check failed. Please try again.', 400)
  }
  delete data.captchaToken
  return data
}
