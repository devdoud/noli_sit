// Garde fou de la CSP (scripts/check-no-inline.mjs, spec 0001 « Règles pour garder la CSP valide »).
// Le script lit toujours ../dist par rapport à lui même : chaque test le copie dans un dossier
// temporaire avec un faux dist/, pour ne jamais toucher au vrai build.
import { spawnSync } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const scriptSource = fileURLToPath(new URL('../scripts/check-no-inline.mjs', import.meta.url))
const cleanPage =
  '<!DOCTYPE html><html lang="fr"><head><link rel="stylesheet" href="/_astro/a.css"></head><body><h1>Noli</h1></body></html>'

let root: string

async function writePage(relativePath: string, html: string) {
  const path = join(root, 'dist', relativePath)
  await mkdir(join(path, '..'), { recursive: true })
  await writeFile(path, html, 'utf8')
}

// Lance le contrôle sans RENDER par défaut ; extraEnv simule un build Render.
function runCheck(extraEnv: Record<string, string> = {}) {
  const env = { ...process.env, ...extraEnv }
  if (!('RENDER' in extraEnv)) delete env.RENDER
  const result = spawnSync(process.execPath, [join(root, 'scripts', 'check-no-inline.mjs')], {
    encoding: 'utf8',
    env,
  })
  return { code: result.status, out: `${result.stdout}${result.stderr}` }
}

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'noli-check-'))
  await mkdir(join(root, 'scripts'), { recursive: true })
  await copyFile(scriptSource, join(root, 'scripts', 'check-no-inline.mjs'))
})

afterEach(async () => {
  await rm(root, { recursive: true, force: true })
})

describe('check-no-inline', () => {
  it('passes and counts the pages when no page holds inline content', async () => {
    await writePage('index.html', cleanPage)
    await writePage('cgu.html', cleanPage)

    const { code, out } = runCheck()

    expect(code).toBe(0)
    expect(out).toContain('2 pages contrôlées')
  })

  it.each([
    ['a <script> tag', '<script>alert(1)</script>', 'balise <script>'],
    [
      'a <script> tag with attributes',
      '<script type="module" src="/x.js"></script>',
      'balise <script>',
    ],
    ['a <style> tag', '<style>p{color:red}</style>', 'balise <style>'],
    ['a style attribute', '<p style="color:red">x</p>', 'attribut style='],
    ['an uppercase STYLE attribute', '<p STYLE = "color:red">x</p>', 'attribut style='],
  ])('fails and names the page when it holds %s', async (_label, snippet, expectedLabel) => {
    await writePage('index.html', cleanPage)
    await writePage('piege.html', `<html><body>${snippet}</body></html>`)

    const { code, out } = runCheck()

    expect(code).toBe(1)
    expect(out).toContain(`piege.html : ${expectedLabel}`)
    expect(out).not.toContain('index.html :')
  })

  it('finds pages in nested folders', async () => {
    await writePage('index.html', cleanPage)
    await writePage('aide/faq.html', '<p style="x">a</p>')

    const { code, out } = runCheck()

    expect(code).toBe(1)
    expect(out).toMatch(/aide[\\/]faq\.html : attribut style=/)
  })

  it('does not flag words that only look like style, such as data-style or a class name', async () => {
    await writePage(
      'index.html',
      '<html><head><link rel="stylesheet" href="/_astro/a.css"></head><body><p data-style="x" class="stylebox">ok</p></body></html>',
    )

    const { code } = runCheck()

    expect(code).toBe(0)
  })

  it('fails on a {{tag}} left in a page (spec 0003)', async () => {
    await writePage('index.html', cleanPage.replace('<h1>Noli</h1>', '<p>{{editeur.nom}}</p>'))

    const { code, out } = runCheck()

    expect(code).toBe(1)
    expect(out).toContain('index.html : balise {{…}} non remplacée')
  })

  it('fails on an empty legal text (spec 0003)', async () => {
    await writePage(
      'confidentialite.html',
      cleanPage.replace('<h1>Noli</h1>', '<div class="prose prose-noli mt-8">  </div>'),
    )

    const { code, out } = runCheck()

    expect(code).toBe(1)
    expect(out).toContain('confidentialite.html : texte légal vide')
  })

  it('accepts a value to complete locally, refuses it on Render (spec 0003)', async () => {
    await writePage(
      'index.html',
      cleanPage.replace('Noli</h1>', 'Noli [À COMPLÉTER : editeur.nom]</h1>'),
    )

    expect(runCheck().code).toBe(0)
    const onRender = runCheck({ RENDER: 'true' })
    expect(onRender.code).toBe(1)
    expect(onRender.out).toContain('index.html : valeur à compléter dans src/config/site.ts')
  })

  it('fails and names the page when it loads no /_astro/ stylesheet (spec 0002)', async () => {
    await writePage('index.html', cleanPage)
    await writePage(
      'sans-style.html',
      '<!DOCTYPE html><html lang="fr"><body><h1>Noli</h1></body></html>',
    )

    const { code, out } = runCheck()

    expect(code).toBe(1)
    expect(out).toContain('sans-style.html : feuille de style absente')
    expect(out).not.toContain('index.html :')
  })

  it('accepts an external module script served from /_astro/ (spec 0006)', async () => {
    await writePage(
      'index.html',
      cleanPage.replace(
        '</body>',
        '<script type="module" src="/_astro/home.abc123.js"></script></body>',
      ),
    )

    expect(runCheck().code).toBe(0)
  })

  it.each([
    ['an external script from another path', '<script type="module" src="/js/home.js"></script>'],
    [
      'an external script with inline code',
      '<script type="module" src="/_astro/a.js">alert(1)</script>',
    ],
    ['a classic external script', '<script src="/_astro/a.js"></script>'],
  ])('still refuses %s (spec 0006)', async (_label, snippet) => {
    await writePage('index.html', cleanPage.replace('</body>', `${snippet}</body>`))

    const { code, out } = runCheck()

    expect(code).toBe(1)
    expect(out).toContain('index.html : balise <script>')
  })

  it('fails when dist holds no HTML page at all', async () => {
    await mkdir(join(root, 'dist', '_astro'), { recursive: true })
    await writeFile(join(root, 'dist', '_astro', 'a.css'), 'p{}', 'utf8')

    const { code, out } = runCheck()

    expect(code).toBe(1)
    expect(out).toContain('aucune page HTML')
  })
})
