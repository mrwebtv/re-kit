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
    title: 'The Old Rectory', status: 'for-sale', propertyType: 'house', price: 1850000, bedrooms: 5, bathrooms: 4, floorArea: 410, energyRating: 'B2', featured: true, agent: 0,
    summary: 'A restored period house in an acre of walled garden, opened up for family life.',
    description: [
      'Set back from a quiet lane behind a walled garden, The Old Rectory has been restored with care over the last decade. The original proportions remain: tall ceilings, deep sash windows and a staircase that turns around a light-filled hall.',
      'The kitchen now runs the full width of the house and opens onto a stone terrace. Upstairs, five bedrooms include a main suite with dressing room and a bathroom overlooking the orchard.',
    ],
    features: ['Walled garden, about one acre', 'Original sash windows', 'Open-plan kitchen with larder', 'Drawing room with open fire', 'Main suite with dressing room', 'Detached garage and workshop'],
    town: 'Riverside', line1: 'Church Lane', lat: 32.7505, lng: -117.2195, photos: ['exterior1', 'living1', 'kitchen1', 'bedroom1', 'bathroom1'],
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
    title: '12 Maple Terrace', status: 'for-sale', propertyType: 'townhouse', price: 1100000, bedrooms: 4, bathrooms: 2, floorArea: 198, energyRating: 'C1', agent: 1,
    summary: 'A handsome townhouse on a tree-lined terrace, minutes from the station.',
    description: [
      'A classic townhouse over four floors, with a generous kitchen at garden level and a double reception room on the first floor.',
    ],
    features: ['Double reception room', 'Garden with rear access', 'Close to the station', 'Original fireplaces'],
    town: 'Northgate', line1: '12 Maple Terrace', lat: 32.7641, lng: -117.1430, photos: ['exterior4', 'kitchen3', 'living5'],
  },
  {
    title: 'Orchard Cottage', status: 'sale-agreed', propertyType: 'bungalow', price: 895000, bedrooms: 3, bathrooms: 2, floorArea: 165, energyRating: 'B3', agent: 3,
    summary: 'A pretty cottage with an orchard garden at the edge of the village.',
    description: ['Single-storey living with a vaulted kitchen, three bedrooms and a garden of fruit trees.'],
    features: ['Orchard garden', 'Vaulted kitchen', 'Single-storey living'],
    town: 'Westfield', line1: 'Orchard Lane', lat: 32.7395, lng: -117.2398, photos: ['exterior5', 'kitchen2', 'bedroom1'],
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

export async function seedDemo(payload: Payload, req?: PayloadRequest) {
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
    if (!req.user) return Response.json({ error: 'Log in to the admin first.' }, { status: 401 })
    try {
      const result = await seedDemo(req.payload, req)
      return Response.json(result)
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Demo seed failed' })
      return Response.json({ error: 'Demo content could not be added. See the server log.' }, { status: 500 })
    }
  },
}
