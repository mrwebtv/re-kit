import { getAgents, getFeatured, getProperties, getSettings } from '@/site/data'
import { getTheme } from '@/site/themes'

export default async function HomePage() {
  const s = await getSettings()
  const theme = getTheme(s.theme)
  const [featured, latest, agents] = await Promise.all([getFeatured(3), getProperties({}, 6), getAgents()])
  return <theme.Home s={s} featured={featured} latest={latest.docs} agents={agents} />
}
