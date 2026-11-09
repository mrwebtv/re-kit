/** Languages the kit supports. The database schema is fixed to this list; Site Settings > Languages picks which are live. */
export const LOCALES = [
  { code: 'en', label: 'English', intl: 'en-GB' },
  { code: 'fr', label: 'Français', intl: 'fr-FR' },
  { code: 'es', label: 'Español', intl: 'es-ES' },
  { code: 'de', label: 'Deutsch', intl: 'de-DE' },
  { code: 'it', label: 'Italiano', intl: 'it-IT' },
  { code: 'pt', label: 'Português', intl: 'pt-PT' },
  { code: 'nl', label: 'Nederlands', intl: 'nl-NL' },
  { code: 'ar', label: 'العربية', intl: 'ar', rtl: true },
] as const

export type Locale = (typeof LOCALES)[number]['code']
export const LOCALE_CODES = LOCALES.map((l) => l.code) as Locale[]
export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (LOCALE_CODES as string[]).includes(v)

/** Main language of the site (no URL prefix). Set DEFAULT_LANGUAGE in the environment, default English. */
export const DEFAULT_LOCALE: Locale = isLocale(process.env.DEFAULT_LANGUAGE) ? process.env.DEFAULT_LANGUAGE : 'en'
export const localeInfo = (code: string) => LOCALES.find((l) => l.code === code) || LOCALES[0]
