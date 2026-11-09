/** Turns a YouTube, Vimeo, Matterport or other share link into an embeddable URL. */
export function embedUrl(raw?: string | null): string | null {
  if (!raw) return null
  let u: URL
  try {
    u = new URL(raw)
  } catch {
    return null
  }
  if (u.protocol !== 'https:') return null
  const host = u.hostname.replace(/^www\./, '')
  if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`
  if (host.endsWith('youtube.com')) {
    const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop()
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'vimeo.com') {
    const id = u.pathname.split('/').filter(Boolean)[0]
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  return u.toString()
}
