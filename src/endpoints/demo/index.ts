import type { CollectionSlug, Endpoint, Payload, PayloadRequest, Where } from 'payload'
import { PHOTOS, type PhotoKey } from './photos'
import { PAGE_TEMPLATES, POST_TEMPLATES } from '../../blocks/site/templates'
import { h, p as para, rt } from '../../lib/lexical'

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
  { photo: 'agentEleanor' as PhotoKey, name: 'Eleanor Hart', jobTitle: 'Managing director', email: 'eleanor@example.com', phone: '+1 555 0100', bio: 'Leads the sales team and handles the agency’s most exceptional homes personally.' },
  { photo: 'agentJames' as PhotoKey, name: 'James Okafor', jobTitle: 'Senior sales agent', email: 'james@example.com', phone: '+1 555 0101', bio: 'Specialist in family homes on the north side of the city.' },
  { photo: 'agentSofia' as PhotoKey, name: 'Sofia Marin', jobTitle: 'Lettings manager', email: 'sofia@example.com', phone: '+1 555 0102', bio: 'Looks after landlords and tenants from first viewing to renewal.' },
  { photo: 'agentDaniel' as PhotoKey, name: 'Daniel Reyes', jobTitle: 'Valuer', email: 'daniel@example.com', phone: '+1 555 0103', bio: 'Prices homes with evidence from every sale on the street.' },
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
  labels?: string[]
  custom?: [string, string?][]
  energyClass?: string
  yearBuilt?: number
  parent?: string
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
    labels: ['Exclusive'], custom: [['Swimming pool'], ['Parking spaces', '2']], energyClass: 'A', yearBuilt: 2021,
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
    labels: ['New build'], custom: [['Garden'], ['Parking spaces', '1']], energyClass: 'B', yearBuilt: 2019,
  },
  {
    title: 'Harbour View Penthouse', status: 'for-sale', propertyType: 'apartment', price: 2350000, bedrooms: 3, bathrooms: 3, floorArea: 220, energyRating: 'A2', featured: true, agent: 0,
    summary: 'The top floor of the harbour building, wrapped in terraces with views across the water.',
    description: [
      'Occupying the entire top floor, this penthouse is arranged around a vast living space with glass on three sides and terraces on every side.',
      'Three bedroom suites, a separate media room and two parking spaces complete the picture. The concierge and gym are on the ground floor.',
    ],
    features: ['Wraparound terraces', 'Views across the harbour', '24-hour concierge', 'Two parking spaces', 'Residents’ gym'],
    town: 'Old Harbour', line1: 'Harbour Building, Quay Street', lat: 32.7157, lng: -117.1729, photos: ['living4', 'living3', 'kitchen3', 'bedroom3', 'bathroom2', 'pool1'],
    custom: [['Sea view'], ['Parking spaces', '2']], yearBuilt: 2016,
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
    labels: ['Exclusive'], custom: [['Swimming pool'], ['Sea view']], energyClass: 'Aplus', yearBuilt: 2018,
  },
  {
    title: 'Garden House, Maple Lane', status: 'for-sale', propertyType: 'house', price: 1100000, bedrooms: 4, bathrooms: 2, floorArea: 198, energyRating: 'C1', agent: 1,
    summary: 'A bright mid-century house with a planted front garden on a quiet lane.',
    description: [
      'A well-kept mid-century house with a generous kitchen, a sunny living room and four bedrooms, set behind a planted front garden.',
    ],
    features: ['Planted front garden', 'Four bedrooms', 'Close to the station', 'Off-street parking'],
    town: 'Northgate', line1: '12 Maple Lane', lat: 32.7641, lng: -117.1430, photos: ['exterior4', 'kitchen3', 'living5'],
    labels: ['Price reduced'], custom: [['Garden']], yearBuilt: 1962,
  },
  {
    title: 'The Old Rectory', status: 'sale-agreed', propertyType: 'house', price: 895000, bedrooms: 3, bathrooms: 2, floorArea: 165, energyRating: 'B3', agent: 3,
    summary: 'A handsome brick period house behind a walled front garden, close to the village.',
    description: ['Original sash windows and shutters, a kitchen at the back opening onto the garden, and three bedrooms upstairs.'],
    features: ['Walled front garden', 'Original sash windows', 'Period fireplaces'],
    town: 'Westfield', line1: 'Church Lane', lat: 32.7395, lng: -117.2398, photos: ['exterior5', 'kitchen2', 'bedroom1'],
    energyClass: 'D', yearBuilt: 1890,
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
  {
    title: 'Riverside Quarter', status: 'for-sale', propertyType: 'development', price: 690000, priceQualifier: 'from', bedrooms: 3, bathrooms: 2, floorArea: 140, energyRating: 'A2', agent: 1,
    summary: 'A new development of twelve apartments by the river, with the first homes ready in spring.',
    description: ['Riverside Quarter is a collection of twelve apartments and penthouses with balconies over the water, a residents’ garden and underground parking.', 'Choose from two and three bedroom homes, all with A-rated energy performance.'],
    features: ['River views', 'Residents’ garden', 'Underground parking', 'A-rated homes'],
    town: 'Riverside', line1: 'River Walk', lat: 32.7560, lng: -117.2150, photos: ['exterior2', 'living3', 'kitchen1'], labels: ['New build'], energyClass: 'A', yearBuilt: 2027,
  },
  {
    title: 'Riverside Quarter, Apartment 2A', status: 'for-sale', propertyType: 'apartment', price: 690000, bedrooms: 2, bathrooms: 2, floorArea: 92, energyRating: 'A2', agent: 1, parent: 'Riverside Quarter',
    summary: 'A two-bedroom apartment on the second floor with a balcony over the river.',
    description: ['Two double bedrooms, two bathrooms and an open-plan living room opening onto a balcony with river views.'],
    features: ['Balcony', 'River views', 'Parking space'],
    town: 'Riverside', line1: 'River Walk', lat: 32.7561, lng: -117.2151, photos: ['living3', 'kitchen1', 'bedroom3'], labels: ['New build'], custom: [['Parking spaces', '1']], energyClass: 'A', yearBuilt: 2027,
  },
  {
    title: 'Riverside Quarter, Penthouse 5', status: 'sale-agreed', propertyType: 'apartment', price: 1150000, bedrooms: 3, bathrooms: 3, floorArea: 150, energyRating: 'A2', agent: 1, parent: 'Riverside Quarter',
    summary: 'The top-floor penthouse with a roof terrace.',
    description: ['Three bedroom suites and a private roof terrace looking up and down the river.'],
    features: ['Roof terrace', 'Two parking spaces'],
    town: 'Riverside', line1: 'River Walk', lat: 32.7562, lng: -117.2149, photos: ['living4', 'bedroom4', 'bathroom2'], labels: ['New build'], custom: [['Parking spaces', '2']], energyClass: 'A', yearBuilt: 2027,
  },
]

const LABELS = [
  { name: 'New build', color: '#1D4ED8', icon: 'new' },
  { name: 'Price reduced', color: '#B42318', icon: 'star' },
  { name: 'Exclusive', color: '#8A6A3F', icon: 'star' },
]
const FIELDS = [
  { name: 'Swimming pool', icon: 'pool', showOnCard: true },
  { name: 'Parking spaces', icon: 'parking', unit: '' },
  { name: 'Sea view', icon: 'sea', showOnCard: true },
  { name: 'Garden', icon: 'garden' },
]
const DEMO_PAGES = ['about-us', 'sell-your-home', 'living-in-hillcrest']
const DEMO_POSTS = ['autumn-market-update', 'new-office-opening', 'first-time-buyer-guide']
const DEMO_CATS = ['news', 'market-updates', 'guides']

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
    // Headshots are cropped around the face to a 4:5 portrait so the team looks consistent.
    const params = 'portrait' in photo ? 'w=900&h=1125&fit=crop&crop=faces&q=80&fm=jpg' : 'w=1920&q=80&fm=jpg&fit=max'
    // Unsplash can rate-limit a burst of downloads from a fresh server, so retry with a pause.
    let data: Buffer | null = null
    for (let attempt = 1; attempt <= 4 && !data; attempt++) {
      try {
        const res = await fetch(`${photo.url}?${params}`, { redirect: 'follow', signal: AbortSignal.timeout(30000) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        data = Buffer.from(await res.arrayBuffer())
      } catch (e) {
        if (attempt === 4) throw e
        await new Promise((r) => setTimeout(r, attempt * 2000))
      }
    }
    if (!data) throw new Error('no data')
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

const DEMO_SLUGS = ['riverside-quarter', 'riverside-quarter-apartment-2a', 'riverside-quarter-penthouse-5', 'the-old-rectory', 'linden-house', 'harbour-view-penthouse', 'villa-serena', '12-maple-terrace', 'orchard-cottage', 'the-boathouse', 'garden-apartment-elm-court', 'palm-court-residence', 'garden-house-maple-lane']

/** Removes only the demo listings, demo agents and demo photos. Your own content is untouched. */
/** Bulk delete works in pages, so repeat until nothing matches (a reset with more than one page of demo items left some behind). */
async function deleteAll(payload: Payload, collection: CollectionSlug, where: Where, req?: PayloadRequest) {
  for (let i = 0; i < 50; i++) {
    const { totalDocs } = await payload.count({ collection, where, req, overrideAccess: true })
    if (!totalDocs) return
    await payload.delete({ collection, where, req, overrideAccess: true })
  }
}

async function removeDemo(payload: Payload, req?: PayloadRequest) {
  const deals = await payload.find({ collection: 'deals', where: { contactEmail: { like: '@example.com' } }, limit: 500, depth: 0, req, overrideAccess: true })
  if (deals.docs.length) await deleteAll(payload, 'activities', { deal: { in: deals.docs.map((d) => d.id) } }, req)
  await deleteAll(payload, 'deals', { contactEmail: { like: '@example.com' } }, req)
  await deleteAll(payload, 'properties', { slug: { in: DEMO_SLUGS } }, req)
  await deleteAll(payload, 'pages', { slug: { in: DEMO_PAGES } }, req)
  await deleteAll(payload, 'posts', { slug: { in: DEMO_POSTS } }, req)
  await deleteAll(payload, 'categories', { slug: { in: DEMO_CATS } }, req)
  // Demo labels and custom fields go too, unless one of your own listings uses them.
  for (const [collection, names, path] of [['property-labels', LABELS.map((l) => l.name), 'labels'], ['property-fields', FIELDS.map((f) => f.name), 'customFields.field']] as const) {
    const found = await payload.find({ collection, where: { name: { in: names } }, limit: 100, depth: 0, req, overrideAccess: true })
    for (const d of found.docs) {
      const used = await payload.count({ collection: 'properties', where: { [path]: { in: [d.id] } }, req, overrideAccess: true })
      if (!used.totalDocs) await payload.delete({ collection, id: d.id, req, overrideAccess: true })
    }
  }
  await deleteAll(payload, 'agents', { email: { like: '@example.com' } }, req)
  const keys = Object.keys(PHOTOS)
  await deleteAll(payload, 'media', { or: keys.map((k) => ({ filename: { like: `${k}` } })) }, req)
}

export async function seedDemo(payload: Payload, req?: PayloadRequest, reset = false) {
  if (reset) await removeDemo(payload, req)
  const existing = await payload.count({ collection: 'properties', where: { slug: { in: DEMO_SLUGS } }, req, overrideAccess: true })
  if (existing.totalDocs > 0) return { skipped: true, message: 'The demo content is already loaded. Use Reset demo content to load it again.' }

  const cache = new Map<PhotoKey, number>()
  // The homepage hero and Sell page images come first, so they never miss out if later downloads are throttled.
  const heroImage = await fetchPhoto(payload, 'exterior1', cache)
  const sellImage = await fetchPhoto(payload, 'living1', cache)
  const agentIds: number[] = []
  for (const { photo, ...a } of AGENTS) {
    const photoId = await fetchPhoto(payload, photo, cache)
    const doc = await payload.create({ collection: 'agents', data: { ...a, photo: photoId }, req })
    agentIds.push(doc.id as number)
  }

  const labelIds: Record<string, number> = {}
  for (const l of LABELS) {
    const found = await payload.find({ collection: 'property-labels', where: { name: { equals: l.name } }, limit: 1, req, overrideAccess: true })
    labelIds[l.name] = found.docs[0]?.id ?? (await payload.create({ collection: 'property-labels', data: { ...l, icon: l.icon as never, filterable: true }, req, overrideAccess: true })).id
  }
  const fieldIds: Record<string, number> = {}
  for (const f of FIELDS) {
    const found = await payload.find({ collection: 'property-fields', where: { name: { equals: f.name } }, limit: 1, req, overrideAccess: true })
    fieldIds[f.name] = found.docs[0]?.id ?? (await payload.create({ collection: 'property-fields', data: { ...f, icon: f.icon as never }, req, overrideAccess: true })).id
  }
  const created: Record<string, number> = {}

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
        labels: (p.labels || []).map((n) => labelIds[n]!).filter(Boolean),
        customFields: (p.custom || []).map(([name, value]) => ({ field: fieldIds[name]!, value: value || undefined })),
        energyClass: (p.energyClass as never) || undefined,
        yearBuilt: p.yearBuilt,
        parent: p.parent ? created[p.parent] : undefined,
      },
    }).then((doc) => (created[p.title] = doc.id))
  }

  /* Pages from the ready-made templates, with demo photos dropped in. */
  const pagePhotos = [await fetchPhoto(payload, 'living2', cache), await fetchPhoto(payload, 'exterior3', cache), await fetchPhoto(payload, 'kitchen2', cache)].filter(Boolean) as number[]
  const withImages = (layout: Record<string, unknown>[], town?: string) => {
    let i = 0
    const json = JSON.stringify(layout).replace(/Area name/g, town || 'Area name')
    return (JSON.parse(json) as Record<string, unknown>[]).map((b) => {
      if (['hero', 'imageText', 'ctaBanner'].includes(b.blockType as string) && !b.image && b.style !== 'minimal') return { ...b, image: pagePhotos[i++ % pagePhotos.length] }
      if (b.blockType === 'gallery') return { ...b, images: pagePhotos }
      return b
    })
  }
  const pages: [string, string, string, string?][] = [
    ['About us', 'about-us', 'about'],
    ['Sell your home', 'sell-your-home', 'sell'],
    ['Living in Hillcrest', 'living-in-hillcrest', 'area', 'Hillcrest'],
  ]
  for (const [title, slug, template, town] of pages) {
    await payload.create({ collection: 'pages', req, overrideAccess: true, data: { title, slug, _status: 'published', layout: withImages(PAGE_TEMPLATES[template]!.layout(), town) as never } })
  }

  /* Blog: categories and three articles. */
  const cats: Record<string, number> = {}
  for (const [title, slug] of [['News', 'news'], ['Market updates', 'market-updates'], ['Guides', 'guides']]) {
    cats[slug!] = (await payload.create({ collection: 'categories', req, overrideAccess: true, data: { title: title!, slug } })).id
  }
  const day = (n: number) => new Date(Date.now() - n * 86400_000).toISOString()
  const posts = [
    { title: 'Autumn market update', slug: 'autumn-market-update', categories: [cats['market-updates']!], excerpt: 'Prices held steady this autumn while the number of homes for sale rose. Here is what it means for buyers and sellers.', content: POST_TEMPLATES.market!.content(), heroImage: pagePhotos[1], publishedAt: day(3) },
    { title: 'We have opened a new office', slug: 'new-office-opening', categories: [cats.news!], excerpt: 'Our second office opens on the high street next month, with longer opening hours at weekends.', content: rt(para('Our second office opens on the high street next month. It will be open seven days a week, with viewings available until 8pm on weekdays.'), para('Drop in for a coffee and a chat about the market, or book a valuation online.')), heroImage: pagePhotos[0], publishedAt: day(10) },
    { title: 'A first-time buyer’s guide', slug: 'first-time-buyer-guide', categories: [cats.guides!], excerpt: 'From mortgage approval to moving day: the steps, the costs and the questions to ask.', content: rt(para('Buying your first home is exciting and a little daunting. This guide takes you through each step.'), h('h2', 'Get mortgage approval first'), para('Sellers take offers more seriously when you have approval in principle.'), h('h2', 'Budget for the extras'), para('Legal fees, surveys, taxes and moving costs add up. Allow for them from the start.'), h('h2', 'View more than once'), para('Go back at a different time of day, and check the street at night.')), heroImage: pagePhotos[2], publishedAt: day(21) },
  ]
  for (const p of posts) {
    await payload.create({ collection: 'posts', req, overrideAccess: true, data: { ...p, _status: 'published' } as never })
  }

  /* A few CRM deals so the pipeline board is not empty. */
  const dealsDemo: [string, string, string, number][] = [
    ['Anna Lindqvist', 'new', 'Palm Court Residence', 1850000],
    ['Marcus Bell', 'viewing', 'Linden House', 1240000],
    ['Priya Shah', 'offer', 'Harbour View Penthouse', 2300000],
    ['Tom & Ruth Avery', 'agreed', 'The Old Rectory', 880000],
  ]
  for (const [name, stage, prop, value] of dealsDemo) {
    const deal = await payload.create({ collection: 'deals', req, overrideAccess: true, data: { title: `${name} · ${prop}`, stage: stage as never, contactName: name, contactEmail: `${name.split(' ')[0]!.toLowerCase()}@example.com`, property: created[prop], value, source: 'property' } })
    await payload.create({ collection: 'activities', req, overrideAccess: true, data: { deal: deal.id, type: 'note', summary: 'Demo deal. Delete it any time.' } })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    req,
    data: { ...(heroImage ? { heroImage } : {}), ...(sellImage ? { sellImage } : {}) },
  })

  return { skipped: false, message: `Added ${AGENTS.length} agents, ${DEMO.length} properties, ${pages.length} pages, ${posts.length} articles and ${cache.size} photos.`, photosOk }
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
