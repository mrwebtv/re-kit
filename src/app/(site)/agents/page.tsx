import { getAgents, getSite } from '@/site/data'
import { AgentCard } from '@/site/components/shared'

export async function generateMetadata() {
  const s = await getSite()
  return { title: s.$.t('Our agents') }
}

export default async function AgentsPage() {
  const [s, agents] = await Promise.all([getSite(), getAgents()])
  const t = s.$.t
  return (
    <div className="rk-wrap" style={{ paddingBottom: 112 }}>
      <div className="rk-page-head">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="rk-eyebrow">{t('Our agents')}</span>
          <h1 className="rk-display">{t('The people behind every sale')}</h1>
        </div>
      </div>
      {agents.length ? <div className="rk-agents">{agents.map((a) => <AgentCard key={a.id} a={a} s={s} />)}</div> : <p className="rk-muted">{t('Agents will appear here once they are added in the admin.')}</p>}
    </div>
  )
}
