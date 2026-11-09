import { brandVars } from '@/lib/color'
import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { getSite, img, payloadClient, siteUrl } from '@/site/data'
import { getTheme } from '@/site/themes'
import { SiteProvider } from '@/site/i18n/client'
import { dictFor } from '@/site/i18n/dicts'
import { CookieBanner } from '@/site/components/Extras'
import { CompareBar, ScrollWatcher, Tracker } from '@/site/components/Interactive'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import '@/site/styles/base.css'
import '@/site/styles/features.css'
import '@/site/styles/editorial.css'
import '@/site/styles/modern.css'
import '@/site/styles/dark.css'
import '@/site/styles/swiss.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSite()
  const name = s.agencyName || 'Real estate'
  const og = img(s.ogImage, 'large') || img(s.heroImage, 'large')
  const icon = img(s.favicon, 'square')
  const base = siteUrl()
  const path = s.$.path
  const languages = s.$.languages.length > 1 ? Object.fromEntries(s.$.languages.map((l) => [l, `${l === DEFAULT_LOCALE ? '' : `/${l}`}${path === '/' && l !== DEFAULT_LOCALE ? '' : path}` || '/'])) : undefined
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { default: name, template: `%s · ${name}` },
    description: s.metaDescription || s.heroText || undefined,
    robots: s.noindex ? { index: false, follow: false } : undefined,
    openGraph: { siteName: name, type: 'website', images: og ? [{ url: og.url }] : undefined, locale: s.$.intl.replace('-', '_') },
    twitter: { card: 'summary_large_image' },
    icons: icon ? { icon: icon.url, apple: icon.url } : { icon: '/house.svg' },
    alternates: languages ? { languages } : undefined,
  }
}

/** Pages built in the page builder can hide the header/footer or lay the header over their hero. */
async function chromeFor(path: string, homePage: unknown) {
  const slug = path === '/' ? (homePage && typeof homePage === 'object' ? (homePage as { slug?: string }).slug : null) : /^\/[^/]+$/.test(path) ? path.slice(1) : null
  if (!slug) return 'default'
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0, select: { chrome: true } })
  return (docs[0] as { chrome?: string } | undefined)?.chrome || 'default'
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const s = await getSite()
  if (!s.$.languages.includes(s.$.locale)) notFound()
  const theme = getTheme(s.theme)
  const style = brandVars(s.colors?.primary || s.accentColor, theme.defaultAccent, s.colors) as CSSProperties
  const f = s.features
  const analytics = f?.analytics && f.analyticsId ? f.analyticsProvider || 'plausible' : null
  const chrome = await chromeFor(s.$.path, s.homePage)
  const transparent = chrome === 'transparent' || (s.$.path === '/' && s.headerTransparent)
  const body = ['rk', `theme-${theme.id}`, s.headerSticky !== false ? 'rk-sticky' : '', transparent ? 'rk-over' : '', chrome === 'none' ? 'rk-bare' : ''].filter(Boolean).join(' ')
  return (
    <html lang={s.$.locale} dir={s.$.dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={theme.fonts} />
        {analytics === 'plausible' && <script defer data-domain={f!.analyticsId!} src={f!.analyticsSrc || 'https://plausible.io/js/script.js'} />}
        {analytics === 'umami' && <script defer data-website-id={f!.analyticsId!} src={f!.analyticsSrc || 'https://cloud.umami.is/script.js'} />}
      </head>
      <body className={body} style={style}>
        <SiteProvider
          value={{
            locale: s.$.locale,
            intl: s.$.intl,
            prefix: s.$.prefix,
            dict: dictFor(s.$.locale),
            currency: s.$.cur,
            flags: { favourites: s.favourites !== false, compare: s.compare !== false, quickView: s.quickView !== false },
            captcha: f?.captcha && f.captchaSiteKey ? { provider: f.captchaProvider || 'turnstile', siteKey: f.captchaSiteKey } : null,
            consentText: s.consentText || '',
          }}
        >
          <a href="#main" className="rk-skip">{s.$.t('Skip to content')}</a>
          {chrome !== 'none' && <theme.Header s={s} />}
          <main id="main">{children}</main>
          {chrome !== 'none' && <theme.Footer s={s} />}
          <CompareBar />
          <Tracker />
          <ScrollWatcher />
          {analytics === 'ga4' && <CookieBanner gaId={f!.analyticsId!} />}
        </SiteProvider>
      </body>
    </html>
  )
}
