import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { adminOnly } from '../../access/roles'
import { ICON_OPTIONS } from '../../site/icons'

/** Badges such as "New build" or "Price reduced", shown on cards and filterable on the listings page. */
export const PropertyLabels: CollectionConfig = {
  slug: 'property-labels',
  labels: { singular: 'Label', plural: 'Labels' },
  admin: { useAsTitle: 'name', group: 'Real Estate', defaultColumns: ['name', 'color', 'filterable'], description: 'Badges shown on property cards, for example "New build" or "Price reduced".' },
  access: { read: anyone, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'color', type: 'text', defaultValue: '#1B1B19', admin: { description: 'Badge colour, e.g. #B42318' } },
        { name: 'icon', type: 'select', options: ICON_OPTIONS },
        { name: 'filterable', type: 'checkbox', defaultValue: true, admin: { description: 'Offer as a filter on the listings page' } },
      ],
    },
  ],
}

/** Extra facts the agency defines once (Pool, Parking spaces, Year built...) and fills per property. */
export const PropertyFields: CollectionConfig = {
  slug: 'property-fields',
  labels: { singular: 'Custom field', plural: 'Custom fields' },
  admin: { useAsTitle: 'name', group: 'Real Estate', defaultColumns: ['name', 'icon', 'showOnCard'], description: 'Your own property details, e.g. "Sea view", "Parking spaces". Fill them on each property under Details > Custom fields.' },
  access: { read: anyone, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'icon', type: 'select', options: ICON_OPTIONS, defaultValue: 'check' },
        { name: 'unit', type: 'text', admin: { description: 'Optional, e.g. "spaces", "km"' } },
        { name: 'showOnCard', type: 'checkbox', admin: { description: 'Also show on listing cards' } },
      ],
    },
  ],
}
