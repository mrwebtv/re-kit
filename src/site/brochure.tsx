import fs from 'fs'
import path from 'path'
import React from 'react'
import { Document, Image, Link, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'
import QRCode from 'qrcode'
import type { Agent, Media, Property, SiteSetting } from '@/payload-types'
import { formatArea, formatPrice, place, qualifier, STATUS_LABEL, TYPE_LABEL, type Site } from './data'
import { getTheme } from './themes'

const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')

/** Reads a photo straight from disk (react-pdf supports JPG and PNG only). */
function photoFile(m: number | Media | null | undefined, size: 'large' | 'medium' = 'large'): Buffer | null {
  if (!m || typeof m === 'number') return null
  const name = m.sizes?.[size]?.filename || m.filename
  if (!name || !/\.(jpe?g|png)$/i.test(name)) return null
  const file = path.join(MEDIA_DIR, path.basename(name))
  try {
    return fs.readFileSync(file)
  } catch {
    return null
  }
}

/** Plain text paragraphs from a Lexical rich text value. */
function paragraphs(rt: unknown): string[] {
  const out: string[] = []
  const walk = (n: { type?: string; text?: string; children?: unknown[] }): string =>
    n.text ?? (n.children || []).map((c) => walk(c as never)).join('')
  const root = (rt as { root?: { children?: unknown[] } })?.root
  for (const block of root?.children || []) {
    const t = walk(block as never).trim()
    if (t) out.push(t)
  }
  return out
}

export async function renderBrochure(p: Property, s: SiteSetting | Site, listingUrl: string) {
  const t = (k: string) => ('$' in s && s.$ ? s.$.t(k) : k)
  const theme = getTheme(s.theme)
  const accent = s.colors?.primary || s.accentColor || theme.defaultAccent
  const serif = theme.id === 'editorial' || theme.id === 'dark'
  const display = serif ? 'Times-Roman' : 'Helvetica-Bold'
  const ink = '#1b1b19'
  const muted = '#6b665d'
  const st = StyleSheet.create({
    page: { paddingTop: 36, paddingHorizontal: 36, paddingBottom: 48, fontFamily: 'Helvetica', fontSize: 10, color: ink, lineHeight: 1.45 },
    head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 10, marginBottom: 16, borderBottomWidth: 2, borderBottomColor: accent },
    brand: { fontFamily: display, fontSize: 18 },
    small: { fontSize: 8, color: muted, letterSpacing: 1, textTransform: 'uppercase' },
    hero: { width: '100%', height: 300, objectFit: 'cover' },
    ph: { width: '100%', height: 300, backgroundColor: '#e6e2da' },
    title: { fontFamily: display, fontSize: 28, marginTop: 18, lineHeight: 1.1 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 },
    price: { fontFamily: display, fontSize: 20, color: accent },
    facts: { flexDirection: 'row', marginTop: 16, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#d9d4c9' },
    fact: { flex: 1, paddingRight: 8 },
    factVal: { fontFamily: display, fontSize: 14, marginTop: 2 },
    summary: { fontFamily: serif ? 'Times-Italic' : 'Helvetica-Oblique', fontSize: 12, marginTop: 16, color: '#333' },
    two: { flexDirection: 'row', gap: 8, marginTop: 14 },
    thumb: { flex: 1, height: 150, objectFit: 'cover' },
    h2: { fontFamily: display, fontSize: 16, marginBottom: 8, marginTop: 4 },
    p: { marginBottom: 7 },
    feats: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
    feat: { width: '50%', paddingRight: 10, paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: '#d9d4c9' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
    gridImg: { width: '48.8%', height: 140, objectFit: 'cover' },
    plan: { width: '100%', height: 260, objectFit: 'contain', marginTop: 6 },
    agent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, padding: 14, backgroundColor: '#f4f2ed' },
  })

  const gallery = (p.gallery || []) as (number | Media)[]
  const local = gallery.map((m, i) => photoFile(m, i === 0 ? 'large' : 'medium')).filter(Boolean) as Buffer[]
  const imgs: (Buffer | string)[] = local.length ? local : (p.externalPhotos || []).map((x) => x.url).filter((u) => /\.(jpe?g|png)(\?|$)/i.test(u) || !/\.\w{3,4}(\?|$)/.test(u)).slice(0, 5)
  const plan = ((p.floorPlans || []) as (number | Media)[]).map((m) => photoFile(m)).find(Boolean)
  const agent = p.agent && typeof p.agent === 'object' ? (p.agent as Agent) : null
  const qr = await QRCode.toDataURL(listingUrl, { margin: 0, width: 220, color: { dark: ink, light: '#f4f2ed' } })
  const facts = [
    [t('Bedrooms'), p.bedrooms],
    [t('Bathrooms'), p.bathrooms],
    [t('Floor area'), formatArea(p.floorArea, s).replace('m²', 'sq m')],
    [t('Type'), p.propertyType ? t(TYPE_LABEL[p.propertyType]!) : ''],
    [t('Energy rating'), p.energyRating || (p.energyClass ? p.energyClass.replace('plus', '+') : '')],
  ].filter(([, v]) => v)
  const desc = paragraphs(p.description)
  const contact = [s.phone, s.email].filter(Boolean).join('  ·  ')
  const footerNote = s.brochureFooter || 'Particulars are for guidance only and do not form part of any contract.'
  const Footer = ({ n }: { n: number }) => (
    <View fixed style={{ position: 'absolute', bottom: 20, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ fontSize: 7, color: muted, width: 440 }}>{footerNote}</Text>
      <Text style={{ fontSize: 7, color: muted }}>{`${n} / 2`}</Text>
    </View>
  )
  const Head = () => (
    <View style={st.head} fixed>
      <Text style={st.brand}>{s.agencyName}</Text>
      <Text style={st.small}>{contact}</Text>
    </View>
  )

  const doc = (
    <Document title={`${p.title} · ${s.agencyName}`} author={s.agencyName || undefined}>
      <Page size="A4" style={st.page}>
        <Head />
        {imgs[0] ? <Image src={imgs[0]} style={st.hero} /> : <View style={st.ph} />}
        <Text style={st.title}>{p.title}</Text>
        <View style={st.priceRow}>
          <Text style={{ color: muted }}>{[place(p), t(STATUS_LABEL[p.status] || ''), p.reference].filter(Boolean).join('  ·  ')}</Text>
          <Text style={st.price}>{qualifier(p) ? `${qualifier(p)} ` : ''}{formatPrice(p, s)}</Text>
        </View>
        {facts.length > 0 && (
          <View style={st.facts}>
            {facts.map(([k, v]) => (
              <View key={String(k)} style={st.fact}>
                <Text style={st.small}>{k}</Text>
                <Text style={st.factVal}>{String(v)}</Text>
              </View>
            ))}
          </View>
        )}
        {p.summary && <Text style={st.summary}>{p.summary}</Text>}
        {imgs.length > 2 && (
          <View style={st.two}>
            <Image src={imgs[1]} style={st.thumb} />
            <Image src={imgs[2]} style={st.thumb} />
          </View>
        )}
        <Footer n={1} />
      </Page>
      <Page size="A4" style={st.page}>
        <Head />
        {desc.length > 0 && (
          <View>
            <Text style={st.h2}>{t('About this home')}</Text>
            {desc.map((t, i) => <Text key={i} style={st.p}>{t}</Text>)}
          </View>
        )}
        {p.features && p.features.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={st.h2}>{t('Features')}</Text>
            <View style={st.feats}>
              {p.features.map((f, i) => <Text key={i} style={st.feat}>{`–  ${f.feature}`}</Text>)}
            </View>
          </View>
        )}
        {imgs.length > 3 && (
          <View style={st.grid}>
            {imgs.slice(3, 7).map((b, i) => <Image key={i} src={b} style={st.gridImg} />)}
          </View>
        )}
        {plan && (
          <View wrap={false} style={{ marginTop: 14 }}>
            <Text style={st.h2}>{t('Floor plan')}</Text>
            <Image src={plan} style={st.plan} />
          </View>
        )}
        <View style={st.agent} wrap={false}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={st.small}>{t('Arrange a viewing')}</Text>
            <Text style={{ fontFamily: display, fontSize: 16, marginTop: 4 }}>{agent?.name || s.agencyName}</Text>
            {agent?.jobTitle && <Text style={{ color: muted }}>{agent.jobTitle}</Text>}
            <Text style={{ marginTop: 6 }}>{[agent?.phone || s.phone, agent?.email || s.email].filter(Boolean).join('  ·  ')}</Text>
            {s.address && <Text style={{ color: muted, marginTop: 4 }}>{s.address.replace(/\n/g, ', ')}</Text>}
            <Link src={listingUrl} style={{ color: accent, marginTop: 6 }}>{listingUrl}</Link>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Image src={qr} style={{ width: 84, height: 84 }} />
            <Text style={{ fontSize: 7, color: muted, marginTop: 4 }}>{t('Scan for photos and booking')}</Text>
          </View>
        </View>
        <Footer n={2} />
      </Page>
    </Document>
  )
  return renderToBuffer(doc)
}
