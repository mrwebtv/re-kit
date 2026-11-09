import { getFeed } from '@/site/feed'

export const dynamic = 'force-dynamic'

export async function GET() {
  const feed = await getFeed()
  if (!feed) return new Response('Not found', { status: 404 })
  return Response.json({ agency: feed.s.agencyName, currency: feed.s.currencyCode || 'USD', generatedAt: new Date().toISOString(), properties: feed.items })
}
