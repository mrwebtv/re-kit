import type { Field, GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { adminOnly, adminOnlyField, isAdminUser } from '../access/roles'
import { LOCALES } from '../i18n/locales'

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

const HEX = /^#[0-9a-fA-F]{6}$/
/** A hex colour with the Elementor-style picker. */
const colour = (name: string, label: string, description: string): Field => ({
  name,
  label,
  type: 'text',
  admin: { description, components: { Field: '@/components/admin/ColorField#ColorField' } },
  validate: (v: string | null | undefined) => !v || HEX.test(v) || 'Use a hex colour like #8A6A3F',
})

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
            { name: 'tagline', type: 'text', localized: true, defaultValue: 'Private residences · Sales & lettings' },
            {
              type: 'row',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Optional. Without a logo the agency name is shown.' } },
                { name: 'favicon', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Square image, 512×512 PNG ideal.' } },
              ],
            },
            { name: 'accentColor', type: 'text', admin: { hidden: true } },
            {
              type: 'collapsible',
              label: 'Brand colours',
              admin: { initCollapsed: false, description: 'Your own colours on top of the chosen design. Leave any colour blank to keep the design default. Text on top of a colour is picked automatically for contrast unless you set it.' },
              fields: [
                {
                  type: 'group',
                  name: 'colors',
                  label: false,
                  admin: { hideGutter: true },
                  fields: [
                    {
                      type: 'row',
                      fields: [colour('primary', 'Primary', 'Buttons, links, prices and highlights.'), colour('onPrimary', 'Text on primary', 'Text on primary buttons. Blank = automatic.')],
                    },
                    {
                      type: 'row',
                      fields: [
                        colour('secondary', 'Secondary', 'Dark bands, footer and inverted sections.'),
                        colour('onSecondary', 'Text on secondary', 'Blank = automatic.'),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [colour('text', 'Text', 'Headings and body text.'), colour('muted', 'Muted text', 'Captions, labels and secondary text.')],
                    },
                    {
                      type: 'row',
                      fields: [
                        colour('background', 'Background', 'Page background.'),
                        colour('surface', 'Cards and panels', 'Cards, forms and side panels.'),
                        colour('border', 'Borders', 'Lines and dividers.'),
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Menu',
          description: 'Main menu. Leave empty to use the standard menu (Buy, Rent, Sell, Our agents, Contact). Add columns under an item to make a dropdown or mega menu.',
          fields: [
            {
              name: 'menu',
              type: 'array',
              admin: { initCollapsed: true, components: { RowLabel: '@/components/admin/RowLabel#LabelRow' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true },
                    { name: 'url', type: 'text', admin: { description: 'e.g. /properties?mode=buy or https://…' } },
                    { name: 'page', type: 'relationship', relationTo: 'pages', admin: { description: 'Or link to one of your pages' } },
                  ],
                },
                {
                  name: 'columns',
                  type: 'array',
                  admin: { description: 'One column = dropdown. Two or more = mega menu.', initCollapsed: true },
                  fields: [
                    { name: 'heading', type: 'text', localized: true },
                    {
                      name: 'links',
                      type: 'array',
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'label', type: 'text', required: true, localized: true },
                            { name: 'url', type: 'text' },
                            { name: 'page', type: 'relationship', relationTo: 'pages' },
                          ],
                        },
                      ],
                    },
                    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional picture for a mega menu column' } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'ctaLabel', label: 'Header button', type: 'text', localized: true, admin: { description: 'Blank = the design\'s own button' } },
                { name: 'ctaUrl', label: 'Header button link', type: 'text', admin: { description: 'Blank = /valuation' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'headerSticky', label: 'Sticky header', type: 'checkbox', defaultValue: true, admin: { description: 'Header stays at the top while scrolling.' } },
                { name: 'headerTransparent', label: 'Transparent header on the homepage', type: 'checkbox', defaultValue: false, admin: { description: 'Header sits over the hero image until you scroll.' } },
              ],
            },
          ],
        },
        {
          label: 'Homepage',
          fields: [
            {
              name: 'homePage',
              label: 'Use a page as the homepage',
              type: 'relationship',
              relationTo: 'pages',
              admin: { description: 'Optional. Blank = the theme homepage below. Pick a page built in Pages to use the page builder instead.' },
            },
            { name: 'heroHeadline', type: 'text', localized: true, defaultValue: 'Homes of rare character.' },
            { name: 'heroText', type: 'textarea', localized: true, defaultValue: 'Search every home we sell and let, book viewings online and talk to an agent who knows the area.' },
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
            {
              type: 'row',
              fields: [
                { name: 'refPrefix', label: 'Reference prefix', type: 'text', defaultValue: 'REF-', admin: { width: '33%', description: 'New listings get REF-1001, REF-1002…' } },
                {
                  name: 'defaultView',
                  label: 'Listings page layout',
                  type: 'select',
                  defaultValue: 'map',
                  options: [
                    { label: 'List with map (half map)', value: 'map' },
                    { label: 'Grid', value: 'grid' },
                    { label: 'List', value: 'list' },
                  ],
                  admin: { width: '33%', description: 'Visitors can still switch.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'favourites', label: 'Favourites (heart a listing)', type: 'checkbox', defaultValue: true },
                { name: 'compare', label: 'Compare listings', type: 'checkbox', defaultValue: true },
                { name: 'quickView', label: 'Quick view', type: 'checkbox', defaultValue: true },
              ],
            },
            { name: 'brochureEnabled', label: 'PDF brochure on every listing', type: 'checkbox', defaultValue: true },
            { name: 'brochureFooter', type: 'text', localized: true, admin: { description: 'Small print at the bottom of each brochure page.', condition: (d) => Boolean(d?.brochureEnabled) }, defaultValue: 'Particulars are for guidance only and do not form part of any contract.' },
          ],
        },
        {
          label: 'Viewings',
          description: 'How visitors pick a viewing time on a property page.',
          fields: [
            {
              name: 'viewingSlots',
              type: 'group',
              label: false,
              fields: [
                { name: 'enabled', label: 'Let visitors pick from set time slots', type: 'checkbox', defaultValue: true, admin: { description: 'Off = a free date and time box.' } },
                {
                  name: 'days',
                  type: 'select',
                  hasMany: true,
                  defaultValue: ['1', '2', '3', '4', '5', '6'],
                  options: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => ({ label: d, value: String(i) })),
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                },
                {
                  type: 'row',
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                  fields: [
                    { name: 'start', type: 'text', defaultValue: '09:00', admin: { width: '20%', description: 'First slot' } },
                    { name: 'end', type: 'text', defaultValue: '18:00', admin: { width: '20%', description: 'Last slot ends' } },
                    { name: 'slotMinutes', type: 'number', defaultValue: 30, min: 10, admin: { width: '20%', description: 'Minutes per viewing' } },
                    { name: 'noticeHours', type: 'number', defaultValue: 24, min: 0, admin: { width: '20%', description: 'Minimum notice (hours)' } },
                    { name: 'daysAhead', type: 'number', defaultValue: 14, min: 1, max: 60, admin: { width: '20%', description: 'Days bookable ahead' } },
                  ],
                },
                { name: 'timezone', type: 'text', defaultValue: 'Europe/London', admin: { condition: (_, s) => Boolean(s?.enabled), description: 'IANA time zone of your office, e.g. Europe/Dublin, America/New_York, Asia/Dubai' } },
              ],
            },
          ],
        },
        {
          label: 'Languages',
          description: 'Content is entered per language with the language switcher at the top of each edit screen. Untranslated text falls back to the main language.',
          fields: [
            {
              name: 'languages',
              type: 'select',
              hasMany: true,
              defaultValue: ['en'],
              options: LOCALES.map((l) => ({ label: l.label, value: l.code })),
              admin: { description: 'Languages live on the website. The main language is set by DEFAULT_LANGUAGE on the server (English if not set). Others get a /fr, /es… address.' },
            },
            { name: 'languageSwitcher', type: 'checkbox', defaultValue: true, admin: { description: 'Show a language switcher in the header when more than one language is live.' } },
          ],
        },
        {
          label: 'Currencies',
          fields: [
            { name: 'currencySwitcher', label: 'Currency switcher', type: 'checkbox', defaultValue: false, admin: { description: 'Lets visitors see prices in another currency. Rates update daily from the European Central Bank.' } },
            {
              name: 'currencies',
              type: 'select',
              hasMany: true,
              defaultValue: ['EUR', 'GBP', 'USD'],
              options: ['EUR', 'GBP', 'USD', 'CAD', 'AUD', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'JPY', 'CNY', 'HKD', 'SGD', 'INR', 'ZAR', 'AED', 'SAR', 'BRL', 'MXN', 'NZD', 'TRY'].map((c) => ({ label: c, value: c })),
              admin: { condition: (d) => Boolean(d?.currencySwitcher), description: 'Currencies offered in the switcher. Your listing currency is always included.' },
            },
            {
              name: 'currencyRates',
              label: 'Fixed rates (optional)',
              type: 'array',
              admin: { condition: (d) => Boolean(d?.currencySwitcher), description: 'Overrides the daily rate. 1 unit of your listing currency = rate.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'code', type: 'text', required: true },
                    { name: 'rate', type: 'number', required: true },
                  ],
                },
              ],
            },
            { name: 'ratesCache', type: 'json', admin: { hidden: true } },
          ],
        },
        {
          label: 'MLS / IDX',
          description: 'Import listings from an MLS through the RESO Web API (Bridge, Trestle, Spark, MLS Grid and others). Your MLS gives you the API address and credentials once your IDX agreement is approved.',
          fields: [
            {
              name: 'mls',
              type: 'group',
              label: false,
              fields: [
                { name: 'enabled', label: 'Sync listings from an MLS', type: 'checkbox', defaultValue: false },
                {
                  type: 'row',
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                  fields: [
                    {
                      name: 'provider',
                      type: 'select',
                      defaultValue: 'bridge',
                      options: [
                        { label: 'Bridge Interactive (Zillow)', value: 'bridge' },
                        { label: 'Trestle (CoreLogic)', value: 'trestle' },
                        { label: 'Spark Platform (FBS)', value: 'spark' },
                        { label: 'MLS Grid', value: 'mlsgrid' },
                        { label: 'Other RESO Web API', value: 'reso' },
                      ],
                      admin: { width: '40%' },
                    },
                    { name: 'mlsName', label: 'MLS name', type: 'text', admin: { width: '60%', description: 'Shown in the listing disclaimer' } },
                  ],
                },
                secret({ name: 'apiUrl', label: 'API address', type: 'text', admin: { condition: (_, s) => Boolean(s?.enabled), description: 'The OData base, e.g. https://api.bridgedataoutput.com/api/v2/OData/yourmls' } }),
                {
                  type: 'row',
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                  fields: [
                    {
                      name: 'auth',
                      type: 'select',
                      defaultValue: 'token',
                      options: [
                        { label: 'Access token', value: 'token' },
                        { label: 'OAuth client ID and secret', value: 'oauth' },
                      ],
                      admin: { width: '30%' },
                    },
                    secret({ name: 'accessToken', type: 'text', admin: { width: '70%', condition: (_, s) => s?.auth !== 'oauth' } }),
                  ],
                },
                {
                  type: 'row',
                  admin: { condition: (_, s) => Boolean(s?.enabled) && s?.auth === 'oauth' },
                  fields: [
                    secret({ name: 'tokenUrl', type: 'text', admin: { width: '40%', description: 'e.g. https://api-trestle.corelogic.com/trestle/oidc/connect/token' } }),
                    secret({ name: 'clientId', type: 'text', admin: { width: '20%' } }),
                    secret({ name: 'clientSecret', type: 'text', admin: { width: '20%' } }),
                    secret({ name: 'scope', type: 'text', defaultValue: 'api', admin: { width: '20%' } }),
                  ],
                },
                secret({ name: 'filter', label: 'Extra filter', type: 'text', admin: { condition: (_, s) => Boolean(s?.enabled), description: "Optional OData filter, e.g. City eq 'Austin' or ListOfficeMlsId eq 'ABC123'. Active and pending listings are always included." } }),
                {
                  type: 'row',
                  admin: { condition: (_, s) => Boolean(s?.enabled) },
                  fields: [
                    { name: 'syncHours', label: 'Sync every (hours)', type: 'number', defaultValue: 6, min: 1, admin: { width: '25%' } },
                    { name: 'maxListings', type: 'number', defaultValue: 2000, min: 1, admin: { width: '25%' } },
                    { name: 'includeSold', label: 'Keep sold listings', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
                    { name: 'defaultAgent', type: 'relationship', relationTo: 'agents', admin: { width: '25%', description: 'Agent for imported listings' } },
                  ],
                },
                { name: 'disclaimer', type: 'textarea', localized: true, admin: { condition: (_, s) => Boolean(s?.enabled), description: 'IDX disclaimer required by your MLS, shown under MLS listings.' }, defaultValue: 'Listing information is deemed reliable but not guaranteed. Information is provided exclusively for consumers\' personal, non-commercial use.' },
                { name: 'logo', type: 'upload', relationTo: 'media', admin: { condition: (_, s) => Boolean(s?.enabled), description: 'MLS or IDX logo, if your MLS requires one.' } },
                secret({ name: 'lastSync', type: 'json', admin: { hidden: true } }),
                { name: 'syncPanel', type: 'ui', admin: { condition: (_, s) => Boolean(s?.enabled), components: { Field: '@/components/admin/MlsPanel#MlsPanel' } } },
              ],
            },
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
            { name: 'metaDescription', type: 'textarea', localized: true, maxLength: 300, admin: { description: 'Default description for search engines and link previews.' } },
            { name: 'ogImage', label: 'Default share image', type: 'upload', relationTo: 'media', admin: { description: '1200×630. Used when a page has no photo of its own.' } },
            { name: 'noindex', label: 'Hide the site from search engines', type: 'checkbox', defaultValue: false, admin: { description: 'Turn on while the site is in development.' } },
          ],
        },
        {
          label: 'Legal',
          fields: [
            { name: 'companyName', type: 'text', admin: { description: 'Legal entity shown in the privacy policy and footer, e.g. "Aldridge & Vale Ltd".' } },
            { name: 'privacyPolicy', type: 'richText', localized: true, admin: { description: 'Blank = a standard policy is generated from your agency name and contact details.' } },
            { name: 'consentText', type: 'text', localized: true, defaultValue: 'I agree to my details being used to answer this request, as set out in the privacy policy.' },
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
                toggle('nearbyPlaces', 'Nearby places', 'Shows schools, shops, transport and parks near each property (OpenStreetMap, free).'),
                toggle('walkScore', 'Walk Score', 'Shows Walk Score, Transit Score and Bike Score. Needs a free API key from walkscore.com.'),
                secret({ name: 'walkScoreKey', type: 'text', admin: when('walkScore') }),
                toggle('captcha', 'Spam check on forms', 'Adds Cloudflare Turnstile or Google reCAPTCHA v3 to every form, on top of the built-in spam protection.'),
                {
                  type: 'row',
                  admin: when('captcha'),
                  fields: [
                    {
                      name: 'captchaProvider',
                      type: 'select',
                      defaultValue: 'turnstile',
                      options: [
                        { label: 'Cloudflare Turnstile (no cookies)', value: 'turnstile' },
                        { label: 'Google reCAPTCHA v3', value: 'recaptcha' },
                      ],
                      admin: { width: '34%' },
                    },
                    { name: 'captchaSiteKey', type: 'text', admin: { width: '33%' } },
                    secret({ name: 'captchaSecret', type: 'text', admin: { width: '33%' } }),
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
