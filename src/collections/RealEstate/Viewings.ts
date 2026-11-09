import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { adminOnly, adminOrOwnAgent } from '../../access/roles'
import { consentFields, handleNewLead, requireConsent } from '../../hooks/leads'
import { honeypotField, rateLimitPublic } from '../../hooks/antiSpam'

export const Viewings: CollectionConfig = {
  slug: 'viewings',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'property', 'preferredDate', 'status'], group: 'Leads' },
  access: { create: anyone, read: adminOrOwnAgent('property.agent'), update: adminOrOwnAgent('property.agent'), delete: adminOnly },
  defaultSort: '-createdAt',
  hooks: { beforeValidate: [rateLimitPublic, requireConsent], afterChange: [handleNewLead('viewing')] },
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
    ...consentFields,
  ],
}
