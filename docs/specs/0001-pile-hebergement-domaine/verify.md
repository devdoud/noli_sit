# Verify: pile technique, hébergement et domaine · spec 0001 · updated 2026-10-13
_Steps derived from the scope « Done when » of feature 1 and from spec 0001 (decision spec, no IDed acceptance criteria). `/check verify` runs these; `/test` locks the durable ones._

## Commands
- [ ] `npm ci` puis `npm run build` → `astro check` donne 0 erreur, le build produit `dist/index.html` et `dist/404.html`, et `check-no-inline` affiche « aucun script ni style en ligne » → Done when (le projet se construit)
- [ ] Ajouter une page avec `<script>` ou `style=""` dans `dist/`, lancer `node scripts/check-no-inline.mjs` → code de sortie 1 et la page est nommée ; la retirer → code 0 → spec, « Règles pour garder la CSP valide »
- [ ] `npm run dev`, ouvrir `http://localhost:4321/` → la page Noli s'affiche en français (`<html lang="fr">`), le titre est à la couleur de l'app → Done when (s'affiche en local)
- [ ] En dev, ouvrir une adresse inconnue (`/abc`) → la page « Page introuvable » avec un lien vers l'accueil, code 404 → spec, page d'erreur
- [ ] `dist/index.html` ne contient que des liens vers `/_astro/*.css`, aucun `data:` ni CSS en ligne → spec, `inlineStylesheets: 'never'` et `assetsInlineLimit: 0`

## Fichiers
- [ ] `.gitignore` est en UTF-8 et liste `node_modules/`, `dist/`, `.astro/`, `.env` et `.env.*` → spec, versionnage
- [ ] Aucun secret ni `.env` suivi par git (`git ls-files` n'en montre aucun) → HANDOFF, aucun secret dans le dépôt
- [ ] `.nvmrc` à `22`, `engines.node` à `>=22.12.0`, `NODE_VERSION` du `render.yaml` en 22.12 ou plus → spec, runtime
- [ ] `astro.config.ts` contient `site: 'https://nollli.com'`, `output: 'static'`, `trailingSlash: 'never'`, `build.format: 'file'`, `devToolbar` désactivé, `prefetch: false`, aucun adaptateur → spec, configuration du projet
- [ ] `render.yaml` : aucune réécriture vers `index.html`, aucun `X-Robots-Tag: noindex`, CSP stricte, cache long seulement sur `/_astro/*` → spec, hébergement sur Render

## Au premier déploiement (feature 4, à reporter)
- [ ] `curl -I https://nollli.com/cgu` (ou toute page) → `200` sans `.html` ; sinon une réécriture par page dans `render.yaml`
- [ ] Une adresse inconnue → `404.html` avec le code 404
- [ ] `Strict-Transport-Security` présent une seule fois

## Acceptance-criteria coverage
- Done when « le projet vide se construit » : steps Commands 1, 2, 5
- Done when « s'affiche en local » : steps Commands 3, 4
- Done when « décision notée dans une spec » : spec 0001 existe et est validée
- Règles de la spec (CSP, config, fichiers) : steps Fichiers 1 à 5
