import type { Endpoint } from 'payload'
import { isAdminUser } from '@/access/roles'
import { freeSlots } from '@/lib/slots'
import { track } from '@/lib/stats'
import { mlsSync } from '@/lib/mls'
import { importListings } from '@/lib/importer'
import { nearbyPlaces } from '@/lib/geo'

const ipOf = (h: Headers) => (h.get('x-forwarded-for') || '').split(',')[0]?.trim() || h.get('x-real-ip') || ''

export const siteEndpoints: Endpoint[] = [
  {
    path: '/viewing-slots',
    method: 'get',
    handler: async (req) => {
      const id = Number(new URL(req.url || '', 'http://x').searchParams.get('property'))
      if (!id) return Response.json({ error: 'property required' }, { status: 400 })
      const s = (await req.payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })) as { viewingSlots?: Parameters<typeof freeSlots>[1] }
      if (!s.viewingSlots?.enabled) return Response.json({ enabled: false })
      return Response.json({ enabled: true, ...(await freeSlots(req.payload, s.viewingSlots, id)) })
    },
  },
  {
    path: '/track',
    method: 'post',
    handler: async (req) => {
      try {
        const body = (await req.json?.()) as { path?: string; referrer?: string }
        const h = req.headers
        await track(req.payload, { path: String(body?.path || '').slice(0, 300), referrer: body?.referrer, ua: h.get('user-agent') || '', ip: ipOf(h), host: h.get('host') || '' })
      } catch {
        // never fail a page for stats
      }
      return new Response(null, { status: 204 })
    },
  },
  {
    path: '/nearby/:id',
    method: 'get',
    handler: async (req) => {
      const id = Number(req.routeParams?.id)
      const s = (await req.payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true, showHiddenFields: true })) as { features?: { nearbyPlaces?: boolean; walkScore?: boolean; walkScoreKey?: string } }
      const f = s.features || {}
      if (!id || (!f.nearbyPlaces && !f.walkScore)) return Response.json({})
      const p = await req.payload.findByID({ collection: 'properties', id, depth: 0, overrideAccess: false, req, disableErrors: true })
      if (!p || typeof p.lat !== 'number' || typeof p.lng !== 'number') return Response.json({})
      const fresh = p.nearbyAt && Date.now() - new Date(p.nearbyAt).getTime() < 30 * 86400_000
      let nearby = p.nearby as unknown
      let walk = p.walkScore as unknown
      const patch: Record<string, unknown> = {}
      if (f.nearbyPlaces && (!fresh || !nearby)) {
        const places = await nearbyPlaces(p.lat, p.lng)
        if (places) {
          nearby = places
          patch.nearby = places
        }
      }
      if (f.walkScore && f.walkScoreKey && (!fresh || !walk)) {
        try {
          const addr = [p.address?.line1, p.address?.town, p.address?.region, p.address?.postcode].filter(Boolean).join(', ')
          const r = await fetch(`https://api.walkscore.com/score?format=json&transit=1&bike=1&address=${encodeURIComponent(addr)}&lat=${p.lat}&lon=${p.lng}&wsapikey=${encodeURIComponent(f.walkScoreKey)}`, { signal: AbortSignal.timeout(8000) })
          const j = (await r.json()) as { status: number; walkscore?: number; description?: string; transit?: { score?: number; description?: string }; bike?: { score?: number; description?: string }; ws_link?: string }
          if (j.status === 1) {
            walk = { walk: j.walkscore, walkText: j.description, transit: j.transit?.score, transitText: j.transit?.description, bike: j.bike?.score, bikeText: j.bike?.description, link: j.ws_link }
            patch.walkScore = walk
          }
        } catch {
          // ignore, try again next time
        }
      }
      if (Object.keys(patch).length) {
        await req.payload.update({ collection: 'properties', id, data: { ...patch, nearbyAt: new Date().toISOString() } as never, overrideAccess: true, context: { quiet: true } })
      }
      return Response.json({ nearby: f.nearbyPlaces ? nearby || [] : undefined, walkScore: f.walkScore ? walk || null : undefined })
    },
  },
  {
    path: '/mls-sync',
    method: 'post',
    handler: async (req) => {
      if (!isAdminUser(req.user as never)) return Response.json({ error: 'Admins only.' }, { status: 403 })
      const mode = (new URL(req.url || '', 'http://x').searchParams.get('mode') || 'update') as 'full' | 'update' | 'test'
      const r = await mlsSync(req.payload, ['full', 'update', 'test'].includes(mode) ? mode : 'update')
      return Response.json(r, { status: r.ok ? 200 : 400 })
    },
  },
  {
    path: '/import-listings',
    method: 'post',
    handler: async (req) => {
      if (!isAdminUser(req.user as never)) return Response.json({ error: 'Admins only.' }, { status: 403 })
      const body = (await req.json?.()) as { filename?: string; content?: string; dryRun?: boolean; downloadPhotos?: boolean; updateExisting?: boolean }
      if (!body?.content) return Response.json({ error: 'Choose a file first.' }, { status: 400 })
      const r = await importListings(req.payload, body.filename || 'import.csv', body.content, { dryRun: body.dryRun, downloadPhotos: body.downloadPhotos, updateExisting: body.updateExisting })
      return Response.json(r)
    },
  },
]
