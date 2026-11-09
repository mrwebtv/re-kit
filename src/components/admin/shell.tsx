import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import React from 'react'

/** Wraps a custom admin screen in the normal admin layout (sidebar, header). */
export function AdminShell({ props, title, children }: { props: AdminViewServerProps; title: string; children: React.ReactNode }) {
  const { initPageResult, params, searchParams } = props
  const { req, permissions, visibleEntities, locale } = initPageResult
  if (!req.user) redirect('/admin/login')
  return (
    <DefaultTemplate i18n={req.i18n} locale={locale} params={params} payload={req.payload} permissions={permissions} searchParams={searchParams} user={req.user || undefined} visibleEntities={visibleEntities}>
      <Gutter>
        <h1 style={{ margin: '24px 0 28px' }}>{title}</h1>
        {children}
      </Gutter>
    </DefaultTemplate>
  )
}
