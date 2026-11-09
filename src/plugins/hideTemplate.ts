import type { Plugin } from 'payload'

/** Template parts this site does not use. Kept in the schema, hidden from the admin. */
const HIDDEN = new Set(['pages', 'posts', 'categories', 'forms', 'form-submissions', 'search', 'redirects', 'header', 'footer'])

export const hideTemplateLeftovers: Plugin = (config) => ({
  ...config,
  collections: (config.collections || []).map((c) => (HIDDEN.has(c.slug) ? { ...c, admin: { ...c.admin, hidden: true } } : c)),
  globals: (config.globals || []).map((g) => (HIDDEN.has(g.slug) ? { ...g, admin: { ...g.admin, hidden: true } } : g)),
})
