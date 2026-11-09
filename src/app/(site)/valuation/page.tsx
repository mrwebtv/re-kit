import { LeadForm } from '@/site/components/LeadForm'
import { getSettings } from '@/site/data'

export const metadata = { title: 'Free valuation' }

export default async function ValuationPage() {
  const s = await getSettings()
  return (
    <div className="rk-wrap">
      <div className="rk-split">
        <div>
          <span className="rk-eyebrow">Selling or letting</span>
          <h1 className="rk-display">What is your home <em>really</em> worth?</h1>
          <p>An agent who knows your area visits, walks every room and gives you a written valuation within 48 hours. No obligation, no pressure.</p>
          <ul className="rk-features" style={{ gridTemplateColumns: '1fr', marginTop: 12 }}>
            <li>Free and without obligation</li>
            <li>Evidence from recent sales nearby</li>
            <li>Advice on presenting your home</li>
          </ul>
        </div>
        <div><LeadForm kind="valuation" submitLabel="Request my valuation" consentText={s.consentText || undefined} /></div>
      </div>
    </div>
  )
}
