import { notFound } from 'next/navigation'
import { getAgent, getProperties, getSite, img, initials, PAGE_SIZE } from '@/site/data'
import { getTheme } from '@/site/themes'
import { Photo } from '@/site/components/shared'
import { LeadForm } from '@/site/components/LeadForm'
import { Link } from '@/site/i18n/client'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const a = await getAgent((await params).slug)
  return a ? { title: a.name, description: a.bio?.slice(0, 160) || undefined, alternates: { canonical: `/agents/${a.slug}` } } : {}
}

export default async function AgentPage({ params, searchParams }: { params: Params; searchParams: Promise<Record<string, string | undefined>> }) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const [s, a] = await Promise.all([getSite(), getAgent(slug)])
  if (!a) notFound()
  const t = s.$.t
  const theme = getTheme(s.theme)
  const listings = await getProperties({ agent: String(a.id), page: sp.page }, PAGE_SIZE)
  const photo = img(a.photo, 'medium')
  const socials = [
    a.phone && { href: `tel:${a.phone.replace(/\s/g, '')}`, label: a.phone },
    a.email && { href: `mailto:${a.email}`, label: a.email },
    a.whatsapp && { href: `https://wa.me/${a.whatsapp.replace(/[^\d]/g, '')}`, label: 'WhatsApp' },
    a.linkedin && { href: a.linkedin, label: 'LinkedIn' },
    a.instagram && { href: a.instagram.startsWith('http') ? a.instagram : `https://instagram.com/${a.instagram.replace('@', '')}`, label: 'Instagram' },
  ].filter(Boolean) as { href: string; label: string }[]
  const jsonLd = { '@context': 'https://schema.org', '@type': 'RealEstateAgent', name: a.name, jobTitle: a.jobTitle || undefined, email: a.email, telephone: a.phone || undefined, image: photo?.url, worksFor: { '@type': 'RealEstateAgent', name: s.agencyName } }
  return (
    <div className="rk-wrap" style={{ paddingBottom: 112 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <nav className="rk-crumbs" aria-label={t('Breadcrumb')}><Link href="/agents">{t('Our agents')}</Link><span aria-hidden="true">/</span><span aria-current="page">{a.name}</span></nav>
      <div className="rk-agent-hero">
        {photo ? <Photo src={photo} alt={a.name} className="rk-agent-photo" eager /> : <div className="rk-photo rk-agent-photo"><div className="rk-ph rk-initials" aria-hidden="true"><span>{initials(a.name)}</span></div></div>}
        <div className="rk-agent-bio">
          {a.jobTitle && <span className="rk-eyebrow">{a.jobTitle}</span>}
          <h1 className="rk-display">{a.name}</h1>
          {a.bio && <p>{a.bio}</p>}
          <div className="rk-agent-links">{socials.map((x) => <a key={x.href} href={x.href} target={x.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{x.label}</a>)}</div>
        </div>
        <div className="rk-agent-form">
          <h2 className="rk-display" style={{ fontSize: 28, marginBottom: 16 }}>{t('Contact {name}', { name: a.name.split(' ')[0]! })}</h2>
          <LeadForm kind="contact" submitLabel={t('Send message')} compact />
        </div>
      </div>
      <div className="rk-section-head" style={{ marginTop: 72 }}>
        <h2 className="rk-display">{t('Listings by {name}', { name: a.name.split(' ')[0]! })}</h2>
        <span className="rk-muted">{t('{n} properties', { n: listings.totalDocs })}</span>
      </div>
      {listings.docs.length ? (
        <div className={theme.listLayout === 'rows' ? 'rk-rows' : 'rk-grid'}>{listings.docs.map((p, i) => <theme.Card key={p.id} p={p} s={s} index={i} />)}</div>
      ) : (
        <p className="rk-muted">{t('No listings right now.')}</p>
      )}
    </div>
  )
}
