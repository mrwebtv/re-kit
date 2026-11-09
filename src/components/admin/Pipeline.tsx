import type { AdminViewServerProps } from 'payload'
import React from 'react'
import { AdminShell } from './shell'
import { PipelineBoard } from './PipelineBoard'
import { STAGES } from '@/collections/CRM'

export async function PipelineView(props: AdminViewServerProps) {
  const { req } = props.initPageResult
  const { docs } = await req.payload.find({ collection: 'deals', limit: 500, depth: 1, sort: '-updatedAt', req, overrideAccess: false, where: { or: [{ stage: { not_equals: 'completed' } }, { updatedAt: { greater_than: new Date(Date.now() - 60 * 86400_000).toISOString() } }] } })
  const deals = docs.map((d) => ({
    id: d.id,
    title: d.title,
    stage: d.stage,
    value: d.value || 0,
    contact: d.contactName,
    agent: d.agent && typeof d.agent === 'object' ? d.agent.name : '',
    property: d.property && typeof d.property === 'object' ? d.property.title : '',
    updatedAt: d.updatedAt,
  }))
  return (
    <AdminShell props={props} title="Pipeline">
      <PipelineBoard stages={STAGES} deals={deals} />
    </AdminShell>
  )
}
