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
