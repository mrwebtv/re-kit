'use client'
import { useCallback, useEffect, useState } from 'react'
import { useT } from '../i18n/client'

export type Photo = { url: string; full: string; alt: string }

/** Photo mosaic with a keyboard-friendly lightbox. */
export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const t = useT()
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length])
  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, step])

  if (!photos.length) return <div className="rk-gallery is-empty"><div className="rk-ph" /></div>
  const shown = photos.slice(0, 5)
  return (
    <>
      <div className={`rk-gallery n${shown.length}`}>
        {shown.map((p, i) => (
          <button key={p.url + i} type="button" className="rk-gallery-item" onClick={() => setOpen(i)} aria-label={t('Open photo {i} of {n}', { i: i + 1, n: photos.length })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.alt || `${title}, photo ${i + 1}`} loading={i ? 'lazy' : 'eager'} />
            {i === shown.length - 1 && photos.length > 1 && <span className="rk-gallery-more">{t('View all {n} photos', { n: photos.length })}</span>}
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="rk-lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[open]!.full} alt={photos[open]!.alt || title} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="rk-lb-close" onClick={close} aria-label={t('Close')}>×</button>
          {photos.length > 1 && (
            <>
              <button type="button" className="rk-lb-prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label={t('Previous photo')}>‹</button>
              <button type="button" className="rk-lb-next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label={t('Next photo')}>›</button>
            </>
          )}
          <span className="rk-lb-count">{open + 1} / {photos.length}</span>
        </div>
      )}
    </>
  )
}
