import type { ThemeKit, CardProps } from './types'
import { editorial } from './editorial'
import { modern } from './modern'
import { dark } from './dark'
import { swiss } from './swiss'
import { CardShell } from '../components/shared'

const THEMES: Record<string, ThemeKit> = { editorial, modern, dark, swiss }

/** Every theme card gets favourite / compare / quick view buttons from CardShell. */
const withShell = (kit: ThemeKit): ThemeKit => {
  const Card = (props: CardProps) => (
    <CardShell p={props.p} s={props.s}>
      <kit.Card {...props} />
    </CardShell>
  )
  return { ...kit, Card }
}

const WRAPPED: Record<string, ThemeKit> = Object.fromEntries(Object.entries(THEMES).map(([k, v]) => [k, withShell(v)]))

export function getTheme(id?: string | null): ThemeKit {
  return (id && WRAPPED[id]) || WRAPPED.editorial!
}
