import { LeadForm } from '@/site/components/LeadForm'
import { getSite } from '@/site/data'

export async function generateMetadata() {
  return { title: (await getSite()).$.t('Free valuation') }
}

export default async function ValuationPage() {
  const s = await getSite()
  const t = s.$.t
  return (
    <div className="rk-wrap">
      <div className="rk-split">
        <div>
          <span className="rk-eyebrow">{t('Selling or letting')}</span>
          <h1 className="rk-display">{t('What is your home really worth?')}</h1>
          <p>{t('An agent who knows your area visits, walks every room and gives you a written valuation within 48 hours. No obligation, no pressure.')}</p>
          <ul className="rk-features" style={{ gridTemplateColumns: '1fr', marginTop: 12 }}>
            <li>{t('Free and without obligation')}</li>
            <li>{t('Evidence from recent sales nearby')}</li>
            <li>{t('Advice on presenting your home')}</li>
          </ul>
        </div>
        <div><LeadForm kind="valuation" submitLabel={t('Request my valuation')} /></div>
      </div>
    </div>
  )
}
