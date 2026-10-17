// Balises {{…}} des textes légaux, remplacées au build par les valeurs de site.ts (spec 0003, AC-6).
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'
import { dataHosting, publisher } from './site'

export const siteValues: Readonly<Record<string, string>> = {
  'editeur.nom': publisher.name,
  'editeur.forme': publisher.legalForm,
  'editeur.adresse': publisher.address,
  'editeur.pays': publisher.country,
  'hebergement.region': dataHosting.region,
}

const tagPattern = /\{\{\s*([a-z.]+)\s*\}\}/g

// Remplace chaque {{tag}} connu. Tag inconnu : erreur. Valeur vide : erreur en mode strict,
// sinon « [À COMPLÉTER : tag] » et le tag est ajouté à missing.
export function fillSiteValues(
  text: string,
  values: Readonly<Record<string, string>>,
  strict: boolean,
): { text: string; missing: string[] } {
  const missing: string[] = []
  const filled = text.replace(tagPattern, (_match, tag: string) => {
    if (!Object.hasOwn(values, tag)) {
      throw new Error(`Balise inconnue {{${tag}}} dans un texte légal.`)
    }
    const value = values[tag].trim()
    if (value !== '') return value
    if (strict) {
      throw new Error(
        `Valeur vide pour {{${tag}}} : la remplir dans src/config/site.ts avant de publier.`,
      )
    }
    missing.push(tag)
    return `[À COMPLÉTER : ${tag}]`
  })
  return { text: filled, missing }
}

export interface RemarkSiteValuesOptions {
  values?: Readonly<Record<string, string>>
  strict?: boolean
}

// Plugin remark : remplit les nœuds texte, puis refuse toute balise restée ailleurs
// (code, code en ligne, adresse ou titre de lien, image).
export function remarkSiteValues(options: RemarkSiteValuesOptions = {}) {
  const values = options.values ?? siteValues
  const strict = options.strict ?? false

  return (tree: Root): void => {
    const missing = new Set<string>()

    visit(tree, 'text', (node) => {
      const result = fillSiteValues(node.value, values, strict)
      node.value = result.text
      for (const tag of result.missing) missing.add(tag)
    })

    visit(tree, (node) => {
      const leftovers = [
        'value' in node && typeof node.value === 'string' ? node.value : '',
        'url' in node && typeof node.url === 'string' ? node.url : '',
        'title' in node && typeof node.title === 'string' ? node.title : '',
      ]
      if (leftovers.some((text) => /\{\{/.test(text))) {
        throw new Error(
          `Balise {{…}} à un endroit où elle ne peut pas être remplie (${node.type}) : la mettre dans le texte courant.`,
        )
      }
    })

    for (const tag of missing) {
      console.warn(`[site-values] {{${tag}}} est vide : « [À COMPLÉTER : ${tag}] » affiché.`)
    }
  }
}
