import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import { getSettings, img, siteUrl } from '@/site/data'
import { getTheme } from '@/site/themes'
import { CookieBanner } from '@/site/components/Extras'
import '@/site/styles/base.css'
import '@/site/styles/editorial.css'
import '@/site/styles/modern.css'
import '@/site/styles/dark.css'
import '@/site/styles/swiss.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const name = s.agencyName || 'Real estate'
  const og = img(s.ogImage, 'large') || img(s.heroImage, 'large')
  const icon = img(s.favicon, 'square')
  const base = siteUrl()
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { default: name, template: `%s · ${name}` },
    description: s.metaDescription || s.heroText || undefined,
    robots: s.noindex ? { index: false, follow: false } : undefined,
    openGraph: { siteName: name, type: 'website', images: og ? [{ url: og.url }] : undefined },
    twitter: { card: 'summary_large_image' },
    icons: icon ? { icon: icon.url, apple: icon.url } : { icon: '/house.svg' },
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const s = await getSettings()
  const theme = getTheme(s.theme)
  const style = { '--accent': s.accentColor || theme.defaultAccent } as CSSProperties
  const f = s.features
  const analytics = f?.analytics && f.analyticsId ? f.analyticsProvider || 'plausible' : null
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={theme.fonts} />
        {analytics === 'plausible' && <script defer data-domain={f!.analyticsId!} src={f!.analyticsSrc || 'https://plausible.io/js/script.js'} />}
        {analytics === 'umami' && <script defer data-website-id={f!.analyticsId!} src={f!.analyticsSrc || 'https://cloud.umami.is/script.js'} />}
      </head>
      <body className={`rk theme-${theme.id}`} style={style}>
        <a href="#main" className="rk-skip">Skip to content</a>
        <theme.Header s={s} />
        <main id="main">{children}</main>
        <theme.Footer s={s} />
        {analytics === 'ga4' && <CookieBanner gaId={f!.analyticsId!} />}
      </body>
    </html>
  )
}
