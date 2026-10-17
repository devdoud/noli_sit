# Design system du site Noli

source: extracted-from-code (design system v2 de l'app, `noli_app/lib/core/theme/app_theme.dart`, spec 0005 de l'app) · décision : spec [0002](docs/specs/0002-charte-gabarit-commun/index.md)

## Character

Le site est le prolongement de l'app : sombre, chaleureux, sobre. Fond obsidienne, ambre safran pour tout ce qui se clique, titres en Bricolage Grotesque, texte en Plus Jakarta Sans. Le site sert surtout à rassurer (pages légales, contact) : il reste calme et lisible. L'ambre est rare et donc parlant. Pas de violet, pas de dégradé, pas d'effet de verre dans le gabarit. L'accueil (spec 0006) a une ambiance « cinéma » : halo prune et violet derrière le bandeau, téléphone et affiches dessinés en CSS.

## Build mandate

- Chaque page passe par `BaseLayout` (ou `LegalLayout` pour un texte légal) : lien d'évitement, haut de page, `main#contenu`, pied de page. Aucune page ne refait son propre `head`.
- Aucune couleur, police ni taille de texte en dur dans un composant : jetons ci dessous ou échelle de Tailwind.
- Aucun JavaScript, aucun attribut `style=""`, aucune ressource externe (spec 0001). Le build échoue sinon.
- Un seul `<h1>` par page. Les tailles de `h1` viennent des styles de base, pas des pages.
- Une page n'apparaît dans `footerLinks` (`src/config/site.ts`) qu'une fois construite.

## Tokens

Les valeurs vivent dans `src/styles/global.css` (`@theme`). Ce tableau reprend exactement les mêmes chaînes ; un test vérifie la concordance dans les deux sens.

| Jeton | Valeur | Usage |
|---|---|---|
| `--color-canvas` | `#0b0c10` | fond de page |
| `--color-surface` | `#13141b` | haut et pied de page |
| `--color-surface-high` | `#1c1d26` | boutons stores |
| `--color-border` | `rgb(255 255 255 / 0.06)` | séparateurs |
| `--color-border-mid` | `rgb(255 255 255 / 0.08)` | contour des boutons, filets des textes longs |
| `--color-brand` | `#f5a623` | liens, actions, anneau de focus |
| `--color-brand-bright` | `#ffb830` | survol des liens et boutons |
| `--color-text` | `#f8f9fa` | titres et texte courant |
| `--color-text-meta` | `#a0a3bd` | texte secondaire, date, copyright |
| `--color-plum` | `#1e1a2e` | accueil seulement : halo et surfaces atmosphériques (`NColors.plum`) |
| `--color-violet` | `#6c5ce7` | accueil seulement : halo, accents décoratifs, jamais du texte (`NColors.secondary`) |
| `--font-display` | `'Bricolage Grotesque Variable', system-ui, sans-serif` | titres, mot « Noli » |
| `--font-sans` | `'Plus Jakarta Sans Variable', system-ui, sans-serif` | tout le reste |

Polices servies par le site via `@fontsource-variable/*` (woff2 dans `/_astro/`), jamais depuis un service externe. Espacements : échelle par défaut de Tailwind (pas de 4 px, comme la grille de l'app). Rayons : `rounded-full` pour les boutons, rien d'autre dans le gabarit.

## Typography

| Rôle | Police | Taille / interligne |
|---|---|---|
| `h1` | display 700, `-0.02em` | 32/38 px, 40/48 px à partir de `md` (styles de base) |
| `h2` | display 700, `-0.02em` | 24/32 px |
| `h3` | display 700, `-0.02em` | 20/28 px |
| texte courant | sans 400 | 16/26 px |
| texte secondaire | sans 400 | 14/20 px, `--color-text-meta` |
| mot « Noli » du haut de page | display 700 | 20 px |

## Layout

- Conteneur : `mx-auto w-full max-w-5xl px-5` (marge de 20 px, comme `NSpacing.screen`) pour le haut de page, le pied de page et toutes les pages.
- Contenu : `py-10 md:py-16`. Textes longs : colonne de 70 caractères au plus.
- `body` en colonne sur toute la hauteur : le pied de page reste en bas sur une page courte.
- Pied de page : empilé sur mobile, deux colonnes à partir de `md` (liens et support à gauche, stores à droite), copyright en dernier.

## Components

| Composant | Rôle | États |
|---|---|---|
| `BaseLayout` | `head` complet (titre par `pageTitle`, description, canonical par `canonicalPath` sauf 404, `color-scheme`, `theme-color`, favicons), lien d'évitement, haut de page, `main`, pied de page | lien d'évitement caché, visible au focus |
| `LegalLayout` | `h1`, « Mis à jour le … » (`formatLegalDate`, UTC), texte en `prose prose-noli` | — |
| `SiteHeader` | le mot « Noli » seul (point ambre décoratif), un seul lien vers `/` | survol, focus |
| `SiteFooter` | trois colonnes : marque (« Noli », phrase, boutons stores), « Informations légales » (nav seulement si `footerLinks` n'est pas vide), « Aide » (questions fréquentes, mailto support) ; barre du bas : `© <année> Noli` et « Édité par » l'éditeur ; ligne lumineuse en haut, grand « Noli » en contour en bas (décoratifs) | liens soulignés, survol `--color-brand-bright` |
| `StoreButtons` | liste de deux items, Google Play puis App Store | logo Google Play en quatre couleurs ou logo Apple en blanc (couleurs des marques, seule exception aux jetons ; décoratifs, `aria-hidden`) ; bientôt disponible : élément simple, sans lien ni état ARIA, nom du store + « Bientôt disponible » ; disponible : lien ambre « Télécharger sur … » ; magnétiques sur l'accueil |

## Accessibility

- Focus : `outline 2px` `--color-brand`, décalage 2 px, sur `:focus-visible`.
- Liens soulignés dans les textes et le pied de page : l'ambre ne diffère du texte courant que de 1,9:1.
- Contrastes (texte sur fond) : `#f8f9fa` sur `#0b0c10` 18,5:1 ; `#a0a3bd` sur `#0b0c10` 7,9:1, sur `#13141b` 7,4:1, sur `#1c1d26` 6,8:1 ; `#f5a623` sur `#0b0c10` 9,6:1, sur `#13141b` 9,1:1 ; `#0b0c10` sur `#f5a623` 9,6:1.
- Zones cliquables d'au moins 44 px de haut (`min-h-11`) dans le haut et le pied de page.
- `prefers-reduced-motion` : transitions coupées.
- `lang="fr"`, images décoratives en `alt=""`.

## Do's and Don'ts

- Do : réutiliser les composants et les jetons ; ajouter un jeton dans `@theme` et dans ce tableau en même temps.
- Don't : `aria-disabled` sur un élément non interactif ; badges officiels des stores modifiés ; texte en `#62657a` (trop faible) ; couleur seule pour signaler un lien.
