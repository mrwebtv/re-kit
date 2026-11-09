import { getFeed } from '@/site/feed'

export const dynamic = 'force-dynamic'

const x = (v: unknown) => String(v ?? '').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] as string)

export async function GET() {
  const feed = await getFeed()
  if (!feed) return new Response('Not found', { status: 404 })
  const items = feed.items
    .map((p) => {
      const tags = Object.entries({ id: p.id, ref: p.ref, url: p.url, title: p.title, listing: p.listing, status: p.status, type: p.type, price: p.price, price_period: p.pricePeriod, price_qualifier: p.priceQualifier, bedrooms: p.bedrooms, bathrooms: p.bathrooms, floor_area_sqm: p.floorAreaSqm, energy_rating: p.energyRating, summary: p.summary, address: [p.address.line1, p.address.town, p.address.region, p.address.postcode].filter(Boolean).join(', '), town: p.address.town, postcode: p.address.postcode, latitude: p.lat, longitude: p.lng, updated: p.updatedAt })
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .map(([k, v]) => `    <${k}>${x(v)}</${k}>`)
        .join('\n')
      const features = p.features.map((f) => `      <feature>${x(f)}</feature>`).join('\n')
      const images = p.images.map((u) => `      <image>${x(u)}</image>`).join('\n')
      const agent = p.agent ? `    <agent><name>${x(p.agent.name)}</name><email>${x(p.agent.email)}</email><phone>${x(p.agent.phone)}</phone></agent>` : ''
      return `  <property>\n${tags}\n    <features>\n${features}\n    </features>\n    <images>\n${images}\n    </images>\n${agent}\n  </property>`
    })
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<properties agency="${x(feed.s.agencyName)}" currency="${x(feed.s.currencyCode || 'USD')}" generated="${new Date().toISOString()}">\n${items}\n</properties>\n`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
