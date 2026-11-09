'use client'
import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

export function LabelRow() {
  const { data, rowNumber } = useRowLabel<{ label?: string }>()
  return <span>{data?.label || `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}
