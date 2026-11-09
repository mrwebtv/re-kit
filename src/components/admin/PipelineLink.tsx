import Link from 'next/link'
import React from 'react'

export function PipelineLink() {
  return (
    <div style={{ marginBottom: 16 }}>
      <Link href="/admin/pipeline" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }}>
        Open the pipeline board
      </Link>
    </div>
  )
}
