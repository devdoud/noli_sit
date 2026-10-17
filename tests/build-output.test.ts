// Résultat du build : spec 0001 (configuration, CSP) et spec 0002 (gabarit commun).
// Construit le site une fois dans un dossier temporaire (astro build --outDir) pour ne pas toucher au vrai dist/.
import { spawnSync } from 'node:child_process'
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { footerLinks, site } from '../src/config/site'
import { siteValues } from '../src/config/site-values'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const astroBin = join(projectRoot, 'node_modules', 'astro', 'bin', 'astro.mjs')

let outDir: string
let files: string[]
let indexHtml: string
let notFoundHtml: string
let privacyHtml: string
let deletionHtml: string
let css: string

// Le morceau de html qui va de start jusqu'au premier end qui le suit.
const between = (html: string, start: string, end: string) => {
  const from = html.indexOf(start)
  return html.slice(from, html.indexOf(end, from) + end.length)
}

beforeAll(async () => {
  outDir = await mkdtemp(join(tmpdir(), 'noli-build-'))
  const result = spawnSync(process.execPath, [astroBin, 'build', '--outDir', outDir], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  })
  if (result.status !== 0) {
    throw new Error(`astro build a échoué :\n${result.stdout}\n${result.stderr}`)
  }
  files = (await readdir(outDir, { recursive: true })).map((file) => file.replaceAll('\\', '/'))
  indexHtml = await readFile(join(outDir, 'index.html'), 'utf8')
  notFoundHtml = await readFile(join(outDir, '404.html'), 'utf8')
  privacyHtml = await readFile(join(outDir, 'confidentialite.html'), 'utf8')
  deletionHtml = await readFile(join(outDir, 'suppression-compte.html'), 'utf8')
  const cssFiles = files.filter((file) => file.startsWith('_astro/') && file.endsWith('.css'))
  css = (await Promise.all(cssFiles.map((file) => readFile(join(outDir, file), 'utf8')))).join('\n')
}, 120_000)

afterAll(async () => {
  if (outDir) await rm(outDir, { recursive: true, force: true })
})

const pages = [
  ['home page', () => indexHtml],
  ['404 page', () => notFoundHtml],
  ['privacy page', () => privacyHtml],
  ['account deletion page', () => deletionHtml],
] as const

describe('build output (spec 0001)', () => {
  it('produces the home page and the 404 page as flat .html files', () => {
    expect(files).toContain('index.html')
    expect(files).toContain('404.html')
    expect(files.some((file) => file.endsWith('/index.html') && file !== 'index.html')).toBe(false)
  })

  it.each(pages)('keeps the %s free of inline script, style and data: resources', (_n, html) => {
    const page = html().replace(/<script type="module" src="\/_astro\/[^"]+\.js"><\/script>/g, '')
    expect(page).not.toMatch(/<script\b/i)
    expect(page).not.toMatch(/<style\b/i)
    expect(page).not.toMatch(/\sstyle\s*=/i)
    expect(page).not.toContain('data:')
  })

  it('serves CSS only as hashed files under /_astro/', () => {
    const stylesheets = [...indexHtml.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(
      (m) => m[1],
    )
    expect(stylesheets.length).toBeGreaterThan(0)
    for (const href of stylesheets) expect(href).toMatch(/^\/_astro\/[^/]+\.css$/)
  })

  it('ships JavaScript only as an external module of the home page (spec 0006)', () => {
    const scripts = files.filter((file) => file.endsWith('.js'))
    expect(scripts.every((file) => file.startsWith('_astro/'))).toBe(true)
    expect(indexHtml).toMatch(/<script type="module" src="\/_astro\/[^"]+\.js"><\/script>/)
    for (const page of [notFoundHtml, privacyHtml, deletionHtml]) {
      expect(page).not.toMatch(/<script\b/i)
    }
  })

  it('carries the brand color from the app into the CSS', () => {
    expect(css).toContain('--color-brand:#f5a623')
  })
})

describe('head (spec 0002, covers: AC-2)', () => {
  it.each(pages)('marks the %s as French and dark', (_n, html) => {
    const page = html()
    expect(page).toContain('<html lang="fr"')
    expect(page).toContain('<meta name="color-scheme" content="dark">')
    expect(page).toContain('<meta name="theme-color" content="#0B0C10">')
  })

  it.each(pages)('links both favicons on the %s, and the files exist', (_n, html) => {
    const page = html()
    expect(page).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg">')
    expect(page).toContain(
      '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">',
    )
    expect(files).toContain('favicon.svg')
    expect(page).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png">')
    expect(files).toContain('favicon-32.png')
    expect(files).toContain('apple-touch-icon.png')
  })

  it.each(pages)('gives the %s a non empty description', (_n, html) => {
    expect(html()).toMatch(/<meta name="description" content="[^"]+"/)
  })

  it('titles the home page with the site name alone', () => {
    expect(indexHtml).toContain('<title>Noli</title>')
  })

  it('titles the 404 page with its name and the site name', () => {
    expect(notFoundHtml).toContain('<title>Page introuvable · Noli</title>')
  })

  it('gives the home page its canonical address', () => {
    expect(indexHtml).toContain('<link rel="canonical" href="https://nollli.com/">')
  })

  it('gives the 404 page no canonical address', () => {
    expect(notFoundHtml).not.toContain('rel="canonical"')
  })
})

describe('template (spec 0002)', () => {
  it.each(pages)('opens the %s body with the skip link to #contenu (covers: AC-3)', (_n, html) => {
    const body = html().slice(html().indexOf('<body'))
    const firstLink = /<a\b[^>]*>/.exec(body)?.[0] ?? ''
    expect(firstLink).toContain('href="#contenu"')
    expect(body).toMatch(/<a [^>]*href="#contenu"[^>]*>Aller au contenu<\/a>/)
    expect(body).toContain('<main id="contenu" tabindex="-1">')
  })

  it.each(pages)('puts the header, main and footer on the %s (covers: AC-11)', (_n, html) => {
    const page = html()
    expect(page).toContain('<header')
    expect(page).toContain('<main')
    expect(page).toContain('<footer')
  })

  it('links the word Noli alone to the home page, with no image (covers: AC-4)', () => {
    const header = between(indexHtml, '<header', '</header>')
    const link = /<a [^>]*href="\/"[^>]*>(.*?)<\/a>/s.exec(header)?.[1] ?? ''
    expect(link.trim()).toBe('Noli')
    expect(header).not.toContain('<img')
  })

  it('shows the support address and the build year in the footer (covers: AC-5)', () => {
    const footer = between(indexHtml, '<footer', '</footer>')
    expect(footer).toMatch(/<a [^>]*href="mailto:support@nollli.com"/)
    expect(footer).toContain(`© ${String(new Date().getFullYear())} Noli`)
  })

  it('renders the legal nav only when footer links exist, one link per entry (covers: AC-5)', () => {
    const footer = between(indexHtml, '<footer', '</footer>')
    if (footerLinks.length === 0) {
      expect(footer).not.toContain('<nav')
      return
    }
    const nav = between(footer, '<nav', '</nav>')
    expect(nav).toContain('aria-label="Liens légaux"')
    expect([...nav.matchAll(/<a /g)].length).toBe(footerLinks.length)
    for (const entry of footerLinks) expect(nav).toContain(`href="${entry.href}"`)
  })

  it('only lists footer links whose page is built (covers: AC-5)', () => {
    for (const entry of footerLinks) {
      expect(files).toContain(`${entry.href.slice(1)}.html`)
    }
  })

  it('shows both stores as coming soon, with no link and no ARIA state (covers: AC-6)', () => {
    const footer = between(indexHtml, '<footer', '</footer>')
    const list = between(footer, '<ul class="flex flex-wrap gap-3">', '</ul>')
    const items = [...list.matchAll(/<li\b[^>]*>(.*?)<\/li>/gs)].map((m) => m[1])
    expect(items).toHaveLength(2)
    expect(items[0]).toContain('Google Play')
    expect(items[1]).toContain('App Store')
    for (const item of items) {
      expect(item).toContain('Bientôt disponible')
      expect(item).not.toMatch(/<a\b|href=|tabindex|aria-disabled/)
      // L'icône du store est décorative (2026-10-17) : seul aria-hidden est permis.
      expect(item).toMatch(/<svg [^>]*aria-hidden="true"/)
      expect(item.replace(/aria-hidden="true"/g, '')).not.toContain('aria-')
    }
  })
})

describe('resources (spec 0002, covers: AC-8)', () => {
  it('serves the two fonts as woff2 files under /_astro/', () => {
    const fonts = files.filter((file) => file.startsWith('_astro/') && file.endsWith('.woff2'))
    expect(fonts.some((file) => file.includes('bricolage-grotesque-latin-wght'))).toBe(true)
    expect(fonts.some((file) => file.includes('plus-jakarta-sans-latin-wght'))).toBe(true)
  })

  it('loads every font from the site itself', () => {
    const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1])
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) expect(url).toMatch(/^\/_astro\//)
  })

  it.each(pages)('only points the %s at nollli.com or mailto', (_n, html) => {
    const absolute = [...html().matchAll(/(?:href|src)="([a-z]+:[^"]*)"/g)].map((m) => m[1])
    for (const url of absolute) expect(url).toMatch(/^(https:\/\/nollli\.com(\/|$)|mailto:)/)
  })

  it('keeps the CSS free of other domains and data: resources', () => {
    // Les commentaires (licence de Tailwind) citent des URL sans rien charger.
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, '')
    expect(rules).not.toMatch(/https?:\/\/(?!nollli\.com)/)
    expect(rules).not.toContain('data:')
  })
})

describe('privacy policy page (spec 0003)', () => {
  const text = () => privacyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

  it('is built at /confidentialite with its title, canonical and French date (covers: AC-1)', () => {
    expect(files).toContain('confidentialite.html')
    expect(privacyHtml).toContain('<title>Politique de confidentialité · Noli</title>')
    expect(privacyHtml).toContain(
      '<link rel="canonical" href="https://nollli.com/confidentialite">',
    )
    expect(privacyHtml).toMatch(
      /Mis à jour le <time datetime="\d{4}-\d{2}-\d{2}">\d{1,2} \S+ \d{4}<\/time>/,
    )
    expect([...privacyHtml.matchAll(/<h1\b/g)]).toHaveLength(1)
  })

  it('has the 15 sections in the spec order (covers: AC-2)', () => {
    const headings = [...privacyHtml.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((m) => m[1])
    expect(headings).toEqual([
      'Qui sommes nous',
      'En bref',
      'Les données que nous traitons',
      'Sur votre téléphone',
      'Pourquoi nous les utilisons',
      'Avec qui nous les partageons',
      'Où elles sont hébergées',
      'Combien de temps nous les gardons',
      'Vos droits',
      'Supprimer votre compte',
      'Les mineurs',
      'La sécurité',
      'Ce site web',
      'Les changements de cette politique',
      'Nous contacter',
    ])
  })

  it('fills every tag from site.ts, or marks it to complete when empty (covers: AC-6)', () => {
    expect(privacyHtml).not.toContain('{{')
    for (const [tag, value] of Object.entries(siteValues)) {
      const expected = value.trim() === '' ? `[À COMPLÉTER : ${tag}]` : value.trim()
      expect(text(), tag).toContain(expected)
    }
  })

  it.each([
    'MongoDB Atlas',
    'Render',
    'Cloudinary',
    'Brevo',
    'Firebase Cloud Messaging',
    'KkiaPay',
  ])('names the provider %s (covers: AC-4)', (provider) => {
    expect(text()).toContain(provider)
  })

  it.each([
    ['the support address', site.supportEmail],
    ['the one month answer delay', 'un délai d’un mois'],
    ['the Benin authority', 'APDP'],
    ['the EU authority example', 'CNIL'],
    ['the minimum age', '13 ans'],
    ['the parental agreement for premium', 'accord d’un parent'],
    ['cookies', 'cookie'],
    ['the absence of a DPO', 'délégué à la protection des données'],
    ['automated decisions', 'décision automatisée'],
    ['the 30 day notification retention', '30 jours'],
    ['the 24 hour reset code retention', '24 heures'],
    ['the 3 year deletion trace', '3 ans'],
    ['the accounting retention', 'obligations comptables et fiscales'],
    ['the data required for an account', 'nous ne pouvons pas créer de compte'],
  ])('mentions %s (covers: AC-3, AC-5, AC-7, AC-8, AC-12)', (_what, phrase) => {
    expect(text()).toContain(phrase)
  })

  it.each([
    'Cloudflare',
    'Sign in with Apple',
    'connexion Apple',
    'Google Sign',
    'connexion Google',
  ])('does not mention the inactive service %s (covers: AC-4)', (phrase) => {
    expect(text().toLowerCase()).not.toContain(phrase.toLowerCase())
  })

  it.each(pages)('links the policy from the footer of the %s (covers: AC-9)', (_n, html) => {
    const footer = between(html(), '<footer', '</footer>')
    expect(footer).toMatch(/<a [^>]*href="\/confidentialite"[^>]*>Confidentialité<\/a>/)
  })

  it('links only to pages that are built', () => {
    const internal = [...privacyHtml.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1])
    for (const href of internal) {
      if (href === '/' || href.startsWith('/_astro/') || /\.(png|svg|css)$/.test(href)) continue
      expect(files).toContain(`${href.slice(1)}.html`)
    }
  })
})

describe('account deletion page (spec 0004)', () => {
  const text = () => deletionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

  it('is built at /suppression-compte with its title and canonical (covers: AC-1)', () => {
    expect(files).toContain('suppression-compte.html')
    expect(deletionHtml).toContain('<title>Supprimer votre compte Noli · Noli</title>')
    expect(deletionHtml).toContain(
      '<link rel="canonical" href="https://nollli.com/suppression-compte">',
    )
    expect([...deletionHtml.matchAll(/<h1\b/g)]).toHaveLength(1)
  })

  it('names the app and its publisher, and gives both ways before any section (covers: AC-2)', () => {
    const intro = deletionHtml.slice(
      deletionHtml.indexOf('prose-noli'),
      deletionHtml.indexOf('<h2'),
    )
    const publisher = siteValues['editeur.nom'].trim() || '[À COMPLÉTER : editeur.nom]'
    expect(intro).toContain('Noli')
    expect(intro).toContain(publisher)
    expect(intro).toContain('Supprimer mon compte')
    expect(intro).toContain('sans mot de passe')
    expect(intro).toContain('support@nollli.com')
  })

  it('has the 10 sections in the spec order (covers: AC-3)', () => {
    const headings = [...deletionHtml.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((m) => m[1])
    expect(headings).toEqual([
      'Dans l’application',
      'Sans l’application',
      'Mot de passe oublié',
      'Plus d’accès à votre adresse email',
      'Ce qui est supprimé',
      'Ce que nous gardons',
      'Votre abonnement premium',
      'Après la suppression',
      'Supprimer seulement une partie de vos données',
      'Une question',
    ])
  })

  it('links to the support email with the prefilled subject (covers: AC-5)', () => {
    expect(deletionHtml).toMatch(
      /<a href="mailto:support@nollli\.com\?subject=Suppression%20de%20mon%20compte%20Noli">Écrire au support<\/a>/,
    )
  })

  it.each([
    ['the profile label', 'Profil'],
    ['the delete button', 'Supprimer mon compte'],
    ['the final button', 'Supprimer définitivement'],
    ['the forgotten password link', 'Mot de passe oublié ?'],
    ['the photo removal', 'Retirer la photo'],
    ['the no password path', 'sans mot de passe'],
    ['the one month delay', 'délai d’un mois'],
    ['the extension', 'deux mois'],
    ['the 3 year trace', '3 ans'],
    ['the accounting retention', 'obligations comptables et fiscales'],
    ['the premium loss', 'sans remboursement'],
    ['the confirmation email subject', '« Ton compte Noli a été supprimé »'],
    ['the phone data', 'désinstallez l’application'],
    ['the push counter', 'compteur quotidien'],
    ['the providers', 'Brevo'],
    ['re-registration', 'même adresse email'],
  ])('mentions %s (covers: AC-4 to AC-10)', (_what, phrase) => {
    expect(text()).toContain(phrase)
  })

  it('is linked from the privacy policy (covers: AC-11)', () => {
    expect(privacyHtml).toMatch(/<a href="\/suppression-compte">[^<]+<\/a>/)
  })

  it.each(pages)(
    'lists Suppression de compte after Confidentialité in the %s footer (covers: AC-11)',
    (_n, html) => {
      const footer = between(html(), '<footer', '</footer>')
      const privacy = footer.indexOf('>Confidentialité</a>')
      const deletion = footer.indexOf('>Suppression de compte</a>')
      expect(privacy).toBeGreaterThan(-1)
      expect(deletion).toBeGreaterThan(privacy)
      expect(footer).toContain('href="/suppression-compte"')
    },
  )
})

describe('home page (spec 0006)', () => {
  const text = () => indexHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

  it('has one h1 and the sections in the spec order (covers: AC-1)', () => {
    expect([...indexHtml.matchAll(/<h1\b/g)]).toHaveLength(1)
    const headings = [...indexHtml.matchAll(/<h2[^>]*>\s*(.*?)\s*<\/h2>/gs)].map((m) =>
      m[1].replace(/\s+/g, ' '),
    )
    expect(headings).toEqual([
      'Pourquoi Noli',
      'Comment ça marche',
      'Gratuit ou Premium',
      'Questions fréquentes',
      'Noli arrive bientôt sur votre téléphone.',
    ])
  })

  it('shows the store buttons in the hero, the final call and the footer (covers: AC-1)', () => {
    expect([...indexHtml.matchAll(/<ul class="flex flex-wrap gap-3">/g)]).toHaveLength(3)
  })

  it('answers five questions with native details, no script (covers: AC-3)', () => {
    expect([...indexHtml.matchAll(/<details\b/g)]).toHaveLength(5)
    expect([...indexHtml.matchAll(/<summary\b/g)]).toHaveLength(5)
    expect(indexHtml).toMatch(/<a href="\/confidentialite"[^>]*>politique de confidentialité<\/a>/)
    expect(indexHtml).toMatch(
      /<a href="\/suppression-compte"[^>]*>Supprimer votre compte Noli<\/a>/,
    )
  })

  it.each([
    '30 jours',
    'renouvellement automatique',
    'KkiaPay',
    'mobile money',
    'Prix affiché dans l’application',
    'Aucune publicité',
    'Google Play',
    'App Store',
  ])('states the fact « %s » (covers: AC-2)', (phrase) => {
    expect(text()).toContain(phrase)
  })

  it('promises no price, currency or release date (covers: AC-2)', () => {
    expect(text()).not.toMatch(/\d[\d\s.,]*\s?(FCFA|XOF|NGN|€|\$)/)
    expect(text()).not.toMatch(
      /\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b/i,
    )
    expect(text()).not.toContain('dès leur sortie')
  })

  it('loads no image in the page body (covers: AC-4)', () => {
    expect(between(indexHtml, '<main', '</main>')).not.toContain('<img')
  })
})
