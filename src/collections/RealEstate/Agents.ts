import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '../../access/anyone'
import { adminOnly, isAdminUser, agentIdOf } from '../../access/roles'

export const Agents: CollectionConfig = {
  slug: 'agents',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'jobTitle', 'email', 'phone'], group: 'Real Estate' },
  access: {
    read: anyone,
    create: adminOnly,
    delete: adminOnly,
    update: ({ req: { user } }) => (isAdminUser(user as never) ? true : user ? { id: { equals: agentIdOf(user as never) } } : false),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField({ useAsSlug: 'name', required: false }),
    { name: 'jobTitle', type: 'text', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
      ],
    },
    { name: 'bio', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'whatsapp', type: 'text', admin: { description: 'Number with country code, e.g. +353871234567' } },
      ],
    },
  ],
}
