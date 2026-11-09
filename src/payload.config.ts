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
import { Agents, Enquiries, Properties, SearchAlerts, Viewings } from './collections/RealEstate'
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
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
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
  collections: [Properties, Agents, Enquiries, Viewings, SearchAlerts, Media, Users, Pages, Posts, Categories],
  email: siteSettingsEmailAdapter,
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteSettings, Header, Footer],
  endpoints: [seedDemoEndpoint, testEmailEndpoint, healthEndpoint, backupsEndpoint],
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
