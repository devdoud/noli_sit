# Noli Site

Site public de Noli sur `https://nollli.com` : vitrine et pages légales exigées par les stores. Tout en français. Pas d'API, pas de compte, pas de cookie.

## Stack

- **Language / Runtime**: TypeScript strict (`astro/tsconfigs/strict`), Node 22.12 ou plus (`.nvmrc`)
- **Framework**: Astro 7, sortie statique (`output: 'static'`, aucun adaptateur), zéro JavaScript envoyé au navigateur
- **Key dependencies**: Tailwind CSS 4 (`@tailwindcss/vite`), `@tailwindcss/typography`, polices `@fontsource-variable/bricolage-grotesque` et `@fontsource-variable/plus-jakarta-sans`, `@astrojs/markdown-remark` (moteur Markdown unified, nécessaire aux plugins remark : Astro 7 utilise Sätteri par défaut), Vitest
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
npm run lint      # ESLint (lint:fix pour corriger)
npm run format    # Prettier (format:check pour vérifier sans écrire)
node scripts/make-icons.mjs  # Régénère les favicons de public/ depuis src/assets/noli-logo.png
RENDER=true npm run build    # Simule le build Render : échoue si une valeur {{…}} de site.ts est vide
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md` (ou `NNNN-title/index.md`). Scope : `docs/scope/scope.md`.

## Rules

- Style fonctionnel : composants et fonctions purs, données immuables (`as const`, `readonly`), pas d'état partagé, pas de classes.
- Structure Astro de la spec 0001 : `pages/`, `layouts/`, `components/`, `content/`, `config/`, `styles/`, `assets/`.
- Adresses publiques déclarées une seule fois dans `src/config/site.ts` (`routes`), jamais modifiées une fois promises.
- CSP stricte : aucun `<script>`, `is:inline`, `define:vars`, `set:html` avec du code, attribut `style=""` ni HTML brut dans le Markdown. Pas d'option `layout`/`fit` sur `<Image>`. Chaque page charge une feuille `/_astro/*.css`. Le build échoue sinon.
- Design system : toute interface suit `design.md` (direction, gabarit, composants, accessibilité). Les jetons vivent dans `src/styles/global.css` et sont recopiés à l'identique dans le tableau de `design.md` (un test vérifie la concordance). Toute page passe par `BaseLayout` ou `LegalLayout`.
- Une page n'entre dans `footerLinks` (`src/config/site.ts`) qu'une fois construite : chaque feature de page y ajoute sa ligne.
- Textes légaux : un fichier `src/content/legal/<adresse>.md` (rendu par `src/pages/[slug].astro`). Les valeurs d'identité passent par les balises `{{editeur.*}}` et `{{hebergement.region}}` (`src/config/site-values.ts`), seulement dans le texte courant. `publisher` et `dataHosting` de `site.ts` doivent être remplis avant de fusionner dans `main` : sinon Render refuse tout déploiement.
- La politique de confidentialité décrit ce que le code fait vraiment (inventaire de la spec 0003) : toute nouvelle collecte de données ou tout nouveau prestataire dans l'app ou le backend impose de mettre à jour `confidentialite.md` et son `updatedAt`.
- Accessibilité WCAG AA : contrastes, clavier, focus visible, un seul `<h1>` par page, `alt` sur chaque image, `lang="fr"`.
- Nommage : fichiers de pages et adresses en français sans accent (`suppression-compte`), composants en PascalCase anglais, code en anglais, textes visibles en français.
- Exports nommés seulement dans les `.ts` (les composants `.astro` gardent leur export par défaut).
- Commits conventionnels (`feat:`, `fix:`, `docs:`, `test:`, `chore:`), sujet en français.
- Aucun secret dans le dépôt ; `.gitignore` en UTF-8.

## Tooling

Installé : ESLint 9 (`eslint.config.js` : TypeScript strict typé sur les `.ts`, `eslint-plugin-astro` + règles `jsx-a11y` sur les `.astro` ; ESLint 10 attend le support de `eslint-plugin-jsx-a11y`) + Prettier (`.prettierrc.json`, sans point virgule, guillemets simples, 100 colonnes, `prettier-plugin-astro` ; `docs/` et `*.md` ignorés), Husky + lint-staged avant commit (ESLint + Prettier sur les fichiers modifiés, puis `astro check` ; les tests restent hors du commit). `.gitattributes` force LF partout. Pas de CI pour l'instant : Render refuse déjà un build cassé.

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
