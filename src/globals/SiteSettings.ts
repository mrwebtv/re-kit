import type { Field, GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { adminOnly, adminOnlyField, isAdminUser } from '../access/roles'

export const THEMES = [
  { label: 'Luxury editorial', value: 'editorial' },
  { label: 'Modern bright', value: 'modern' },
  { label: 'Dark premium', value: 'dark' },
  { label: 'Swiss bold', value: 'swiss' },
] as const

/** Fields only admins can read (never exposed through the public API). */
const secret = (f: Field): Field => ({ ...f, access: { read: adminOnlyField, update: adminOnlyField } }) as Field

const toggle = (name: string, label: string, description: string): Field => ({
  name,
  label,
  type: 'checkbox',
  defaultValue: false,
  admin: { description },
})

const when = (flag: string) => ({ condition: (data: Record<string, unknown>) => Boolean((data?.features as Record<string, unknown>)?.[flag]) })

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Settings', hidden: ({ user }) => !isAdminUser(user as never) },
  access: { read: () => true, update: adminOnly },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidatePath('/', 'layout')
        } catch {
          // outside a Next.js request (seed or CLI)
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
            {
              type: 'row',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Optional. Without a logo the agency name is shown.' } },
                { name: 'favicon', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Square image, 512×512 PNG ideal.' } },
              ],
            },
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
            { name: 'email', type: 'email', admin: { description: 'Public contact email, also the inbox for general enquiries.' } },
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
                { name: 'currencyCode', type: 'text', defaultValue: 'USD', admin: { width: '33%', description: 'e.g. USD, EUR, GBP' } },
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
            { name: 'brochureEnabled', label: 'PDF brochure on every listing', type: 'checkbox', defaultValue: true },
            { name: 'brochureFooter', type: 'text', admin: { description: 'Small print at the bottom of each brochure page.', condition: (d) => Boolean(d?.brochureEnabled) }, defaultValue: 'Particulars are for guidance only and do not form part of any contract.' },
          ],
        },
        {
          label: 'Email',
          description: 'Where lead notifications are sent from. Hostinger Mail: smtp.hostinger.com, port 465, your full mailbox address and its password.',
          fields: [
            secret({ name: 'smtpHost', type: 'text', admin: { placeholder: 'smtp.hostinger.com' } }),
            {
              type: 'row',
              fields: [
                secret({ name: 'smtpPort', type: 'number', defaultValue: 465, admin: { width: '33%' } }),
                secret({ name: 'smtpUser', type: 'text', admin: { width: '33%' } }),
                secret({ name: 'smtpPass', label: 'SMTP password', type: 'text', admin: { width: '33%', description: 'Stored in your database, never shown on the website.' } }),
              ],
            },
            {
              type: 'row',
              fields: [
                secret({ name: 'emailFrom', type: 'email', admin: { width: '50%', description: 'Usually the same as the SMTP user.' } }),
                secret({ name: 'leadsInbox', type: 'email', admin: { width: '50%', description: 'Gets leads for properties with no agent, and a copy of every lead if "Copy all leads" is on.' } }),
              ],
            },
            secret({ name: 'copyAllLeads', type: 'checkbox', defaultValue: false, label: 'Copy all leads to the leads inbox' }),
            { name: 'testEmail', type: 'ui', admin: { components: { Field: '@/components/admin/TestEmailButton#TestEmailButton' } } },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaDescription', type: 'textarea', maxLength: 300, admin: { description: 'Default description for search engines and link previews.' } },
            { name: 'ogImage', label: 'Default share image', type: 'upload', relationTo: 'media', admin: { description: '1200×630. Used when a page has no photo of its own.' } },
            { name: 'noindex', label: 'Hide the site from search engines', type: 'checkbox', defaultValue: false, admin: { description: 'Turn on while the site is in development.' } },
          ],
        },
        {
          label: 'Legal',
          fields: [
            { name: 'companyName', type: 'text', admin: { description: 'Legal entity shown in the privacy policy and footer, e.g. "Aldridge & Vale Ltd".' } },
            { name: 'privacyPolicy', type: 'richText', admin: { description: 'Blank = a standard policy is generated from your agency name and contact details.' } },
            { name: 'consentText', type: 'text', defaultValue: 'I agree to my details being used to answer this request, as set out in the privacy policy.' },
            { name: 'showCredit', label: 'Show "Website by" credit in the footer', type: 'checkbox', defaultValue: false },
            { name: 'creditText', type: 'text', defaultValue: 'Website by Mr Web', admin: { condition: (d) => Boolean(d?.showCredit) } },
            { name: 'creditUrl', type: 'text', defaultValue: 'https://mrweb.tv', admin: { condition: (d) => Boolean(d?.showCredit) } },
          ],
        },
        {
          label: 'Features',
          description: 'Optional extras. All are off until you switch them on.',
          fields: [
            {
              name: 'features',
              type: 'group',
              label: false,
              fields: [
                toggle('videoTours', 'Video and virtual tours', 'Shows a video and/or 3D tour on listings that have one.'),
                toggle('openHouses', 'Open houses', 'Lets you add open-house dates to listings and shows them on the site.'),
                toggle('mortgageCalculator', 'Mortgage calculator', 'Adds a repayment calculator to properties for sale.'),
                {
                  type: 'row',
                  admin: when('mortgageCalculator'),
                  fields: [
                    { name: 'mortgageRate', type: 'number', defaultValue: 4.5, admin: { width: '33%', description: 'Default interest rate %' } },
                    { name: 'mortgageYears', type: 'number', defaultValue: 30, admin: { width: '33%', description: 'Default term in years' } },
                    { name: 'mortgageDeposit', type: 'number', defaultValue: 10, admin: { width: '33%', description: 'Default deposit %' } },
                  ],
                },
                toggle('searchAlerts', 'Saved-search email alerts', 'Visitors can subscribe to a search and get an email when a matching home is listed. Needs email set up.'),
                toggle('crmWebhook', 'Send leads to a CRM', 'Posts every new lead as JSON to a webhook, e.g. a GoHighLevel inbound webhook, Zapier or Make.'),
                secret({ name: 'webhookUrl', type: 'text', admin: { ...when('crmWebhook'), placeholder: 'https://services.leadconnectorhq.com/hooks/…' } }),
                toggle('propertyFeed', 'Property feed (XML and JSON)', 'Publishes /feed/properties.xml and /feed/properties.json for portals and partner sites.'),
                toggle('analytics', 'Analytics', 'Adds a visitor analytics script.'),
                {
                  type: 'row',
                  admin: when('analytics'),
                  fields: [
                    {
                      name: 'analyticsProvider',
                      type: 'select',
                      defaultValue: 'plausible',
                      options: [
                        { label: 'Plausible (no cookies)', value: 'plausible' },
                        { label: 'Umami (no cookies)', value: 'umami' },
                        { label: 'Google Analytics 4 (cookies, shows a consent banner)', value: 'ga4' },
                      ],
                      admin: { width: '40%' },
                    },
                    { name: 'analyticsId', type: 'text', admin: { width: '30%', description: 'Plausible: your domain. Umami: website ID. GA4: G-XXXX.' } },
                    { name: 'analyticsSrc', type: 'text', admin: { width: '30%', description: 'Script URL for self-hosted Plausible/Umami (optional).' } },
                  ],
                },
                toggle('errorAlerts', 'Error alert emails', 'Emails the admin when the server hits an error (max one email per 15 minutes).'),
                secret({ name: 'errorAlertEmail', type: 'email', admin: when('errorAlerts') }),
                toggle('leadRetention', 'Automatic lead deletion', 'Deletes enquiries and viewings older than the period below (GDPR data minimisation).'),
                { name: 'leadRetentionMonths', type: 'number', defaultValue: 24, min: 1, admin: when('leadRetention') },
              ],
            },
          ],
        },
      ],
    },
  ],
}
