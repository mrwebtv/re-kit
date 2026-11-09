import type { AdminViewServerProps } from 'payload'
import React from 'react'
import { AdminShell } from './shell'
import { ImportForm } from './ImportForm'

export async function ImportView(props: AdminViewServerProps) {
  return (
    <AdminShell props={props} title="Import listings">
      <p style={{ maxWidth: 760, marginTop: -12 }}>
        Upload a CSV export from another website or CRM, a Kyero XML feed, or this site&apos;s own XML feed. Columns are matched by name (title, price, bedrooms, bathrooms, address, town, postcode, description, photos and more). Run a test first to check the matching. For live MLS listings, use Site Settings &gt; MLS / IDX instead.
      </p>
      <ImportForm />
    </AdminShell>
  )
}
