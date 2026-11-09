/** Black or white text, whichever reads better on a hex background. */
export function readableOn(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!m) return '#fff'
  const n = parseInt(m[1], 16)
  const lin = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) }
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255)
  return L > 0.4 ? '#111111' : '#ffffff'
}

type Colors = { onPrimary?: string | null; secondary?: string | null; onSecondary?: string | null; text?: string | null; muted?: string | null; background?: string | null; surface?: string | null; border?: string | null } | null | undefined

/** CSS variables for the brand colours set in Site Settings. Blank fields keep the design's own colour. */
export function brandVars(accent: string | null | undefined, defaultAccent: string, c: Colors): Record<string, string> {
  const v: Record<string, string> = { '--accent': accent || defaultAccent }
  if (c?.onPrimary) v['--on-accent'] = c.onPrimary
  else if (accent) v['--on-accent'] = readableOn(accent)
  if (c?.secondary) {
    v['--inverse'] = c.secondary
    v['--on-inverse'] = c.onSecondary || readableOn(c.secondary)
  }
  if (c?.text) v['--ink'] = c.text
  if (c?.muted) v['--muted'] = c.muted
  if (c?.background) v['--bg'] = c.background
  if (c?.surface) {
    v['--surface'] = c.surface
    v['--surface-2'] = `color-mix(in srgb, ${c.surface} 92%, ${c.text || '#000'})`
  }
  if (c?.border) v['--line'] = c.border
  return v
}
