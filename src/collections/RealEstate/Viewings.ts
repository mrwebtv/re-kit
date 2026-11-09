import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { adminOnly, adminOrOwnAgent } from '../../access/roles'
import { consentFields, handleNewLead, requireConsent } from '../../hooks/leads'
import { captchaField, honeypotField, rateLimitPublic, verifyCaptcha } from '../../hooks/antiSpam'
import { APIError, type CollectionBeforeValidateHook } from 'payload'
import { freeSlots } from '../../lib/slots'

/** With time slots on, a public request must use a free slot. */
const checkSlot: CollectionBeforeValidateHook = async ({ operation, req, data }) => {
  if (operation !== 'create' || req.user || req.payloadAPI === 'local' || !data?.property || !data.preferredDate) return data
  const s = (await req.payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })) as { viewingSlots?: Parameters<typeof freeSlots>[1] }
  if (!s.viewingSlots?.enabled) return data
  const free = await freeSlots(req.payload, s.viewingSlots, Number(data.property))
  const want = new Date(data.preferredDate).toISOString()
  if (!free.days.some((d) => d.slots.includes(want))) throw new APIError('That time is no longer available. Please pick another slot.', 400)
  return data
}

export const Viewings: CollectionConfig = {
  slug: 'viewings',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'property', 'preferredDate', 'status'], group: 'Leads' },
  access: { create: anyone, read: adminOrOwnAgent('property.agent'), update: adminOrOwnAgent('property.agent'), delete: adminOnly },
  defaultSort: '-createdAt',
  hooks: { beforeValidate: [rateLimitPublic, verifyCaptcha, requireConsent, checkSlot], afterChange: [handleNewLead('viewing')] },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    {
      type: 'row',
      fields: [
        { name: 'preferredDate', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'requested',
          access: { create: () => false },
          options: ['requested', 'confirmed', 'completed', 'cancelled'].map((v) => ({
            label: v[0].toUpperCase() + v.slice(1),
            value: v,
          })),
        },
      ],
    },
    { name: 'name', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    { name: 'message', type: 'textarea' },
    honeypotField,
    captchaField,
    ...consentFields,
  ],
}
