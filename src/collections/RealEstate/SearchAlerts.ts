import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import crypto from 'crypto'
import { adminOnly } from '../../access/roles'
import { honeypotField, rateLimitPublic } from '../../hooks/antiSpam'

export const SearchAlerts: CollectionConfig = {
  slug: 'search-alerts',
  labels: { singular: 'Search alert', plural: 'Search alerts' },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'summary', 'active', 'createdAt'], group: 'Leads' },
  access: { create: () => true, read: adminOnly, update: adminOnly, delete: adminOnly },
  hooks: {
    beforeValidate: [
      rateLimitPublic,
      async ({ operation, req, data }) => {
        if (operation !== 'create' || req.user || req.payloadAPI === 'local' || !data) return data
        const s = await req.payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
        if (!s.features?.searchAlerts) throw new APIError('Search alerts are not enabled.', 403)
        if (data.consent !== true) throw new APIError('Please tick the box to agree to the privacy policy.', 400)
        data.token = crypto.randomBytes(18).toString('hex')
        data.lastSentAt = new Date().toISOString()
        data.active = true
        return data
      },
    ],
  },
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'filters', type: 'json', admin: { description: 'The search the visitor subscribed to.' } },
    { name: 'summary', type: 'text' },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'consent', type: 'checkbox', admin: { readOnly: true } },
    { name: 'lastSentAt', type: 'date', admin: { readOnly: true } },
    { name: 'token', type: 'text', index: true, admin: { hidden: true }, access: { read: () => false } },
    honeypotField,
  ],
}
