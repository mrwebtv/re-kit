import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { adminOrOwnAgent, agentIdOf, isAgentUser, loggedIn } from '../../access/roles'
import { geocode } from '../../lib/geo'

const assignAgent: CollectionBeforeChangeHook = ({ data, req }) => {
  // Agents can only list properties under their own name.
  if (isAgentUser(req.user as never)) data.agent = agentIdOf(req.user as never)
  return data
}

/** REF-1001 style reference, prefix from Site Settings > Listings. */
const assignReference: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation !== 'create' || data.reference) return data
  const s = await req.payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true }).catch(() => null)
  const prefix = (s as { refPrefix?: string } | null)?.refPrefix ?? 'REF-'
  const { totalDocs } = await req.payload.count({ collection: 'properties', overrideAccess: true })
  for (let n = 1001 + totalDocs; n < 1001 + totalDocs + 50; n++) {
    const ref = `${prefix}${n}`
    const clash = await req.payload.count({ collection: 'properties', where: { reference: { equals: ref } }, overrideAccess: true })
    if (!clash.totalDocs) {
      data.reference = ref
      break
    }
  }
  return data
}

/** Fills in map coordinates from the address when they are left empty (OpenStreetMap Nominatim). */
const fillCoordinates: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (req.payloadAPI === 'local' && !req.context?.geocode) return data
  if (typeof data.lat === 'number' && typeof data.lng === 'number') return data
  const a = data.address || {}
  const q = [a.line1, a.town, a.region, a.postcode].filter(Boolean).join(', ')
  if (!q) return data
  const hit = await geocode(q)
  if (hit) {
    data.lat = hit.lat
    data.lng = hit.lng
  }
  return data
}

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'reference', 'price', 'status', 'agent', 'source'],
    group: 'Real Estate',
    listSearchableFields: ['title', 'reference', 'address.town', 'address.postcode'],
  },
  access: {
    // Expired listings disappear from the public site but stay in the admin.
    read: ({ req: { user } }) =>
      user ? true : { or: [{ expiresAt: { exists: false } }, { expiresAt: { greater_than: new Date().toISOString() } }] },
    create: loggedIn,
    update: adminOrOwnAgent('agent'),
    delete: adminOrOwnAgent('agent'),
  },
  defaultSort: '-createdAt',
  hooks: { beforeChange: [assignAgent, assignReference, fillCoordinates] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
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
                  options: ['house', 'apartment', 'townhouse', 'bungalow', 'villa', 'site', 'commercial', 'development'].map((v) => ({
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
                { name: 'yearBuilt', type: 'number', min: 1000, max: 2100 },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'energyRating', type: 'text', admin: { description: 'Free text, e.g. BER B2' } },
                {
                  name: 'energyClass',
                  type: 'select',
                  options: ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].map((v) => ({ label: v, value: v.replace('+', 'plus') })),
                  admin: { description: 'Shows the EU energy scale graphic' },
                },
              ],
            },
            { name: 'summary', type: 'textarea', maxLength: 300, localized: true },
            { name: 'description', type: 'richText', localized: true },
            { name: 'features', type: 'array', fields: [{ name: 'feature', type: 'text', required: true, localized: true }] },
            {
              name: 'customFields',
              type: 'array',
              admin: { description: 'Your own details, defined under Real Estate > Custom fields.', initCollapsed: false },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'field', type: 'relationship', relationTo: 'property-fields', required: true },
                    { name: 'value', type: 'text', admin: { description: 'Leave empty for yes/no fields' } },
                  ],
                },
              ],
            },
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
            {
              name: 'attachments',
              type: 'array',
              admin: { description: 'Extra downloads shown on the property page, e.g. energy certificate, title plan.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true },
                    { name: 'file', type: 'upload', relationTo: 'media', required: true },
                  ],
                },
              ],
            },
            {
              name: 'externalPhotos',
              type: 'array',
              admin: { description: 'Photo links from an MLS feed or import. Used when the gallery is empty.', condition: (d) => Boolean(d?.externalPhotos?.length) },
              fields: [{ name: 'url', type: 'text', required: true }],
            },
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
                    { name: 'country', type: 'text' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'lat', type: 'number', index: true, admin: { description: 'Filled in from the address when left empty' } },
                { name: 'lng', type: 'number', index: true },
              ],
            },
            { name: 'nearby', type: 'json', admin: { hidden: true } },
            { name: 'nearbyAt', type: 'date', admin: { hidden: true } },
            { name: 'walkScore', type: 'json', admin: { hidden: true } },
          ],
        },
        {
          label: 'Private',
          fields: [
            {
              name: 'privateNotes',
              type: 'textarea',
              access: { read: ({ req }) => Boolean(req.user) },
              admin: { description: 'Only visible to logged-in staff. Keys, vendor details, viewing instructions.' },
            },
          ],
        },
        {
          label: 'Source',
          admin: { condition: (d) => d?.source && d.source !== 'manual' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'listingKey', type: 'text', index: true, admin: { readOnly: true, description: 'MLS ListingKey or import ID' } },
                { name: 'mlsNumber', type: 'text', admin: { readOnly: true } },
                { name: 'sourceUpdatedAt', type: 'date', admin: { readOnly: true } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'listOffice', type: 'text', admin: { description: 'Listing brokerage, shown for IDX compliance' } },
                { name: 'listAgentName', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
    { name: 'reference', type: 'text', index: true, admin: { position: 'sidebar', description: 'Created automatically, e.g. REF-1001' } },
    { name: 'agent', type: 'relationship', relationTo: 'agents', admin: { position: 'sidebar' } },
    { name: 'labels', type: 'relationship', relationTo: 'property-labels', hasMany: true, admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
    {
      name: 'parent',
      label: 'Part of development',
      type: 'relationship',
      relationTo: 'properties',
      admin: { position: 'sidebar', description: 'Makes this a unit inside another listing (sub-property).' },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    { name: 'expiresAt', type: 'date', index: true, admin: { position: 'sidebar', description: 'Hidden from the website after this date.' } },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      index: true,
      options: [
        { label: 'Added here', value: 'manual' },
        { label: 'MLS / IDX', value: 'mls' },
        { label: 'Import', value: 'import' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'stats',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '@/components/admin/PropertyStats#PropertyStats' } },
    },
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
