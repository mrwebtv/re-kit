import Link from 'next/link'
import React from 'react'
import { SkinSwitcher } from './Skin'

/** Extra admin screens, listed under the collections in the sidebar. */
export function NavLinks() {
  const links = [
    { href: '/admin/pipeline', label: 'Pipeline board' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/import', label: 'Import listings' },
    { href: '/', label: 'View website ↗' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--theme-elevation-100)' }}>
      <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--theme-elevation-500)' }}>Tools</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="nav__link" style={{ textDecoration: 'none' }}>
          {l.label}
        </Link>
      ))}
      <SkinSwitcher />
    </div>
  )
}
