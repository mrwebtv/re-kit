'use client'
import { useEffect, useState } from 'react'
import { useT } from '../i18n/client'
import { PropertyMap, type MapPoint } from './PropertyMap'

type Place = { kind: string; name: string; lat: number; lng: number; km: number }
type Walk = { walk?: number; walkText?: string; transit?: number; transitText?: string; bike?: number; bikeText?: string; link?: string } | null

const KINDS: Record<string, string> = { school: 'Schools', transport: 'Transport', shop: 'Shops', health: 'Health', park: 'Parks', food: 'Food and drink' }

/** Nearby places (OpenStreetMap) and Walk Score, loaded after the page so it never slows it down. */
export function Nearby({ id, lat, lng, title }: { id: number; lat: number; lng: number; title: string }) {
  const t = useT()
  const [data, setData] = useState<{ nearby?: Place[]; walkScore?: Walk } | null>(null)
  useEffect(() => {
    fetch(`/api/nearby/${id}`).then((r) => r.json()).then(setData).catch(() => setData({}))
  }, [id])
  if (!data) return <p className="rk-muted">{t('Loading what is nearby…')}</p>
  const places = data.nearby || []
  const groups = Object.keys(KINDS).map((k) => [k, places.filter((p) => p.kind === k)] as const).filter(([, v]) => v.length)
  const ws = data.walkScore
  if (!groups.length && !ws) return null
  const points: MapPoint[] = [{ id: 'home', lat, lng, label: title, highlight: true }, ...places.map((p, i) => ({ id: `p${i}`, lat: p.lat, lng: p.lng, label: p.name, kind: p.kind }))]
  const dist = (km: number) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`)
  return (
    <div className="rk-nearby">
      <h2>{t("What's nearby")}</h2>
      {ws && (
        <div className="rk-scores">
          {[['Walk Score', ws.walk, ws.walkText], ['Transit Score', ws.transit, ws.transitText], ['Bike Score', ws.bike, ws.bikeText]].filter(([, v]) => typeof v === 'number').map(([k, v, d]) => (
            <div key={k as string} className="rk-score"><strong>{v as number}</strong><span>{k as string}</span><small>{d as string}</small></div>
          ))}
          {ws.link && <a href={ws.link} target="_blank" rel="noopener noreferrer" className="rk-ws-credit">Walk Score®</a>}
        </div>
      )}
      {groups.length > 0 && (
        <div className="rk-twocol">
          <div className="rk-nearby-list">
            {groups.map(([k, list]) => (
              <div key={k}>
                <strong><span className={`rk-poi rk-poi-${k}`} aria-hidden="true" /> {t(KINDS[k]!)}</strong>
                <ul>{list.map((p) => <li key={p.name}><span>{p.name}</span><span className="rk-muted">{dist(p.km)}</span></li>)}</ul>
              </div>
            ))}
            <small className="rk-muted">{t('Distances in a straight line. Data © OpenStreetMap contributors.')}</small>
          </div>
          <div><PropertyMap points={points} zoom={15} className="rk-map" /></div>
        </div>
      )}
    </div>
  )
}
