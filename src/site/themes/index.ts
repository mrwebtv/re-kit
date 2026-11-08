import type { ThemeKit } from './types'
import { editorial } from './editorial'
import { modern } from './modern'
import { dark } from './dark'
import { swiss } from './swiss'

const THEMES: Record<string, ThemeKit> = { editorial, modern, dark, swiss }

export function getTheme(id?: string | null): ThemeKit {
  return (id && THEMES[id]) || editorial
}
