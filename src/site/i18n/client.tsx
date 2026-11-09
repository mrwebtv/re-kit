'use client'
import NextLink from 'next/link'
import { createContext, useContext, useMemo, type ComponentProps, type ReactNode } from 'react'
import { localize, makeT, type Dict, type T } from './core'

export type ClientSite = {
  locale: string
  intl: string
  prefix: string
  dict: Dict
  currency: { code: string; symbol: string; rate: number; base: string } | null
  flags: { favourites: boolean; compare: boolean; quickView: boolean }
  captcha: { provider: string; siteKey: string } | null
  consentText: string
}

const Ctx = createContext<ClientSite>({ locale: 'en', intl: 'en-GB', prefix: '', dict: {}, currency: null, flags: { favourites: false, compare: false, quickView: false }, captcha: null, consentText: '' })

export function SiteProvider({ value, children }: { value: ClientSite; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useSite = () => useContext(Ctx)
export function useT(): T {
  const { dict } = useSite()
  return useMemo(() => makeT(dict), [dict])
}
export function useHref() {
  const { prefix } = useSite()
  return (href: string) => localize(prefix, href)
}

/** next/link that keeps the visitor in their language. */
export function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const { prefix } = useSite()
  return <NextLink href={typeof href === 'string' ? localize(prefix, href) : href} {...rest} />
}
