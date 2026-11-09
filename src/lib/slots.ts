import type { Payload } from 'payload'

export type SlotSettings = { enabled?: boolean | null; days?: string[] | null; start?: string | null; end?: string | null; slotMinutes?: number | null; noticeHours?: number | null; daysAhead?: number | null; timezone?: string | null }

/** Minutes the zone is ahead of UTC at a given instant. */
function offsetMinutes(at: number, tz: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(at))
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  return (Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute')) - Math.floor(at / 60000) * 60000) / 60000
}

function zonedToUtc(y: number, m: number, d: number, hh: number, mm: number, tz: string) {
  const guess = Date.UTC(y, m, d, hh, mm)
  const first = guess - offsetMinutes(guess, tz) * 60000
  return guess - offsetMinutes(first, tz) * 60000
}

function zonedDate(at: number, tz: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }).formatToParts(new Date(at))
  const g = (t: string) => parts.find((p) => p.type === t)?.value || ''
  return { y: Number(g('year')), m: Number(g('month')) - 1, d: Number(g('day')), wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')) }
}

const hm = (v: string | null | undefined, dflt: string) => {
  const [h, m] = (v || dflt).split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

const validTz = (tz?: string | null) => {
  try {
    if (tz) new Intl.DateTimeFormat('en-US', { timeZone: tz })
    return tz || 'UTC'
  } catch {
    return 'UTC'
  }
}

/** All bookable slot start times (UTC ISO) for the coming days, grouped by local date. */
export function allSlots(s: SlotSettings, now = Date.now()) {
  const tz = validTz(s.timezone)
  const step = Math.max(10, s.slotMinutes || 30)
  const startM = hm(s.start, '09:00')
  const endM = hm(s.end, '18:00')
  const days = new Set((s.days?.length ? s.days : ['1', '2', '3', '4', '5', '6']).map(Number))
  const earliest = now + (s.noticeHours ?? 24) * 3600_000
  const out: { date: string; slots: string[] }[] = []
  for (let i = 0; i <= Math.min(60, s.daysAhead || 14); i++) {
    const z = zonedDate(now + i * 86400_000, tz)
    if (!days.has(z.wd)) continue
    const slots: string[] = []
    for (let t = startM; t + step <= endM; t += step) {
      const at = zonedToUtc(z.y, z.m, z.d, Math.floor(t / 60), t % 60, tz)
      if (at >= earliest) slots.push(new Date(at).toISOString())
    }
    if (slots.length) out.push({ date: `${z.y}-${String(z.m + 1).padStart(2, '0')}-${String(z.d).padStart(2, '0')}`, slots })
  }
  return { tz, step, days: out }
}

/** Slots minus the ones already requested or confirmed for this property. */
export async function freeSlots(payload: Payload, s: SlotSettings, propertyId: number) {
  const all = allSlots(s)
  const flat = all.days.flatMap((d) => d.slots)
  if (!flat.length) return all
  const taken = await payload.find({
    collection: 'viewings',
    where: { and: [{ property: { equals: propertyId } }, { status: { in: ['requested', 'confirmed'] } }, { preferredDate: { greater_than_equal: flat[0] } }] },
    limit: 500,
    depth: 0,
    overrideAccess: true,
    select: { preferredDate: true },
  })
  const busy = new Set(taken.docs.map((v) => new Date(v.preferredDate).toISOString()))
  return { ...all, days: all.days.map((d) => ({ ...d, slots: d.slots.filter((x) => !busy.has(x)) })).filter((d) => d.slots.length) }
}
