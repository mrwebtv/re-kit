'use client'
import { useCallback, useEffect, useRef } from 'react'
import { useSite } from '../i18n/client'

type W = Window & {
  turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void }
  grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, o: { action: string }) => Promise<string> }
}

const loaded = new Map<string, Promise<void>>()
function load(src: string) {
  if (!loaded.has(src)) {
    loaded.set(
      src,
      new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = src
        s.async = true
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('captcha script failed'))
        document.head.appendChild(s)
      }),
    )
  }
  return loaded.get(src)!
}

/** Turnstile widget or invisible reCAPTCHA v3, only when switched on in Site Settings. */
export function useCaptcha() {
  const { captcha } = useSite()
  const box = useRef<HTMLDivElement>(null)
  const token = useRef('')
  const widget = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!captcha) return
    const w = window as W
    if (captcha.provider === 'recaptcha') {
      void load(`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(captcha.siteKey)}`)
      return
    }
    void load('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit').then(() => {
      if (box.current && w.turnstile && !widget.current) {
        widget.current = w.turnstile.render(box.current, { sitekey: captcha.siteKey, callback: (t: string) => (token.current = t), 'expired-callback': () => (token.current = '') })
      }
    })
  }, [captcha])

  const getToken = useCallback(async () => {
    if (!captcha) return undefined
    const w = window as W
    if (captcha.provider === 'recaptcha') {
      await load(`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(captcha.siteKey)}`)
      return new Promise<string>((resolve) => w.grecaptcha!.ready(() => void w.grecaptcha!.execute(captcha.siteKey, { action: 'submit' }).then(resolve)))
    }
    return token.current || undefined
  }, [captcha])

  const reset = useCallback(() => {
    const w = window as W
    if (captcha?.provider !== 'recaptcha' && w.turnstile) {
      token.current = ''
      w.turnstile.reset(widget.current)
    }
  }, [captcha])

  const node = captcha && captcha.provider !== 'recaptcha' ? <div ref={box} className="rk-captcha" /> : null
  return { node, getToken, reset }
}
