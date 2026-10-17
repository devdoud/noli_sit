// Réglages partagés (src/config/site.ts) : specs 0001 (adresses fixées) et 0002 (fonctions du gabarit).
// Les adresses sont promises aux stores et écrites dans l'app : ce test bloque tout changement involontaire.
import { afterEach, describe, expect, it } from 'vitest'
import {
  canonicalPath,
  footerLinks,
  formatLegalDate,
  pageTitle,
  routes,
  site,
  storeLinks,
} from '../src/config/site'

describe('site config', () => {
  it('keeps the public addresses promised to the stores and the app', () => {
    expect(routes).toEqual({
      home: '/',
      privacy: '/confidentialite',
      terms: '/cgu',
      accountDeletion: '/suppression-compte',
      legalNotice: '/mentions-legales',
      contact: '/contact',
    })
  })

  it('writes every address without a trailing slash or .html', () => {
    for (const path of Object.values(routes)) {
      if (path === '/') continue
      expect(path).toMatch(/^\/[a-z-]+$/)
    }
  })

  it('points support to the nollli.com mailbox', () => {
    expect(site.supportEmail).toBe('support@nollli.com')
  })

  it('uses the app canvas color as the browser theme color', () => {
    expect(site.themeColor).toBe('#0B0C10')
  })

  it('leaves the store links empty until the app is published', () => {
    expect(storeLinks).toEqual({ googlePlay: null, appStore: null })
  })

  it('only lists footer links that point to a known address', () => {
    const known = Object.values(routes) as string[]
    for (const entry of footerLinks) {
      expect(known).toContain(entry.href)
      expect(entry.label.trim()).not.toBe('')
    }
  })
})

describe('pageTitle (covers: AC-2)', () => {
  it('returns the site name alone for the home page', () => {
    expect(pageTitle()).toBe('Noli')
  })

  it('suffixes a page name with the site name', () => {
    expect(pageTitle("Conditions d'utilisation")).toBe("Conditions d'utilisation · Noli")
  })

  it('treats an empty name like no name', () => {
    expect(pageTitle('')).toBe('Noli')
  })
})

describe('canonicalPath (covers: AC-2)', () => {
  it.each([
    ['/', '/'],
    ['/index.html', '/'],
    ['/cgu.html', '/cgu'],
    ['/cgu/', '/cgu'],
    ['/cgu', '/cgu'],
    ['/suppression-compte.html', '/suppression-compte'],
  ])('turns %s into %s', (input, expected) => {
    expect(canonicalPath(input)).toBe(expected)
  })
})

describe('formatLegalDate (covers: AC-7)', () => {
  const originalTz = process.env.TZ

  afterEach(() => {
    process.env.TZ = originalTz
  })

  it('writes the date in French long format', () => {
    expect(formatLegalDate(new Date('2026-10-17'))).toBe('17 octobre 2026')
  })

  it.each(['Pacific/Auckland', 'America/Los_Angeles'])(
    'gives the same day when the build machine runs in %s',
    (zone) => {
      process.env.TZ = zone
      expect(formatLegalDate(new Date('2026-10-17'))).toBe('17 octobre 2026')
    },
  )

  it('keeps the first day of the month in UTC', () => {
    expect(formatLegalDate(new Date('2026-01-01'))).toBe('1 janvier 2026')
  })
})
