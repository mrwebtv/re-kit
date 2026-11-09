import { postgresAdapter } from '@payloadcms/db-postgres'
import { migrations } from './migrations'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Agents, Enquiries, Properties, PropertyFields, PropertyLabels, SearchAlerts, Viewings } from './collections/RealEstate'
import { Activities, Deals, PageStats } from './collections/CRM'
import { siteEndpoints } from './endpoints/site'
import { LOCALES, DEFAULT_LOCALE } from './i18n/locales'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import { es } from '@payloadcms/translations/languages/es'
import { de } from '@payloadcms/translations/languages/de'
import { it } from '@payloadcms/translations/languages/it'
import { pt } from '@payloadcms/translations/languages/pt'
import { nl } from '@payloadcms/translations/languages/nl'
import { ar } from '@payloadcms/translations/languages/ar'
import { siteSettingsEmailAdapter } from './lib/emailAdapter'
import { backupsEndpoint, healthEndpoint, testEmailEndpoint } from './endpoints/admin'
import { startMaintenance } from './lib/maintenance'
import { hookProcessErrors, reportError } from './lib/errorAlerts'
import { hideTemplateLeftovers } from './plugins/hideTemplate'
import { Footer } from './Footer/config'
import { SiteSettings } from './globals/SiteSettings'
import { seedDemoEndpoint } from './endpoints/demo'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
      beforeNavLinks: ['@/components/admin/DashboardLink#DashboardLink'],
      afterNavLinks: ['@/components/admin/NavLinks#NavLinks'],
      providers: ['@/components/admin/Skin#SkinProvider'],
      graphics: { Logo: '@/components/admin/Brand#AdminLogo', Icon: '@/components/admin/Brand#AdminIcon' },
      views: {
        pipeline: { Component: '@/components/admin/Pipeline#PipelineView', path: '/pipeline' },
        analytics: { Component: '@/components/admin/Analytics#AnalyticsView', path: '/analytics' },
        importListings: { Component: '@/components/admin/Import#ImportView', path: '/import' },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    meta: { titleSuffix: ' · Admin', icons: [{ rel: 'icon', url: '/house.svg' }] },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    // Runs pending migrations automatically when the app starts in production
    prodMigrations: migrations,
  }),
  collections: [Properties, PropertyLabels, PropertyFields, Agents, Enquiries, Viewings, SearchAlerts, Deals, Activities, PageStats, Pages, Posts, Categories, Media, Users],
  localization: {
    locales: LOCALES.map((l) => ({ code: l.code, label: l.label, rtl: 'rtl' in l ? l.rtl : false })),
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  i18n: { supportedLanguages: { en, fr, es, de, it, pt, nl, ar }, fallbackLanguage: 'en' },
  email: siteSettingsEmailAdapter,
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteSettings, Header, Footer],
  endpoints: [seedDemoEndpoint, testEmailEndpoint, healthEndpoint, backupsEndpoint, ...siteEndpoints],
  plugins: [...plugins, hideTemplateLeftovers],
  hooks: {
    afterError: [
      ({ error, req }) => {
        const status = (error as { status?: number }).status || 500
        if (status >= 500) void reportError(req.payload, error, `${req.method} ${req.url || ''}`)
      },
    ],
  },
  onInit: async (payload) => {
    startMaintenance(payload)
    hookProcessErrors(payload)
  },
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
