# Noli Site

Site public de Noli sur `https://nollli.com` : vitrine et pages légales exigées par les stores. Tout en français. Pas d'API, pas de compte, pas de cookie.

## Stack

- **Language / Runtime**: TypeScript strict (`astro/tsconfigs/strict`), Node 22.12 ou plus (`.nvmrc`)
- **Framework**: Astro 7, sortie statique (`output: 'static'`, aucun adaptateur), zéro JavaScript envoyé au navigateur
- **Key dependencies**: Tailwind CSS 4 (`@tailwindcss/vite`), `@tailwindcss/typography` (avec les pages légales), Vitest
- **Package manager**: npm (`package-lock.json` commité)
- **Hosting**: Render Static Site (`render.yaml`), déploiement à chaque push sur `main`. Détails : spec [0001](docs/specs/0001-pile-hebergement-domaine/index.md)

## Build approach

Tracer Bullet (une vraie page en ligne sur `nollli.com` de bout en bout d'abord, puis chaque page s'ajoute sur ce chemin déjà prouvé).

## Commands

```bash
npm ci            # Install
npm run dev       # Dev server (http://localhost:4321)
npm run build     # astro check + astro build + contrôle CSP (scripts/check-no-inline.mjs)
npm test          # Vitest (environ 80 s : un test reconstruit le site)
npm run check     # Types seulement
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md` (ou `NNNN-title/index.md`). Scope : `docs/scope/scope.md`.

## Rules

- Style fonctionnel : composants et fonctions purs, données immuables (`as const`, `readonly`), pas d'état partagé, pas de classes.
- Structure Astro de la spec 0001 : `pages/`, `layouts/`, `components/`, `content/`, `config/`, `styles/`, `assets/`.
- Adresses publiques déclarées une seule fois dans `src/config/site.ts` (`routes`), jamais modifiées une fois promises.
- CSP stricte : aucun `<script>`, `is:inline`, `define:vars`, `set:html` avec du code, attribut `style=""` ni HTML brut dans le Markdown. Pas d'option `layout`/`fit` sur `<Image>`. Le build échoue sinon.
- Accessibilité WCAG AA : contrastes, clavier, focus visible, un seul `<h1>` par page, `alt` sur chaque image, `lang="fr"`.
- Nommage : fichiers de pages et adresses en français sans accent (`suppression-compte`), composants en PascalCase anglais, code en anglais, textes visibles en français.
- Exports nommés seulement dans les `.ts` (les composants `.astro` gardent leur export par défaut).
- Commits conventionnels (`feat:`, `fix:`, `docs:`, `test:`, `chore:`), sujet en français.
- Aucun secret dans le dépôt ; `.gitignore` en UTF-8.

## Tooling

À installer par `/develop tooling` : ESLint (`eslint-plugin-astro`, `eslint-plugin-jsx-a11y`) + Prettier (`prettier-plugin-astro`), scripts `lint` et `format`, Husky + lint-staged avant commit (ESLint + Prettier sur les fichiers modifiés, puis `astro check` ; les tests restent hors du commit). Pas de CI pour l'instant : Render refuse déjà un build cassé.

## Git

- integration: on
- branch prefix: feat/
- commit: per-milestone

## Agent skills

- [astro](.claude/skills/astro/): `astrolicious/agent-skills`, conventions Astro (pages, collections, images, CLI). Ignorer la partie adaptateurs : site statique.
- [tailwind-design-system](.claude/skills/tailwind-design-system/): `wshobson/agents`, Tailwind v4, jetons `@theme`, composants
- [vitest](.claude/skills/vitest/): `antfu/skills`, écriture et configuration des tests Vitest

Declined: skills ESLint, Prettier, Husky, Render (aucun skill fiable) · MCP servers: Astro Docs (recommended), Render (recommended, à la mise en ligne)

## Context files

<!-- Nested AGENTS.md files are listed here as they are created -->

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
