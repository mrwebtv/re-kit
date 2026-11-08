import { getAgents } from '@/site/data'
import { AgentCard } from '@/site/components/shared'

export const metadata = { title: 'Our agents' }

export default async function AgentsPage() {
  const agents = await getAgents()
  return (
    <div className="rk-wrap" style={{ paddingBottom: 112 }}>
      <div className="rk-page-head">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="rk-eyebrow">Our agents</span>
          <h1 className="rk-display">The people behind every sale</h1>
        </div>
      </div>
      {agents.length ? <div className="rk-agents">{agents.map((a) => <AgentCard key={a.id} a={a} />)}</div> : <p className="rk-muted">Agents will appear here once they are added in the admin.</p>}
    </div>
  )
}
