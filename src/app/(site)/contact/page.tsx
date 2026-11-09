import { getSettings } from '@/site/data'
import { LeadForm } from '@/site/components/LeadForm'
import { ContactLines } from '@/site/components/shared'

export const metadata = { title: 'Contact' }

export default async function ContactPage() {
  const s = await getSettings()
  return (
    <div className="rk-wrap">
      <div className="rk-split">
        <div>
          <span className="rk-eyebrow">Contact</span>
          <h1 className="rk-display">Talk to us</h1>
          <p>Questions about a home, selling, letting or anything else. We reply within one working day.</p>
          <div className="rk-contact-lines"><ContactLines s={s} /></div>
        </div>
        <div><LeadForm kind="contact" submitLabel="Send message" consentText={s.consentText || undefined} /></div>
      </div>
    </div>
  )
}
