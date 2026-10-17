// Concordance des jetons (spec 0002, AC-1) : le tableau de design.md et le @theme de global.css
// contiennent les mêmes jetons avec exactement les mêmes valeurs.
import { readFile } from 'node:fs/promises'
import { beforeAll, describe, expect, it } from 'vitest'

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

let designTokens: Map<string, string>
let cssTokens: Map<string, string>

beforeAll(async () => {
  const design = await read('design.md')
  designTokens = new Map(
    [...design.matchAll(/^\| `(--[a-z-]+)` \| `([^`]+)` \|/gm)].map((m) => [m[1], m[2]]),
  )

  const css = await read('src/styles/global.css')
  const theme = /@theme\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
  cssTokens = new Map(
    [...theme.matchAll(/(--[a-z-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
  )
})

describe('design tokens', () => {
  it('finds tokens on both sides', () => {
    expect(designTokens.size).toBeGreaterThan(0)
    expect(cssTokens.size).toBeGreaterThan(0)
  })

  it('documents every @theme token in design.md with the same value', () => {
    for (const [token, value] of cssTokens) {
      expect(designTokens.get(token), token).toBe(value)
    }
  })

  it('has no design.md token missing from @theme', () => {
    for (const token of designTokens.keys()) {
      expect(cssTokens.has(token), token).toBe(true)
    }
  })
})
