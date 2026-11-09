import type { Payload } from 'payload'
import React from 'react'

async function brand(payload?: Payload) {
  try {
    const s = await payload?.findGlobal({ slug: 'site-settings', depth: 1 })
    const logo = s?.logo && typeof s.logo === 'object' ? s.logo.url : null
    return { name: s?.agencyName || 'Real Estate', logo }
  } catch {
    return { name: 'Real Estate', logo: null }
  }
}

const House = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg>
)

/** Login screen logo: the agency's own logo or name. */
export async function AdminLogo({ payload }: { payload?: Payload }) {
  const b = await brand(payload)
  return (
    <div className="rk-admin-logo">
      {b.logo ? <img src={b.logo} alt={b.name} /> : <span className="rk-admin-mark"><House /></span>}
      {!b.logo && <span className="rk-admin-name">{b.name}</span>}
    </div>
  )
}

/** Small mark at the top of the admin menu. */
export async function AdminIcon() {
  return (
    <span className="rk-admin-mark rk-admin-mark--sm"><House /></span>
  )
}
