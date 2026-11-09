/** Geocoding and nearby places via OpenStreetMap (Nominatim + Overpass). Free, no key, light use only. */
const UA = 'RealEstateKit/1.0 (+https://github.com/mrwebtv/re-kit)'
const cache = new Map<string, { lat: number; lng: number } | null>()
let last = 0

async function politely() {
  // Nominatim allows 1 request per second.
  const wait = last + 1100 - Date.now()
  if (wait > 0) await new Promise((r) => setTimeout(r, wait))
  last = Date.now()
}

export async function geocode(q: string): Promise<{ lat: number; lng: number } | null> {
  const key = q.trim().toLowerCase()
  if (!key) return null
  if (cache.has(key)) return cache.get(key)!
  try {
    await politely()
    const base = process.env.GEOCODER_URL || 'https://nominatim.openstreetmap.org'
    const res = await fetch(`${base}/search?format=json&limit=1&q=${encodeURIComponent(q)}`, { headers: { 'User-Agent': UA, 'Accept-Language': 'en' }, signal: AbortSignal.timeout(5000) })
    const j = (await res.json()) as { lat: string; lon: string }[]
    const hit = j[0] ? { lat: Number(j[0].lat), lng: Number(j[0].lon) } : null
    cache.set(key, hit)
    if (cache.size > 2000) cache.clear()
    return hit
  } catch {
    return null
  }
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

export type NearbyPlace = { kind: string; name: string; lat: number; lng: number; km: number }

const KINDS: [string, string][] = [
  ['school', 'amenity~"^(school|kindergarten|college|university)$"'],
  ['shop', 'shop~"^(supermarket|convenience|bakery|mall)$"'],
  ['transport', 'public_transport=station'],
  ['transport', 'railway~"^(station|tram_stop|subway_entrance)$"'],
  ['transport', 'highway=bus_stop'],
  ['health', 'amenity~"^(pharmacy|hospital|clinic|doctors)$"'],
  ['park', 'leisure~"^(park|playground)$"'],
  ['food', 'amenity~"^(restaurant|cafe|pub)$"'],
]

/** Up to 4 closest places per kind within 1.5 km. */
export async function nearbyPlaces(lat: number, lng: number): Promise<NearbyPlace[] | null> {
  const r = 1500
  const parts = KINDS.map(([, f]) => `nwr[${f}](around:${r},${lat},${lng});`).join('')
  const q = `[out:json][timeout:20];(${parts});out center 300;`
  try {
    const res = await fetch(process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(q),
      signal: AbortSignal.timeout(25000),
    })
    if (!res.ok) return null
    const j = (await res.json()) as { elements: { lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[] }
    const out: NearbyPlace[] = []
    for (const e of j.elements) {
      const t = e.tags || {}
      const p = e.center || (e.lat ? { lat: e.lat, lon: e.lon! } : null)
      if (!p || !t.name) continue
      const kind = t.amenity && /school|kindergarten|college|university/.test(t.amenity) ? 'school'
        : t.shop ? 'shop'
        : t.public_transport || t.railway || t.highway === 'bus_stop' ? 'transport'
        : t.amenity && /pharmacy|hospital|clinic|doctors/.test(t.amenity) ? 'health'
        : t.leisure ? 'park'
        : 'food'
      out.push({ kind, name: t.name, lat: p.lat, lng: p.lon, km: Math.round(distanceKm({ lat, lng }, { lat: p.lat, lng: p.lon }) * 100) / 100 })
    }
    const seen = new Set<string>()
    return out
      .sort((a, b) => a.km - b.km)
      .filter((x) => {
        const k = `${x.kind}:${x.name}`
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
      .filter((x, _, all) => all.filter((y) => y.kind === x.kind).indexOf(x) < 4)
  } catch {
    return null
  }
}
