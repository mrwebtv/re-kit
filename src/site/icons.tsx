/** Small line icons used for custom property fields and labels. 24x24, stroke = currentColor. */
export const ICONS: Record<string, string> = {
  check: 'M5 12l5 5L20 7',
  pool: 'M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8',
  garage: 'M3 21V9l9-5 9 5v12M7 21v-8h10v8M7 16h10',
  parking: 'M6 21V3h7a5 5 0 0 1 0 10H6',
  garden: 'M12 21v-7M12 14c-4 0-6-3-6-7 4 0 6 3 6 7zM12 14c4 0 6-3 6-7-4 0-6 3-6 7zM5 21h14',
  sea: 'M2 15c2 0 2-1.5 4-1.5S8 15 10 15s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M2 19c2 0 2-1.5 4-1.5S8 19 10 19s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M12 3a4 4 0 0 1 4 4H8a4 4 0 0 1 4-4z',
  mountain: 'M3 20l6-11 4 6 3-4 5 9z',
  lift: 'M5 3h14v18H5zM9 8l3-3 3 3M9 16l3 3 3-3',
  fireplace: 'M3 21V5h18v16M7 21v-8h10v8M12 18c-1.5 0-2-1-2-2 0-1.5 2-3 2-3s2 1.5 2 3c0 1-.5 2-2 2z',
  aircon: 'M3 5h18v8H3zM7 17l-1 3M12 17v3M17 17l1 3M7 9h10',
  heating: 'M8 21c0-3 2-3 2-6s-2-3-2-6M14 21c0-3 2-3 2-6s-2-3-2-6',
  balcony: 'M4 11h16M5 11v10M19 11v10M9 11v10M14 11v10M4 21h16M7 11V4h10v7',
  terrace: 'M3 10l9-6 9 6M12 10v11M7 21h10',
  gym: 'M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12',
  wifi: 'M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01',
  pets: 'M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM13 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM12 11c-4 0-7 4-7 7 0 2 2 3 4 2s4-1 6 0 4 0 4-2c0-3-3-7-7-7z',
  security: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  solar: 'M3 20l3-10h12l3 10zM9 10l-1 10M15 10l1 10M4 15h16M12 2v3M5 5l2 2M19 5l-2 2',
  storage: 'M3 7l9-4 9 4v13H3zM3 7h18M9 12h6',
  furnished: 'M4 18v-6a2 2 0 0 1 4 0v2h8v-2a2 2 0 0 1 4 0v6zM6 18v2M18 18v2M7 12V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4',
  accessible: 'M12 4a1 1 0 1 1 0 .01M9 21a5 5 0 1 1 5-6M12 8v6h5l2 5',
  star: 'M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.3L12 17.5 6.5 20.4l1-6.3L3 9.7l6.2-.9z',
  home: 'M3 11l9-7 9 7v10H3zM9 21v-6h6v6',
  calendar: 'M4 5h16v16H4zM4 9h16M8 3v4M16 3v4',
  ruler: 'M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2',
  bed: 'M3 18V7M3 13h18v5M21 18v-5a3 3 0 0 0-3-3H10v3M6 11a1.5 1.5 0 1 0 0-.01',
  bath: 'M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V5a2 2 0 0 1 4 0',
  view: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  new: 'M12 3l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1zM5 21h14',
}

export const ICON_OPTIONS = Object.keys(ICONS).map((k) => ({ label: k[0]!.toUpperCase() + k.slice(1), value: k }))

export function Icon({ name, size = 18 }: { name?: string | null; size?: number }) {
  const d = (name && ICONS[name]) || ICONS.check
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rk-icon">
      <path d={d} />
    </svg>
  )
}
