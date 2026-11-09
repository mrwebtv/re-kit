import { getSite } from '@/site/data'
import { LeadForm } from '@/site/components/LeadForm'
import { ContactLines } from '@/site/components/shared'

export async function generateMetadata() {
  return { title: (await getSite()).$.t('Contact') }
}

export default async function ContactPage() {
  const s = await getSite()
  const t = s.$.t
  return (
    <div className="rk-wrap">
      <div className="rk-split">
        <div>
          <span className="rk-eyebrow">{t('Contact')}</span>
          <h1 className="rk-display">{t('Talk to us')}</h1>
          <p>{t('Questions about a home, selling, letting or anything else. We reply within one working day.')}</p>
          <div className="rk-contact-lines"><ContactLines s={s} /></div>
        </div>
        <div><LeadForm kind="contact" submitLabel={t('Send message')} /></div>
      </div>
    </div>
  )
}
