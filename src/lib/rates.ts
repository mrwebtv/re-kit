import type { Payload } from 'payload'

/** Exchange rates from the European Central Bank (via frankfurter.app), refreshed at most once a day. */
let mem: { base: string; at: number; rates: Record<string, number> } | null = null

export async function getRates(payload: Payload, base: string): Promise<Record<string, number>> {
  const day = 20 * 3600_000
  if (mem && mem.base === base && Date.now() - mem.at < day) return mem.rates
  const s = (await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })) as { ratesCache?: { base: string; at: number; rates: Record<string, number> } | null }
  const cached = s.ratesCache
  if (cached && cached.base === base && Date.now() - cached.at < day) {
    mem = cached
    return cached.rates
  }
  try {
    const res = await fetch(`${process.env.RATES_URL || 'https://api.frankfurter.app'}/latest?from=${encodeURIComponent(base)}`, { signal: AbortSignal.timeout(6000) })
    const j = (await res.json()) as { rates?: Record<string, number> }
    if (!j.rates) throw new Error('no rates')
    mem = { base, at: Date.now(), rates: { ...j.rates, [base]: 1 } }
    await payload.updateGlobal({ slug: 'site-settings', data: { ratesCache: mem } as never, overrideAccess: true, context: { skipRevalidate: true } })
    return mem.rates
  } catch {
    return cached?.rates || { [base]: 1 }
  }
}
