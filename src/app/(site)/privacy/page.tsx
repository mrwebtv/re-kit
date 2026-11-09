import RichText from '@/components/RichText'
import { getSettings } from '@/site/data'

export const metadata = { title: 'Privacy policy' }

export default async function PrivacyPage() {
  const s = await getSettings()
  const who = s.companyName || s.agencyName
  const contact = [s.email, s.phone, s.address].filter(Boolean).join(' · ')
  return (
    <div className="rk-wrap">
      <article className="rk-prose-page">
        <h1 className="rk-display">Privacy policy</h1>
        {s.privacyPolicy ? (
          <div className="rk-prose"><RichText data={s.privacyPolicy} enableGutter={false} enableProse={false} /></div>
        ) : (
          <>
            <p>This policy explains how {who} uses the personal information you give us through this website.</p>
            <h2>What we collect</h2>
            <p>When you send an enquiry, book a viewing, request a valuation or create a property alert, we collect the details you enter: your name, email address, phone number, any message, and for valuations the property address. We record that you agreed to this policy and when.</p>
            <h2>How we use it</h2>
            <p>Only to answer your request: to contact you, arrange viewings and valuations, and send the property alerts you asked for. Your details go to the agent handling the property. We do not sell your information or use it for unrelated marketing.</p>
            <h2>Legal basis</h2>
            <p>Your consent when you submit a form, and our legitimate interest in responding to requests you make.</p>
            <h2>How long we keep it</h2>
            <p>We keep enquiry records only as long as needed to deal with your request and our legal obligations, then delete them. You can unsubscribe from property alerts at any time using the link in every alert email.</p>
            <h2>Cookies and analytics</h2>
            <p>This site does not use advertising cookies. If analytics cookies are used, you are asked first and can decline.</p>
            <h2>Your rights</h2>
            <p>You can ask to see, correct or delete the information we hold about you, or withdraw your consent, by contacting us. You also have the right to complain to your data protection authority.</p>
            <h2>Contact</h2>
            <p>{who}{contact ? `, ${contact}` : ''}</p>
          </>
        )}
      </article>
    </div>
  )
}
