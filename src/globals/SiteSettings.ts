import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const THEMES = [
  { label: 'Luxury editorial', value: 'editorial' },
  { label: 'Modern bright', value: 'modern' },
  { label: 'Dark premium', value: 'dark' },
  { label: 'Swiss bold', value: 'swiss' },
] as const

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Real Estate' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/', 'layout')
        } catch {
          // not in a Next.js request (seed or CLI)
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            {
              name: 'theme',
              type: 'select',
              required: true,
              defaultValue: 'editorial',
              options: THEMES.map((t) => ({ ...t })),
              admin: { description: 'The website design. Switching it changes the whole site instantly.' },
            },
            { name: 'agencyName', type: 'text', required: true, defaultValue: 'Aldridge & Vale' },
            { name: 'tagline', type: 'text', defaultValue: 'Private residences · Sales & lettings' },
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Optional. Without a logo the agency name is shown.' } },
            {
              name: 'accentColor',
              type: 'text',
              admin: { description: 'Optional hex colour, e.g. #8A6A3F. Blank = the theme default.' },
              validate: (v: string | null | undefined) => !v || /^#[0-9a-fA-F]{6}$/.test(v) || 'Use a hex colour like #8A6A3F',
            },
          ],
        },
        {
          label: 'Homepage',
          fields: [
            { name: 'heroHeadline', type: 'text', defaultValue: 'Homes of rare character.' },
            { name: 'heroText', type: 'textarea', defaultValue: 'Search every home we sell and let, book viewings online and talk to an agent who knows the area.' },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'sellImage', type: 'upload', relationTo: 'media', admin: { description: 'Image beside the valuation section.' } },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text' },
            { name: 'address', type: 'textarea' },
          ],
        },
        {
          label: 'Listings',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'currencySymbol', type: 'text', defaultValue: '$', admin: { width: '33%' } },
                { name: 'currencyCode', type: 'text', defaultValue: 'USD', admin: { width: '33%', description: 'For price formatting, e.g. USD, EUR, GBP' } },
                {
                  name: 'areaUnit',
                  type: 'select',
                  defaultValue: 'sqm',
                  options: [
                    { label: 'm²', value: 'sqm' },
                    { label: 'sq ft', value: 'sqft' },
                  ],
                  admin: { width: '33%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
