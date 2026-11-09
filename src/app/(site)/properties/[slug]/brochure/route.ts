import { getProperty, getSite, siteUrl } from '@/site/data'
import { renderBrochure } from '@/site/brochure'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [p, s] = await Promise.all([getProperty(slug), getSite()])
  if (!p || s.brochureEnabled === false) return new Response('Not found', { status: 404 })
  const origin = siteUrl() || new URL(req.url).origin
  const pdf = await renderBrochure(p, s, `${origin}${s.$.L(`/properties/${p.slug}`)}`)
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${p.slug}-brochure.pdf"`,
      'Cache-Control': 'private, max-age=300',
    },
  })
}
