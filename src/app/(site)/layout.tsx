import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import { getSettings } from '@/site/data'
import { getTheme } from '@/site/themes'
import '@/site/styles/base.css'
import '@/site/styles/editorial.css'
import '@/site/styles/modern.css'
import '@/site/styles/dark.css'
import '@/site/styles/swiss.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    title: { default: s.agencyName || 'Real estate', template: `%s · ${s.agencyName || 'Real estate'}` },
    description: s.heroText || undefined,
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const s = await getSettings()
  const theme = getTheme(s.theme)
  const style = { '--accent': s.accentColor || theme.defaultAccent } as CSSProperties
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={theme.fonts} />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={`rk theme-${theme.id}`} style={style}>
        <a href="#main" className="rk-skip">Skip to content</a>
        <theme.Header s={s} />
        <main id="main">{children}</main>
        <theme.Footer s={s} />
      </body>
    </html>
  )
}
