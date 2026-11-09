import type { Endpoint } from 'payload'
import fs from 'fs'
import path from 'path'
import { isAdminUser } from '@/access/roles'
import { getSettingsAdmin, layout, sendMail } from '@/lib/mailer'

export const BACKUP_DIR = process.env.BACKUP_DIR || '/app/backups'

export const testEmailEndpoint: Endpoint = {
  path: '/test-email',
  method: 'post',
  handler: async (req) => {
    if (!isAdminUser(req.user as never)) return Response.json({ error: 'Admins only.' }, { status: 403 })
    const s = await getSettingsAdmin(req.payload)
    const to = s.leadsInbox || req.user!.email
    try {
      const r = await sendMail(req.payload, { to, subject: 'Test email from your website', html: layout(s, '<p>Email is working. Leads will be delivered from this address.</p>') }, s)
      if (!r.sent) return Response.json({ error: 'SMTP is not set up yet. Fill in the SMTP fields and save first.' }, { status: 400 })
      return Response.json({ message: `Test email sent to ${to}.` })
    } catch (err) {
      return Response.json({ error: `Sending failed: ${err instanceof Error ? err.message : err}` }, { status: 500 })
    }
  },
}

export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req) => {
    try {
      await req.payload.count({ collection: 'properties', overrideAccess: true })
      return Response.json({ status: 'ok', time: new Date().toISOString() })
    } catch {
      return Response.json({ status: 'error' }, { status: 503 })
    }
  },
}

export const backupsEndpoint: Endpoint = {
  path: '/backups/:file?',
  method: 'get',
  handler: async (req) => {
    if (!isAdminUser(req.user as never)) return Response.json({ error: 'Admins only.' }, { status: 403 })
    const files = fs.existsSync(BACKUP_DIR)
      ? fs.readdirSync(BACKUP_DIR).filter((f) => /^[\w.-]+\.(sql\.gz|tar\.gz)$/.test(f)).sort().reverse()
      : []
    const file = req.routeParams?.file as string | undefined
    if (!file) {
      return Response.json({ files: files.map((f) => ({ name: f, size: fs.statSync(path.join(BACKUP_DIR, f)).size, createdAt: fs.statSync(path.join(BACKUP_DIR, f)).mtime })) })
    }
    if (!files.includes(file)) return Response.json({ error: 'Not found' }, { status: 404 })
    const stream = fs.createReadStream(path.join(BACKUP_DIR, file))
    return new Response(stream as unknown as ReadableStream, {
      headers: { 'Content-Type': 'application/gzip', 'Content-Disposition': `attachment; filename="${file}"` },
    })
  },
}
