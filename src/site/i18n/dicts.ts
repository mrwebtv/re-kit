import type { Dict } from './core'
import fr from './fr'
import es from './es'
import de from './de'
import it from './it'
import pt from './pt'
import nl from './nl'
import ar from './ar'

const DICTS: Record<string, Dict> = { fr, es, de, it, pt, nl, ar }
export const dictFor = (locale: string): Dict => DICTS[locale] || {}
