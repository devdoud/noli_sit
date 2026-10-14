// Réglages partagés (src/config/site.ts, spec 0001 « Adresses fixées » et « Réglages partagés »).
// Les adresses sont promises aux stores et écrites dans l'app : ce test bloque tout changement involontaire.
import { describe, expect, it } from 'vitest'
import { routes, site, storeLinks } from '../src/config/site'

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

  it('leaves the store links empty until the app is published', () => {
    expect(storeLinks).toEqual({ googlePlay: null, appStore: null })
  })
})
