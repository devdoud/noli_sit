// Balises {{…}} des textes légaux (spec 0003, AC-6) : fillSiteValues et le plugin remark.
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fillSiteValues, remarkSiteValues, siteValues } from '../src/config/site-values'

const values = { 'editeur.nom': 'Noli SARL', 'hebergement.region': '' }

function runPlugin(markdown: string, strict: boolean) {
  const processor = unified().use(remarkParse).use(remarkSiteValues, { values, strict })
  return processor.runSync(processor.parse(markdown))
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fillSiteValues (covers: AC-6)', () => {
  it('replaces a known tag with its value', () => {
    expect(fillSiteValues('Édité par {{editeur.nom}}.', values, false)).toEqual({
      text: 'Édité par Noli SARL.',
      missing: [],
    })
  })

  it('accepts spaces inside the braces', () => {
    expect(fillSiteValues('{{ editeur.nom }}', values, true).text).toBe('Noli SARL')
  })

  it('marks an empty value as to complete outside strict mode', () => {
    expect(fillSiteValues('Région : {{hebergement.region}}', values, false)).toEqual({
      text: 'Région : [À COMPLÉTER : hebergement.region]',
      missing: ['hebergement.region'],
    })
  })

  it('treats a value made of spaces as empty', () => {
    expect(fillSiteValues('{{editeur.nom}}', { 'editeur.nom': '   ' }, false).missing).toEqual([
      'editeur.nom',
    ])
  })

  it('fails on an empty value in strict mode', () => {
    expect(() => fillSiteValues('{{hebergement.region}}', values, true)).toThrow(
      'Valeur vide pour {{hebergement.region}}',
    )
  })

  it('fails on an unknown tag, even outside strict mode', () => {
    expect(() => fillSiteValues('{{editeur.telephone}}', values, false)).toThrow(
      'Balise inconnue {{editeur.telephone}}',
    )
  })

  it('leaves text without tags untouched', () => {
    expect(fillSiteValues('Aucune balise ici.', values, true)).toEqual({
      text: 'Aucune balise ici.',
      missing: [],
    })
  })

  it('knows exactly the five tags of the spec', () => {
    expect(Object.keys(siteValues).sort()).toEqual([
      'editeur.adresse',
      'editeur.forme',
      'editeur.nom',
      'editeur.pays',
      'hebergement.region',
    ])
  })
})

describe('remarkSiteValues (covers: AC-6)', () => {
  it('fills tags in body text, table cells and link text', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const tree = runPlugin(
      '{{editeur.nom}}\n\n| A |\n|---|\n| {{editeur.nom}} |\n\n[{{editeur.nom}}](/)',
      false,
    )
    const text = JSON.stringify(tree)
    expect(text).not.toContain('{{')
    expect(text.match(/Noli SARL/g)).toHaveLength(3)
  })

  it('warns once per missing value outside strict mode', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    runPlugin('{{hebergement.region}} et {{hebergement.region}}', false)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]?.[0]).toContain('hebergement.region')
  })

  it('fails on an empty value in strict mode', () => {
    expect(() => runPlugin('{{hebergement.region}}', true)).toThrow('Valeur vide')
  })

  it.each([
    ['inline code', 'Voir `{{editeur.nom}}`'],
    ['a code block', '```\n{{editeur.nom}}\n```'],
    ['a link address', '[site](https://exemple.com/{{editeur.nom}})'],
  ])('fails on a tag left in %s', (_where, markdown) => {
    expect(() => runPlugin(markdown, false)).toThrow('ne peut pas être remplie')
  })
})
