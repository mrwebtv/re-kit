import type { ThemeKit } from './types'
import { editorial } from './editorial'

const THEMES: Record<string, ThemeKit> = { editorial }

export function getTheme(id?: string | null): ThemeKit {
  return (id && THEMES[id]) || editorial
}
