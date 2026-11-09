import RichText from '@/components/RichText'
import { getSite } from '@/site/data'

export async function generateMetadata() {
  return { title: (await getSite()).$.t('Privacy policy') }
}

export default async function PrivacyPage() {
  const s = await getSite()
  const t = s.$.t
  const who = s.companyName || s.agencyName
  const contact = [s.email, s.phone, s.address].filter(Boolean).join(' · ')
  return (
    <div className="rk-wrap">
      <article className="rk-prose-page">
        <h1 className="rk-display">{t('Privacy policy')}</h1>
        {s.privacyPolicy ? (
          <div className="rk-prose"><RichText data={s.privacyPolicy} enableGutter={false} enableProse={false} /></div>
        ) : (
          <>
            <p>{t('This policy explains how {who} uses the personal information you give us through this website.', { who: who || '' })}</p>
            <h2>{t('What we collect')}</h2>
            <p>{t('When you send an enquiry, book a viewing, request a valuation or create a property alert, we collect the details you enter: your name, email address, phone number, any message, and for valuations the property address. We record that you agreed to this policy and when.')}</p>
            <h2>{t('How we use it')}</h2>
            <p>{t('Only to answer your request: to contact you, arrange viewings and valuations, and send the property alerts you asked for. Your details go to the agent handling the property. We do not sell your information or use it for unrelated marketing.')}</p>
            <h2>{t('Legal basis')}</h2>
            <p>{t('Your consent when you submit a form, and our legitimate interest in responding to requests you make.')}</p>
            <h2>{t('How long we keep it')}</h2>
            <p>{t('We keep enquiry records only as long as needed to deal with your request and our legal obligations, then delete them. You can unsubscribe from property alerts at any time using the link in every alert email.')}</p>
            <h2>{t('Cookies and analytics')}</h2>
            <p>{t('This site does not use advertising cookies. Visits are counted without cookies. If analytics cookies are used, you are asked first and can decline. Favourites and compare lists are stored only in your own browser.')}</p>
            <h2>{t('Your rights')}</h2>
            <p>{t('You can ask to see, correct or delete the information we hold about you, or withdraw your consent, by contacting us. You also have the right to complain to your data protection authority.')}</p>
            <h2>{t('Contact')}</h2>
            <p>{who}{contact ? `, ${contact}` : ''}</p>
          </>
        )}
      </article>
    </div>
  )
}
