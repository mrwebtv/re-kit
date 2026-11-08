'use client'
import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

export type MapPoint = { id: number | string; lat: number; lng: number; label: string; href?: string; highlight?: boolean }

/** OpenStreetMap map with price pins. Free, no API key. */
export function PropertyMap({ points, zoom = 13, className }: { points: MapPoint[]; zoom?: number; className?: string }) {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let map: import('leaflet').Map | undefined
    let cancelled = false
    ;(async () => {
      const L = (await import('leaflet')).default
      if (cancelled || !el.current) return
      const valid = points.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      map = L.map(el.current, { scrollWheelZoom: false, attributionControl: true })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)
      for (const p of valid) {
        const icon = L.divIcon({
          className: '',
          html: `<span class="rk-pin${p.highlight ? ' is-hl' : ''}">${p.label.replace(/</g, '&lt;')}</span>`,
          iconSize: undefined as never,
        })
        const m = L.marker([p.lat, p.lng], { icon, keyboard: true, title: p.label }).addTo(map)
        if (p.href) m.on('click', () => (window.location.href = p.href!))
      }
      if (valid.length > 1) map.fitBounds(L.latLngBounds(valid.map((p) => [p.lat, p.lng])), { padding: [48, 48] })
      else if (valid.length === 1) map.setView([valid[0]!.lat, valid[0]!.lng], zoom)
      else map.setView([0, 0], 2)
    })()
    return () => {
      cancelled = true
      map?.remove()
    }
  }, [points, zoom])
  return <div ref={el} className={className} role="region" aria-label="Map of properties" />
}
