import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { sendLeadEmails } from '../../hooks/sendLeadEmails'

export const Viewings: CollectionConfig = {
  slug: 'viewings',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'property', 'preferredDate', 'status'], group: 'Leads' },
  access: { create: anyone, read: authenticated, update: authenticated, delete: authenticated },
  defaultSort: '-createdAt',
  hooks: { afterChange: [sendLeadEmails('viewing')] },
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
  ],
}
