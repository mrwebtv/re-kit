export type Dict = Record<string, string>
export type T = (key: string, vars?: Record<string, string | number>) => string

/** Keys are the English text itself, so a missing translation shows English. */
export function makeT(dict: Dict | undefined): T {
  return (key, vars) => {
    let s = (dict && dict[key]) || key
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
    return s
  }
}

/** Prefix an internal link with the language, e.g. /properties -> /fr/properties. */
export function localize(prefix: string, href: string) {
  if (!prefix || !href.startsWith('/') || href.startsWith('//')) return href
  if (/^\/(api|admin|media|next|feed)(\/|$)/.test(href) || /\.(pdf|xml|json|jpg|png|svg)(\?|$)/.test(href)) return href
  return href === '/' ? prefix : `${prefix}${href}`
}
