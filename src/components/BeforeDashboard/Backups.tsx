'use client'
import React, { useEffect, useState } from 'react'

type F = { name: string; size: number; createdAt: string }

export const Backups: React.FC = () => {
  const [files, setFiles] = useState<F[] | null>(null)
  useEffect(() => {
    fetch('/api/backups', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { files: [] }))
      .then((j) => setFiles(j.files || []))
      .catch(() => setFiles([]))
  }, [])
  if (!files) return null
  const db = files.filter((f) => f.name.endsWith('.sql.gz')).slice(0, 3)
  const media = files.filter((f) => f.name.endsWith('.tar.gz')).slice(0, 1)
  const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`
  return (
    <div style={{ marginTop: 16 }}>
      <strong>Backups</strong>{' '}
      {files.length === 0 ? (
        <span>The first backup runs tonight at 03:00 (server time). Database backups are kept for 14 days.</span>
      ) : (
        <span>
          Download a copy and keep it off the server:{' '}
          {[...db, ...media].map((f, i) => (
            <React.Fragment key={f.name}>
              {i > 0 && ' · '}
              <a href={`/api/backups/${f.name}`}>{f.name}</a> ({mb(f.size)})
            </React.Fragment>
          ))}
        </span>
      )}
    </div>
  )
}
