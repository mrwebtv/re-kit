import { NextResponse, type NextRequest } from 'next/server'

// Keep in sync with src/i18n/locales.ts (proxy runs separately from the app).
const LOCALES = ['en', 'fr', 'es', 'de', 'it', 'pt', 'nl', 'ar']
const DEFAULT = LOCALES.includes(process.env.DEFAULT_LANGUAGE || '') ? process.env.DEFAULT_LANGUAGE! : 'en'

/** /fr/properties is served by /properties with the language passed in a header. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const first = pathname.split('/')[1] || ''
  const headers = new Headers(req.headers)
  if (LOCALES.includes(first)) {
    if (first === DEFAULT) {
      const url = req.nextUrl.clone()
      url.pathname = pathname.slice(first.length + 1) || '/'
      return NextResponse.redirect(url, 308)
    }
    headers.set('x-rk-locale', first)
    headers.set('x-rk-path', pathname.slice(first.length + 1) || '/')
    const url = req.nextUrl.clone()
    url.pathname = pathname.slice(first.length + 1) || '/'
    return NextResponse.rewrite(url, { request: { headers } })
  }
  headers.set('x-rk-locale', DEFAULT)
  headers.set('x-rk-path', pathname)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!api|admin|next|_next|media|favicon|house\\.svg|robots\\.txt|sitemap\\.xml|.*\\.[a-z0-9]{2,5}$).*)'],
}
