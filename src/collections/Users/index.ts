import type { CollectionConfig } from 'payload'
import { adminOnly, adminOnlyField, isAdminUser } from '../../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: adminOnly,
    delete: adminOnly,
    read: ({ req: { user } }) => (isAdminUser(user as never) ? true : user ? { id: { equals: user.id } } : false),
    update: ({ req: { user } }) => (isAdminUser(user as never) ? true : user ? { id: { equals: user.id } } : false),
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
    group: 'Settings',
    hidden: ({ user }) => !isAdminUser(user as never),
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 60 * 60 * 8,
  },
  hooks: {
    beforeChange: [
      async ({ operation, data, req }) => {
        // The very first account is always an admin.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req, overrideAccess: true })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'adminSkin',
      label: 'Admin design',
      type: 'select',
      defaultValue: 'studio',
      options: [
        { label: 'Studio (light, modern)', value: 'studio' },
        { label: 'Midnight (dark)', value: 'midnight' },
        { label: 'Estate (warm, classic)', value: 'estate' },
        { label: 'Essential (plain)', value: 'essential' },
      ],
      admin: { position: 'sidebar', description: 'How this admin looks for you. Also switchable at the bottom of the menu.' },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'agent',
      required: true,
      options: [
        { label: 'Admin (full access)', value: 'admin' },
        { label: 'Agent (own listings and leads only)', value: 'agent' },
      ],
      access: { create: adminOnlyField, update: adminOnlyField },
      admin: { position: 'sidebar' },
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      access: { create: adminOnlyField, update: adminOnlyField },
      admin: {
        position: 'sidebar',
        description: 'For agent accounts: the agent profile this login manages.',
        condition: (data) => data?.role === 'agent',
      },
    },
  ],
  timestamps: true,
}
