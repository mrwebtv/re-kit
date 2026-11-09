'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

/** "Dashboard" at the top of the admin menu, highlighted when you are on it. */
export function DashboardLink() {
  const path = usePathname()
  const on = path === '/admin' || path === '/admin/'
  return (
    <Link href="/admin" className="nav__link rk-nav-dash" aria-current={on ? 'page' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      {on && <span className="nav__link-indicator" />}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
      <span>Dashboard</span>
    </Link>
  )
}
