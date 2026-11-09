import type { Endpoint, Payload, PayloadRequest } from 'payload'
import { PHOTOS, type PhotoKey } from './photos'

type Lexical = { root: Record<string, unknown> }

const richText = (...paragraphs: string[]): Lexical => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
    })),
  },
})

const AGENTS = [
  { name: 'Eleanor Hart', jobTitle: 'Managing director', email: 'eleanor@example.com', phone: '+1 555 0100', bio: 'Leads the sales team and handles the agency’s most exceptional homes personally.' },
  { name: 'James Okafor', jobTitle: 'Senior sales agent', email: 'james@example.com', phone: '+1 555 0101', bio: 'Specialist in family homes on the north side of the city.' },
  { name: 'Sofia Marin', jobTitle: 'Lettings manager', email: 'sofia@example.com', phone: '+1 555 0102', bio: 'Looks after landlords and tenants from first viewing to renewal.' },
  { name: 'Daniel Reyes', jobTitle: 'Valuer', email: 'daniel@example.com', phone: '+1 555 0103', bio: 'Prices homes with evidence from every sale on the street.' },
]

type Demo = {
  title: string
  status: string
  propertyType: string
  price: number
  pricePeriod?: 'total' | 'month'
  priceQualifier?: string
  openHouse?: boolean
  bedrooms: number
  bathrooms: number
  floorArea: number
  energyRating: string
  summary: string
  description: string[]
  features: string[]
  town: string
  line1: string
  lat: number
  lng: number
  featured?: boolean
  agent: number
  photos: PhotoKey[]
}

const DEMO: Demo[] = [
  {
    title: 'Palm Court Residence', status: 'for-sale', propertyType: 'house', price: 1850000, priceQualifier: 'offers-over', bedrooms: 5, bathrooms: 4, floorArea: 410, energyRating: 'A2', featured: true, agent: 0,
    summary: 'A contemporary family home wrapped around a pool terrace, minutes from the beach.',
    description: [
      'Palm Court Residence was designed around light and the outdoors. Floor-to-ceiling glass opens the living spaces onto a stone terrace and a lap pool shaded by palms.',
      'The kitchen runs the full width of the house. Upstairs, five bedrooms include a main suite with a dressing room and a bathroom overlooking the garden.',
    ],
    features: ['Pool and stone terrace', 'Floor-to-ceiling glazing', 'Open-plan kitchen with island', 'Cedar ceilings', 'Main suite with dressing room', 'Double garage'],
    town: 'Riverside', line1: '4 Palm Court', lat: 32.7505, lng: -117.2195, photos: ['exterior1', 'living1', 'kitchen1', 'bedroom1', 'bathroom1'], openHouse: true,
  },
  {
    title: 'Linden House', status: 'for-sale', propertyType: 'house', price: 1240000, bedrooms: 4, bathrooms: 3, floorArea: 285, energyRating: 'A3', featured: true, agent: 1,
    summary: 'A light, modern family house with a south-facing garden, close to the best schools.',
    description: [
      'Built in 2019 to a high specification, Linden House is bright, warm and easy to live in. Floor-to-ceiling glazing frames the garden from the kitchen and family room.',
      'Four double bedrooms, three bathrooms and a study make it ideal for a growing family, with the park and schools a short walk away.',
    ],
    features: ['South-facing garden', 'Underfloor heating', 'Home office', 'Electric car charger', 'Walk to schools and park'],
    town: 'Hillcrest', line1: '8 Linden Avenue', lat: 32.7462, lng: -117.1640, photos: ['exterior2', 'kitchen2', 'living2', 'bedroom2'],
  },
  {
    title: 'Harbour View Penthouse', status: 'for-sale', propertyType: 'apartment', price: 2350000, bedrooms: 3, bathrooms: 3, floorArea: 220, energyRating: 'A2', featured: true, agent: 0,
    summary: 'The top floor of the harbour building, wrapped in terraces with views across the water.',
    description: [
      'Occupying the entire top floor, this penthouse is arranged around a vast living space with glass on three sides and terraces on every side.',
      'Three bedroom suites, a separate media room and two parking spaces complete the picture. The concierge and gym are on the ground floor.',
    ],
    features: ['Wraparound terraces', 'Views across the harbour', '24-hour concierge', 'Two parking spaces', 'Residents’ gym'],
    town: 'Old Harbour', line1: 'Harbour Building, Quay Street', lat: 32.7157, lng: -117.1729, photos: ['pool1', 'living3', 'kitchen3', 'bedroom3', 'bathroom2'],
  },
  {
    title: 'Villa Serena', status: 'for-sale', propertyType: 'house', price: 6400000, bedrooms: 6, bathrooms: 6, floorArea: 620, energyRating: 'A1', featured: true, agent: 0,
    summary: 'A clifftop villa of stone and glass, its pool set level with the horizon.',
    description: [
      'Villa Serena sits on one of the coast’s most private plots, with uninterrupted views from every main room. Stone, oak and glass give it a calm, timeless feel.',
      'Six suites, a pool terrace, a guest house and gardens that step down towards the sea.',
    ],
    features: ['Infinity pool', 'Guest house', 'Sea views from every main room', 'Gated, private plot', 'Wine room'],
    town: 'Cliffside', line1: 'Cliff Road', lat: 32.8328, lng: -117.2713, photos: ['pool2', 'exterior3', 'living4', 'bedroom4'],
  },
  {
    title: 'Garden House, Maple Lane', status: 'for-sale', propertyType: 'house', price: 1100000, bedrooms: 4, bathrooms: 2, floorArea: 198, energyRating: 'C1', agent: 1,
    summary: 'A bright mid-century house with a planted front garden on a quiet lane.',
    description: [
      'A well-kept mid-century house with a generous kitchen, a sunny living room and four bedrooms, set behind a planted front garden.',
    ],
    features: ['Planted front garden', 'Four bedrooms', 'Close to the station', 'Off-street parking'],
    town: 'Northgate', line1: '12 Maple Lane', lat: 32.7641, lng: -117.1430, photos: ['exterior4', 'kitchen3', 'living5'],
  },
  {
    title: 'The Old Rectory', status: 'sale-agreed', propertyType: 'house', price: 895000, bedrooms: 3, bathrooms: 2, floorArea: 165, energyRating: 'B3', agent: 3,
    summary: 'A handsome brick period house behind a walled front garden, close to the village.',
    description: ['Original sash windows and shutters, a kitchen at the back opening onto the garden, and three bedrooms upstairs.'],
    features: ['Walled front garden', 'Original sash windows', 'Period fireplaces'],
    town: 'Westfield', line1: 'Church Lane', lat: 32.7395, lng: -117.2398, photos: ['exterior5', 'kitchen2', 'bedroom1'],
  },
  {
    title: 'The Boathouse', status: 'to-let', propertyType: 'house', price: 4200, pricePeriod: 'month', bedrooms: 3, bathrooms: 2, floorArea: 142, energyRating: 'B1', agent: 2,
    summary: 'A converted boathouse on the water, available furnished for a long let.',
    description: ['Open-plan living above the water with a jetty, two bathrooms and a sun deck. Available furnished.'],
    features: ['Private jetty', 'Sun deck', 'Furnished', 'Available now'],
    town: 'Lakeside', line1: 'Shore Road', lat: 32.7700, lng: -117.2510, photos: ['pool3', 'living2', 'bedroom2'],
  },
  {
    title: 'Garden Apartment, Elm Court', status: 'to-let', propertyType: 'apartment', price: 2850, pricePeriod: 'month', bedrooms: 2, bathrooms: 2, floorArea: 96, energyRating: 'A3', agent: 2,
    summary: 'A two-bedroom apartment with its own garden in a modern building.',
    description: ['Two bedrooms, two bathrooms and a private garden, in a well-run building with secure parking.'],
    features: ['Private garden', 'Secure parking', 'Lift', 'Unfurnished'],
    town: 'Hillcrest', line1: 'Elm Court', lat: 32.7512, lng: -117.1555, photos: ['living1', 'kitchen1', 'bathroom1'],
  },
]

function nextSaturday() {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + ((6 - d.getUTCDay() + 7) % 7 || 7))
  d.setUTCHours(11, 0, 0, 0)
  const end = new Date(d)
  end.setUTCHours(12, 30)
  return { start: d.toISOString(), end: end.toISOString() }
}

async function fetchPhoto(payload: Payload, key: PhotoKey, cache: Map<PhotoKey, number>) {
  if (cache.has(key)) return cache.get(key)!
  const photo = PHOTOS[key]
  if (!photo) return undefined
  try {
    const res = await fetch(`${photo.url}?w=1920&q=80&fm=jpg&fit=max`, { redirect: 'follow' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = Buffer.from(await res.arrayBuffer())
    const doc = await payload.create({
      collection: 'media',
      data: { alt: photo.alt },
      file: { data, mimetype: 'image/jpeg', name: `${key}.jpg`, size: data.length },
    })
    cache.set(key, doc.id as number)
    return doc.id as number
  } catch (err) {
    payload.logger.warn({ err, msg: `Demo photo ${key} could not be downloaded, skipping` })
    return undefined
  }
}

const DEMO_SLUGS = ['the-old-rectory', 'linden-house', 'harbour-view-penthouse', 'villa-serena', '12-maple-terrace', 'orchard-cottage', 'the-boathouse', 'garden-apartment-elm-court', 'palm-court-residence', 'garden-house-maple-lane']

/** Removes only the demo listings, demo agents and demo photos. Your own content is untouched. */
async function removeDemo(payload: Payload, req?: PayloadRequest) {
  await payload.delete({ collection: 'properties', where: { slug: { in: DEMO_SLUGS } }, req, overrideAccess: true })
  await payload.delete({ collection: 'agents', where: { email: { like: '@example.com' } }, req, overrideAccess: true })
  const keys = Object.keys(PHOTOS)
  await payload.delete({ collection: 'media', where: { or: keys.map((k) => ({ filename: { like: `${k}` } })) }, req, overrideAccess: true })
}

export async function seedDemo(payload: Payload, req?: PayloadRequest, reset = false) {
  if (reset) await removeDemo(payload, req)
  const existing = await payload.count({ collection: 'properties', req })
  if (existing.totalDocs > 0) return { skipped: true, message: 'Properties already exist, nothing was added.' }

  const cache = new Map<PhotoKey, number>()
  const agentIds: number[] = []
  for (const a of AGENTS) {
    const doc = await payload.create({ collection: 'agents', data: a, req })
    agentIds.push(doc.id as number)
  }

  let photosOk = 0
  for (const p of DEMO) {
    const gallery: number[] = []
    for (const key of p.photos) {
      const id = await fetchPhoto(payload, key, cache)
      if (id) {
        gallery.push(id)
        photosOk++
      }
    }
    await payload.create({
      collection: 'properties',
      req,
      data: {
        title: p.title,
        status: p.status as never,
        propertyType: p.propertyType as never,
        price: p.price,
        pricePeriod: p.pricePeriod || 'total',
        priceQualifier: (p.priceQualifier as never) || undefined,
        openHouses: p.openHouse ? [nextSaturday()] : undefined,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        floorArea: p.floorArea,
        energyRating: p.energyRating,
        summary: p.summary,
        description: richText(...p.description) as never,
        features: p.features.map((feature) => ({ feature })),
        gallery,
        address: { line1: p.line1, town: p.town },
        lat: p.lat,
        lng: p.lng,
        featured: Boolean(p.featured),
        agent: agentIds[p.agent],
      },
    })
  }

  const heroImage = await fetchPhoto(payload, 'exterior1', cache)
  const sellImage = await fetchPhoto(payload, 'living1', cache)
  await payload.updateGlobal({
    slug: 'site-settings',
    req,
    data: { ...(heroImage ? { heroImage } : {}), ...(sellImage ? { sellImage } : {}) },
  })

  return { skipped: false, message: `Added ${AGENTS.length} agents, ${DEMO.length} properties and ${cache.size} photos.`, photosOk }
}

export const seedDemoEndpoint: Endpoint = {
  path: '/seed-demo',
  method: 'post',
  handler: async (req) => {
    if (!req.user || (req.user as { role?: string }).role === 'agent') return Response.json({ error: 'Admins only.' }, { status: 403 })
    try {
      const reset = new URL(req.url || 'http://x').searchParams.get('reset') === '1'
      const result = await seedDemo(req.payload, req, reset)
      return Response.json(result)
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Demo seed failed' })
      return Response.json({ error: 'Demo content could not be added. See the server log.' }, { status: 500 })
    }
  },
}
