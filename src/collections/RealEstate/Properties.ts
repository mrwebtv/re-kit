import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone } from '../../access/anyone'
import { adminOrOwnAgent, agentIdOf, isAgentUser, loggedIn } from '../../access/roles'

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'status', 'propertyType', 'agent'],
    group: 'Real Estate',
  },
  access: { read: anyone, create: loggedIn, update: adminOrOwnAgent('agent'), delete: adminOrOwnAgent('agent') },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Agents can only list properties under their own name.
        if (isAgentUser(req.user as never)) data.agent = agentIdOf(req.user as never)
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ required: false }),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'for-sale',
                  index: true,
                  options: [
                    { label: 'For sale', value: 'for-sale' },
                    { label: 'Sale agreed', value: 'sale-agreed' },
                    { label: 'Sold', value: 'sold' },
                    { label: 'To let', value: 'to-let' },
                    { label: 'Let', value: 'let' },
                  ],
                },
                {
                  name: 'propertyType',
                  type: 'select',
                  index: true,
                  options: ['house', 'apartment', 'townhouse', 'bungalow', 'site', 'commercial'].map((v) => ({
                    label: v[0].toUpperCase() + v.slice(1),
                    value: v,
                  })),
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'price', type: 'number', required: true, min: 0, index: true },
                {
                  name: 'pricePeriod',
                  type: 'select',
                  defaultValue: 'total',
                  options: [
                    { label: 'Total', value: 'total' },
                    { label: 'Per month', value: 'month' },
                  ],
                },
                {
                  name: 'priceQualifier',
                  type: 'select',
                  options: ['Offers over', 'Offers in the region of', 'Guide price', 'From', 'Fixed price', 'Asking price'].map((v) => ({ label: v, value: v.toLowerCase().replace(/ /g, '-') })),
                  admin: { description: 'Shown before the price, e.g. "Offers over"' },
                },
                { name: 'priceOnRequest', type: 'checkbox' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'bedrooms', type: 'number', min: 0, index: true },
                { name: 'bathrooms', type: 'number', min: 0 },
                { name: 'floorArea', type: 'number', min: 0, admin: { description: 'm²' } },
              ],
            },
            { name: 'energyRating', type: 'text', admin: { description: 'e.g. BER B2, EPC C' } },
            { name: 'summary', type: 'textarea', maxLength: 300 },
            { name: 'description', type: 'richText' },
            { name: 'features', type: 'array', fields: [{ name: 'feature', type: 'text', required: true }] },
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
            { name: 'floorPlans', type: 'upload', relationTo: 'media', hasMany: true },
            { name: 'videoUrl', type: 'text', admin: { description: 'YouTube or Vimeo link. Shown when "Video and virtual tours" is on in Site Settings > Features.' } },
            { name: 'tourUrl', label: '3D tour URL', type: 'text', admin: { description: 'Matterport, Kuula or similar embed link.' } },
            { name: 'brochure', label: 'Custom brochure (PDF)', type: 'upload', relationTo: 'media', admin: { description: 'Optional. Replaces the automatically generated brochure.' } },
          ],
        },
        {
          label: 'Location',
          fields: [
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'line1', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'town', type: 'text', index: true },
                    { name: 'region', type: 'text' },
                    { name: 'postcode', type: 'text' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'lat', type: 'number' },
                { name: 'lng', type: 'number' },
              ],
            },
          ],
        },
      ],
    },
    { name: 'agent', type: 'relationship', relationTo: 'agents', admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
    {
      name: 'openHouses',
      type: 'array',
      admin: { position: 'sidebar', description: 'Shown when "Open houses" is on in Site Settings > Features.' },
      fields: [
        { name: 'start', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'end', type: 'date', admin: { date: { pickerAppearance: 'timeOnly' } } },
      ],
    },
  ],
}
