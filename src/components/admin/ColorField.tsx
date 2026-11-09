'use client'
import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import React from 'react'

const HEX = /^#[0-9a-fA-F]{6}$/
const text = (v: unknown) => (typeof v === 'string' ? v : v && typeof v === 'object' ? (Object.values(v)[0] as string) : undefined)

/** Elementor-style colour picker: swatch + hex input + reset to the design's default. */
export const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError } = useField<string>({ path: path || field.name })
  const v = value || ''
  const valid = HEX.test(v)
  return (
    <div className="field-type text rk-color" style={{ marginBottom: 'var(--spacing-field, 24px)', flex: '1 1 0', minWidth: 200 }}>
      <FieldLabel label={field.label || field.name} path={path} required={field.required} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <label
          title="Pick a colour"
          style={{ position: 'relative', width: 40, height: 40, borderRadius: 8, flex: 'none', cursor: 'pointer', border: '1px solid var(--theme-elevation-150)', background: valid ? v : 'repeating-conic-gradient(var(--theme-elevation-100) 0 25%, transparent 0 50%) 0 0/12px 12px', overflow: 'hidden' }}
        >
          <input type="color" value={valid ? v : '#000000'} onChange={(e) => setValue(e.target.value.toUpperCase())} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
        </label>
        <input
          type="text"
          value={v}
          placeholder="Design default"
          maxLength={7}
          onChange={(e) => {
            let n = e.target.value.trim()
            if (n && !n.startsWith('#')) n = '#' + n
            setValue(n || null)
          }}
          style={{ flex: 1, height: 40, padding: '0 12px', borderRadius: 'var(--style-radius-s, 4px)', border: `1px solid ${showError ? 'var(--theme-error-500)' : 'var(--theme-elevation-150)'}`, background: 'var(--theme-input-bg)', color: 'var(--theme-text)', fontFamily: 'monospace', textTransform: 'uppercase' }}
        />
        {v && (
          <button type="button" onClick={() => setValue(null)} title="Use the design default" style={{ height: 40, padding: '0 12px', borderRadius: 'var(--style-radius-s, 4px)', border: '1px solid var(--theme-elevation-150)', background: 'transparent', color: 'var(--theme-elevation-800)', cursor: 'pointer' }}>
            Reset
          </button>
        )}
      </div>
      <FieldError path={path} showError={showError} />
      {field.admin?.description && <FieldDescription description={text(field.admin.description)} path={path} />}
    </div>
  )
}
