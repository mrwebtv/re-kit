import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { adminOnly, adminOrOwnAgent } from '../../access/roles'
import { consentFields, handleNewLead, requireConsent } from '../../hooks/leads'
import { honeypotField, rateLimitPublic } from '../../hooks/antiSpam'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'type', 'property', 'status', 'createdAt'], group: 'Leads' },
  access: { create: anyone, read: adminOrOwnAgent('property.agent'), update: adminOrOwnAgent('property.agent'), delete: adminOnly },
  defaultSort: '-createdAt',
  hooks: { beforeValidate: [rateLimitPublic, requireConsent], afterChange: [handleNewLead('enquiry')] },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'property',
          options: [
            { label: 'Property enquiry', value: 'property' },
            { label: 'Valuation request', value: 'valuation' },
            { label: 'General contact', value: 'contact' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          access: { create: () => false },
          options: ['new', 'contacted', 'closed'].map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v })),
        },
      ],
    },
    { name: 'property', type: 'relationship', relationTo: 'properties' },
    { name: 'name', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    { name: 'propertyAddress', type: 'text', admin: { description: 'For valuation requests' } },
    { name: 'message', type: 'textarea' },
    honeypotField,
    ...consentFields,
  ],
}
