# 0002. Charte visuelle et gabarit commun du site

**Date**: 2026-10-17
**Status**: Proposed

## Summary

Le site reprend le design system v2 de l'app : fond sombre obsidienne, ambre safran pour les liens et les actions, Bricolage Grotesque pour les titres et Plus Jakarta Sans pour le texte, servies par le site lui même. Toutes les pages partagent un même gabarit : un lien d'évitement, un haut de page sobre (logo et mot « Noli »), un pied de page avec les liens légaux, l'adresse support, les boutons des stores et le copyright. Les textes légaux s'affichent dans une colonne étroite et lisible, avec leur date de mise à jour. Pour construire, on pose d'abord les jetons, les polices et le gabarit sur les deux pages existantes, puis on ajoute les boutons stores, le gabarit légal, `design.md` et les tests.

## Requirements

**User stories**:
- As a visitor on a phone, I want every Noli page to look like the app and read easily so that I trust the site and find the legal information I need.
- As a store reviewer, I want every page to link to the legal pages that exist so that I can check them quickly, without hitting a missing page.
- As the team, I want one shared template and one set of tokens so that each new page only adds its content.

**Acceptance criteria**:
- **AC-1**: `design.md` exists at the project root and covers colors, typography, spacing, layout, the components below with their states, and the accessibility rules. Its token table lists each token as `` | `--token` | `value` | `` with exactly the string used in `src/styles/global.css` (`@theme`), and every `@theme` token appears in that table.
- **AC-2**: Every page has `<html lang="fr">`, `<meta name="color-scheme" content="dark">`, `<meta name="theme-color" content="#0B0C10">`, the two favicon links, a `<title>` of the form `<Page> · Noli` (home: `Noli`) and a non empty `<meta name="description">`. Every page except the 404 has `<link rel="canonical">` to `https://nollli.com<path>` with no `.html` and no trailing slash (home: `https://nollli.com/`); the 404 page has none.
- **AC-3**: The first link in `<body>` is a « Aller au contenu » skip link to `#contenu`, hidden until focused and visible when focused; `<main id="contenu" tabindex="-1">` receives the focus.
- **AC-4**: The header shows the app icon and the word « Noli » in a single link to `/`; the icon has `alt=""`, so the link's accessible name is « Noli ».
- **AC-5**: The footer contains a `mailto:` link to `support@nollli.com`, the store buttons, and `© <year> Noli` where the year is the build year. It contains `<nav aria-label="Liens légaux">` if and only if `footerLinks` is not empty, with one link per entry and no other; every `footerLinks` address matches a page that is actually built.
- **AC-6**: The store buttons are a `<ul>` of two items, Google Play then App Store. For a store whose link is `null` in `storeLinks`, the item shows « Google Play » (or « App Store ») and « Bientôt disponible » with no link, no `href`, no `tabindex` and no ARIA state. For a store with a link, the item is an `<a href>` to that link reading « Télécharger sur Google Play » (or « sur l'App Store »).
- **AC-7**: `LegalLayout` renders the page name as the only `<h1>`, the line « Mis à jour le <date> » where the date comes from `formatLegalDate()` (`17 octobre 2026`, the same whatever the build machine's time zone), and the body in one `.prose-noli` column of at most 70 characters, at 16 px.
- **AC-8**: Fonts are woff2 files under `/_astro/`. In the built HTML and CSS, the only absolute URLs are `https://nollli.com…` and `mailto:` links; no `data:` resource, no script, no inline style (the build's CSP check passes).
- **AC-9**: At 320 px wide no page scrolls sideways; header, footer and prose stay readable at 375 px and 1280 px; the footer sits at the bottom of the screen on a short page.
- **AC-10**: Every link and button shows a visible 2 px amber focus ring; links in prose and in the footer are underlined (not told apart by color alone); every text and background pair of the template meets WCAG AA (4.5:1); interactive elements of the header and footer are at least 44 px tall.
- **AC-11**: The home page and the 404 page use the template (skip link, header, main, footer).

## Decision

**Chosen option**: Option 1 : jetons de l'app dans `@theme`, gabarit Astro en composants, polices Fontsource

Le site traduit les jetons de `noli_app/lib/core/theme/app_theme.dart` en variables Tailwind 4, sert les deux polices de l'app via Fontsource, et partage un gabarit Astro (`BaseLayout`, `SiteHeader`, `SiteFooter`, `StoreButtons`, `LegalLayout`) documenté dans `design.md`.

**Implementation skills**: `tailwind-design-system` (`wshobson/agents`, `.claude/skills/tailwind-design-system/`) · `astro` (`astrolicious/agent-skills`, `.claude/skills/astro/`)

## Rationale

Le raisonnement et les options comparées sont dans [rationale.md](rationale.md).

## Feature design

**Data model sketch**: aucune donnée stockée. Seulement des constantes et des fonctions pures dans `src/config/site.ts` :
- `site` : `name` (`'Noli'`), `supportEmail`, et un nouveau `themeColor` (`'#0B0C10'`).
- `routes` : inchangé (spec 0001). Nouveau type `Route = (typeof routes)[keyof typeof routes]`.
- `storeLinks` : inchangé, `string | null` par store.
- `footerLinks` (nouveau) : `readonly { label: string; href: Route }[]`, dans l'ordre d'affichage. Il ne contient **que les pages déjà construites** : il part vide, et chaque feature de page (4 à 9) ajoute sa ligne quand elle est livrée. Libellés prévus : « Confidentialité », « Conditions d'utilisation », « Suppression de compte », « Mentions légales », « Contact et aide ».
- `pageTitle(name?: string): string` : `name ? \`${name} · Noli\` : 'Noli'`.
- `canonicalPath(pathname: string): string` : `'/'` et `'/index.html'` donnent `'/'` ; sinon on retire un `.html` final puis une barre finale (`'/cgu.html'`, `'/cgu/'` et `'/cgu'` donnent `'/cgu'`).
- `formatLegalDate(date: Date): string` : `new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(date)`.

**State transitions**: aucune machine d'état. Le seul état visible est celui d'un bouton de store (`bientôt disponible` si son lien est `null`, `disponible` sinon), fixé au build.

**API surface** (composants, pas d'API HTTP) :
| Composant | Props | Rendu | Erreurs |
|---|---|---|---|
| `BaseLayout.astro` | `title?: string` (nom de la page, absent pour l'accueil), `description: string`, `canonical?: boolean` (défaut `true`, `false` pour la 404) | `<html lang="fr">`, `<head>` (AC-2, titre par `pageTitle(title)`, canonical par `new URL(canonicalPath(Astro.url.pathname), Astro.site)`), puis dans `<body>` : lien d'évitement, `SiteHeader`, `<main id="contenu" tabindex="-1">` avec le slot, `SiteFooter` | `description` absente : erreur de type à `astro check` ; vide : le test du build échoue |
| `SiteHeader.astro` | aucune | lien vers `/` : icône 32 px + « Noli » | — |
| `SiteFooter.astro` | aucune | nav des `footerLinks` (si non vide), mailto support, `StoreButtons`, copyright | — |
| `StoreButtons.astro` | aucune (lit `storeLinks`) | `<ul>` de deux items (AC-6) | — |
| `LegalLayout.astro` | `title: string`, `description: string`, `updatedAt: Date` | `BaseLayout` + `<article>` : `<h1>`, ligne de mise à jour, `<div class="prose-noli">` avec le slot | — |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| `<title>` | `Conditions d'utilisation · Noli` ou `Noli` | `pageTitle(title)`, `title` passé par chaque page ; 404 : `'Page introuvable'` |
| meta description | texte de la page | prop `description` : pages légales, frontmatter (spec 0001) ; accueil : texte actuel de `index.astro` ; 404 : « Cette page n'existe pas. » |
| canonical | `https://nollli.com/cgu` | `canonicalPath(Astro.url.pathname)` + `Astro.site` ; absent si `canonical={false}` |
| theme-color | `#0B0C10` | `site.themeColor` (= `NColors.canvas` de l'app) |
| année du copyright | `2026` | `new Date().getFullYear()` au build (le test compare avec la même expression) |
| liens du pied de page | libellés et adresses | `footerLinks` |
| adresse support | `support@nollli.com` | `site.supportEmail` |
| état et texte des boutons stores | « Bientôt disponible » ou lien | `storeLinks` ; libellés fixés dans `StoreButtons` (AC-6) |
| date de mise à jour | `17 octobre 2026` | prop `updatedAt` (frontmatter, spec 0001), via `formatLegalDate()` |
| icône du haut de page | image 32 px | `src/assets/noli-logo.png` (copie de `noli_app/assets/images/noli_logo.png`), `<Image width={64} height={64} class="size-8" loading="eager" alt="">` |
| favicons | 32 et 180 px | `public/favicon-32.png` et `public/apple-touch-icon.png`, générés une fois depuis le même PNG par `scripts/make-icons.mjs` (commité, lancé à la main, utilise `sharp` déjà installé avec Astro) |

**Jetons** (`@theme` dans `src/styles/global.css`, valeurs de l'app, hex en minuscules ; `design.md` reprend exactement ces chaînes) :
| Jeton | Valeur | Usage |
|---|---|---|
| `--color-canvas` | `#0b0c10` | fond de page |
| `--color-surface` | `#13141b` | haut et pied de page |
| `--color-surface-high` | `#1c1d26` | boutons stores |
| `--color-border` | `rgb(255 255 255 / 0.06)` | séparateurs |
| `--color-border-mid` | `rgb(255 255 255 / 0.08)` | contour des boutons |
| `--color-brand` | `#f5a623` | liens, actions, anneau de focus |
| `--color-brand-bright` | `#ffb830` | survol des liens et boutons |
| `--color-text` | `#f8f9fa` | titres et texte courant |
| `--color-text-meta` | `#a0a3bd` | texte secondaire, date, copyright |
| `--font-display` | `'Bricolage Grotesque Variable', system-ui, sans-serif` | titres, mot « Noli » |
| `--font-sans` | `'Plus Jakarta Sans Variable', system-ui, sans-serif` | tout le reste |

Pas de jeton de rayon : le gabarit n'utilise que `rounded-full` (boutons, `NRadius.pill`) et `rounded-lg` de Tailwind pour l'icône. Le violet `secondary`, `textDisabled` et les dégradés de l'app ne sont pas repris (ambiance sobre) ; l'accueil (feature 8) pourra les ajouter avec sa propre spec.

**Polices** : `@import '@fontsource-variable/bricolage-grotesque';` et `@import '@fontsource-variable/plus-jakarta-sans';` en tête de `global.css`. Vérifier dans `dist/` que les `.woff2` sortent dans `/_astro/` ; sinon, importer ces deux CSS dans le frontmatter de `BaseLayout`. Tous les sous ensembles d'alphabet sont copiés, mais seul le latin est téléchargé pour du français. Pas de préchargement (`font-display: swap` par défaut).

**Styles de base** (`@layer base` dans `global.css`) :
- `html` : fond `--color-canvas`, `color-scheme: dark`.
- `body` : `min-h-dvh flex flex-col`, police `--font-sans` 16/26 px, couleur `--color-text`, fond `--color-canvas`.
- `main` : `flex-1`, `focus:outline-none` (cible du lien d'évitement seulement).
- `:focus-visible` : `outline: 2px solid var(--color-brand); outline-offset: 2px`.
- `@media (prefers-reduced-motion: reduce)` : transitions coupées.

**Mise en page** :
- Conteneur du haut, du contenu et du pied de page : `mx-auto w-full max-w-3xl px-5`.
- Haut de page : fond `--color-surface`, bordure basse `--color-border`, `min-h-14`, lien logo en `inline-flex min-h-11 items-center gap-3`, « Noli » en `--font-display` 700 20 px.
- Contenu : `py-10 md:py-16`.
- Pied de page : fond `--color-surface`, bordure haute `--color-border`, `py-10`, texte 14/20 px en `--color-text-meta` ; blocs empilés sur mobile, deux colonnes à partir de `md` (liens légaux et support à gauche, boutons stores à droite), copyright en dernier sur toute la largeur. Liens en `inline-flex min-h-11 items-center underline underline-offset-4`, couleur `--color-text`, survol `--color-brand-bright`.
- Lien d'évitement : `sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 rounded-full bg-brand px-4 py-3 text-canvas font-semibold`.

**Typographie** : titres en `--font-display`, 700, `tracking-[-0.02em]` ; `h1` 32/38 px, 40/48 px à partir de `md` ; `h2` 24/32 px ; `h3` 20/28 px ; texte courant 16/26 px (l'app est en 15, le web lit mieux en 16) ; texte secondaire 14/20 px.

**Boutons stores** : `<ul class="flex flex-wrap gap-3">`. Item bientôt disponible : `<li>` en `inline-flex min-h-11 flex-col justify-center rounded-full border border-border-mid bg-surface-high px-5`, nom du store en `--color-text` 600 14 px, « Bientôt disponible » en `--color-text-meta` 12 px. Item disponible : même forme en `<a>`, fond `--color-brand`, texte `--color-canvas`, survol `--color-brand-bright`.

**Textes longs** : `@tailwindcss/typography` via `@plugin '@tailwindcss/typography';`. Une classe `.prose-noli` hors couche dans `global.css` applique `prose` (via `@apply prose max-w-[70ch]`) et fixe toutes les variables : `--tw-prose-body` et `--tw-prose-bold` `--color-text` ; `--tw-prose-headings` `--color-text` ; `--tw-prose-lead`, `--tw-prose-counters`, `--tw-prose-bullets`, `--tw-prose-captions` `--color-text-meta` ; `--tw-prose-links` `--color-brand` ; `--tw-prose-hr`, `--tw-prose-quote-borders`, `--tw-prose-th-borders`, `--tw-prose-td-borders` `--color-border-mid` ; `--tw-prose-quotes` `--color-text` ; `--tw-prose-code`, `--tw-prose-kbd`, `--tw-prose-pre-code` `--color-text` ; `--tw-prose-pre-bg` `--color-surface`. Titres en `--font-display` aux tailles ci dessus ; liens soulignés. Pas de `prose-invert`.

**Key invariants**:
- Aucune couleur ni police en dur dans un composant : tout passe par les jetons.
- Le tableau de jetons de `design.md` et le `@theme` de `global.css` contiennent les mêmes jetons avec les mêmes chaînes.
- Un seul `<h1>` par page ; `BaseLayout` n'en pose jamais.
- `footerLinks` ne liste jamais une page non construite.
- Aucun JavaScript, aucun style en ligne, aucune ressource externe (spec 0001).

**Security model**: site public, sans donnée de visiteur. Aucune requête vers un tiers (polices et images servies par le site), ce qui garde la politique de confidentialité simple. L'adresse support n'est pas masquée (choix d'accessibilité, spec 0001).

**Configuration required**: aucune variable d'environnement. Paquets à ajouter : `@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/plus-jakarta-sans`, `@tailwindcss/typography`.

**Contrastes vérifiés** (texte sur fond, WCAG AA 4.5:1) : `#f8f9fa` sur `#0b0c10` 18,5:1 ; `#a0a3bd` sur `#0b0c10` 7,9:1, sur `#13141b` 7,4:1, sur `#1c1d26` 6,8:1 ; `#f5a623` sur `#0b0c10` 9,6:1, sur `#13141b` 9,1:1 ; `#0b0c10` sur `#f5a623` 9,6:1. L'ambre et le texte courant ne diffèrent que de 1,9:1, d'où le soulignement obligatoire des liens (AC-10).

**Critical test scenarios**:
- Happy path : le build produit `index.html` et `404.html` avec le `head` complet, le lien d'évitement en premier lien du `body`, `main#contenu`, haut et pied de page ; canonical `https://nollli.com/` pour l'accueil, aucun pour la 404, verifies **AC-2**, **AC-3**, **AC-4**, **AC-11**
- Fonctions pures : `pageTitle()`, `canonicalPath()` (`/`, `/index.html`, `/cgu.html`, `/cgu/`, `/cgu`) et `formatLegalDate(new Date('2026-10-17'))` lancé avec `TZ=Pacific/Auckland` et `TZ=America/Los_Angeles`, verifies **AC-2**, **AC-7**
- Boutons stores : avec `storeLinks` à `null`, deux `<li>` sans `href`, sans `tabindex`, sans `aria-disabled`, avec « Bientôt disponible », verifies **AC-6**
- Pied de page : `footerLinks` vide, pas de `<nav>` ; chaque entrée de `footerLinks` a son fichier `dist/<adresse>.html` ; mailto présent ; copyright avec l'année du build, verifies **AC-5**
- Ressources : `.woff2` dans `dist/_astro/`, et dans tout le HTML et le CSS construits, chaque URL absolue commence par `https://nollli.com` ou `mailto:` ; aucun `data:`, verifies **AC-8**
- Jetons : chaque ligne du tableau de `design.md` se retrouve à l'identique dans `@theme`, et inversement, verifies **AC-1**
- Affichage et clavier : à 320 px aucune page ne défile en largeur ; Tab montre d'abord le lien d'évitement puis le logo, avec l'anneau ambre (contrôlé par `/check verify` dans un navigateur), verifies **AC-9**, **AC-10**

## Build plan

Ordre Tracer Bullet : d'abord un fil complet et visible (jetons, polices, `head`, haut et pied de page sur les deux pages existantes), puis on l'épaissit (boutons stores, gabarit légal, documentation, tests).

1. Ajouter `@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/plus-jakarta-sans` et `@tailwindcss/typography` ; écrire dans `global.css` les imports de polices, le `@plugin`, les jetons `@theme`, les styles de base, le focus et le mouvement réduit ; vérifier que les `.woff2` sortent dans `dist/_astro/`, satisfies **AC-8**, **AC-10**
2. Étendre `site.ts` : `themeColor`, type `Route`, `footerLinks` vide, `pageTitle()`, `canonicalPath()`, `formatLegalDate()`, satisfies **AC-2**, **AC-5**, **AC-7**
3. Copier le logo dans `src/assets/noli-logo.png` ; écrire `scripts/make-icons.mjs` et générer `public/favicon-32.png` et `public/apple-touch-icon.png`, satisfies **AC-2**
4. Compléter `BaseLayout` (props `title?`, `description`, `canonical?` ; `head` complet ; lien d'évitement ; `main#contenu`), et passer `index.astro` et `404.astro` aux nouvelles props, satisfies **AC-2**, **AC-3**, **AC-11**
5. Créer `SiteHeader` et `SiteFooter` (nav conditionnelle, mailto, copyright, mise en page) et les brancher dans `BaseLayout`, satisfies **AC-4**, **AC-5**, **AC-9**, **AC-10**, **AC-11**
6. Créer `StoreButtons` (deux états) et le placer dans le pied de page, satisfies **AC-6**
7. Créer `LegalLayout` et la classe `.prose-noli`, satisfies **AC-7**
8. Écrire `design.md` à la racine depuis cette spec (jetons au format de AC-1, typographie, mise en page, composants et états, accessibilité, ce qui est exclu volontairement), satisfies **AC-1**
9. Étendre les tests : fonctions pures de `site.ts` (dont les deux fuseaux), résultat du build (head, canonical, lien d'évitement, haut et pied de page, boutons stores, `footerLinks` et fichiers, polices, URL absolues), concordance `design.md` et `@theme`, satisfies **AC-1** à **AC-8**, **AC-11**

## Consequences

**Positive**:
- Le site et l'app se ressemblent : mêmes couleurs, mêmes polices, même logo.
- Chaque page suivante n'apporte que son contenu ; le gabarit, le `head` et l'accessibilité sont déjà là.
- Aucune requête vers un tiers : rien à déclarer de plus dans la politique de confidentialité.
- Le pied de page ne mène jamais vers une page absente, même pendant la construction page par page.
- Les calculs délicats (titre, adresse canonique, date) sont des fonctions pures testées, qui ne dépendent pas du détail interne d'Astro.

**Negative / tradeoffs**:
- Deux polices variables ajoutent environ 60 à 100 Ko au premier chargement (mis en cache ensuite) : c'est le prix de l'identité de l'app sur une connexion mobile lente.
- Un thème sombre seul : un visiteur qui préfère le clair n'a pas de choix.
- Les jetons sont recopiés à la main depuis l'app : si l'app change sa palette, il faut mettre à jour `global.css` et `design.md` ici aussi.
- Les boutons stores maison sont moins reconnaissables que les badges officiels jusqu'à la publication de l'app.
- Chaque feature de page doit penser à ajouter sa ligne dans `footerLinks` (le test le rappelle si une ligne pointe vers une page absente, pas si elle manque).

**Neutral**:
- La spec 0001 prévoyait `<span aria-disabled="true">` pour les boutons stores ; cette spec le remplace par un simple élément sans état ARIA (un `aria-disabled` sur un élément non interactif n'est pas valide). Cette spec fait foi sur ce point.

## Follow-up

- [ ] Chaque feature de page (4 à 9) ajoute sa ligne dans `footerLinks` quand elle est livrée.
- [ ] À la publication de l'app : remplacer les boutons maison par les badges officiels Google Play et App Store, en respectant leurs règles (feature « Vrais liens des stores », différée).
- [ ] Si l'app change sa palette ou ses polices (spec 0005 de l'app), reporter le changement dans `global.css` et `design.md`.
- [ ] `/sync` ajoutera un pointeur vers `design.md` dans `AGENTS.md`.
