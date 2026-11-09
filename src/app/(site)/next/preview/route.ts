import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.searchParams.get('path') || '/'
  const secret = url.searchParams.get('previewSecret')
  const expected = process.env.PREVIEW_SECRET || process.env.PAYLOAD_SECRET?.slice(0, 16) || ''
  if (!secret || secret !== expected || !path.startsWith('/')) return new Response('Not allowed', { status: 403 })
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('Log in to preview drafts', { status: 403 })
  ;(await draftMode()).enable()
  redirect(path)
}
