'use client'
import { useAuth } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

export const SKINS = [
  { value: 'studio', label: 'Studio' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'estate', label: 'Estate' },
  { value: 'essential', label: 'Essential' },
]

const apply = (skin: string) => {
  document.documentElement.dataset.skin = skin
  try {
    localStorage.setItem('rk-admin-skin', skin)
  } catch {}
}

/** Puts the user's chosen admin design on <html data-skin="…">. */
export function SkinProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth<{ adminSkin?: string }>()
  useEffect(() => {
    let cached = 'studio'
    try {
      cached = localStorage.getItem('rk-admin-skin') || 'studio'
    } catch {}
    apply(user?.adminSkin || cached)
  }, [user?.adminSkin])
  return <>{children}</>
}

/** Small design picker at the bottom of the admin menu. */
export function SkinSwitcher() {
  const { user, setUser } = useAuth<{ id: number; adminSkin?: string }>()
  const [skin, setSkin] = useState('studio')
  useEffect(() => setSkin(user?.adminSkin || document.documentElement.dataset.skin || 'studio'), [user?.adminSkin])
  if (!user) return null
  return (
    <div className="rk-skin-switch">
      <span>Admin design</span>
      <div role="radiogroup" aria-label="Admin design">
        {SKINS.map((s) => (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={skin === s.value}
            className={`rk-skin-dot rk-skin-dot--${s.value}${skin === s.value ? ' is-on' : ''}`}
            title={s.label}
            onClick={async () => {
              setSkin(s.value)
              apply(s.value)
              const r = await fetch(`/api/users/${user.id}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminSkin: s.value }) })
              if (r.ok) setUser({ ...(user as object), adminSkin: s.value } as never)
            }}
          >
            <span className="rk-sr-only">{s.label}</span>
          </button>
        ))}
      </div>
      <small>{SKINS.find((s) => s.value === skin)?.label}</small>
    </div>
  )
}
