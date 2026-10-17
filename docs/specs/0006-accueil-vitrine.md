# 0006. Accueil vitrine

**Date**: 2026-10-17
**Status**: In Progress

## Summary

La page `https://nollli.com/` devient une vraie vitrine, dans une ambiance « cinéma » comme l'app : un grand bandeau avec halo prune et ambre et un téléphone dessiné en CSS, trois atouts, « comment ça marche » en trois étapes, Gratuit ou Premium (sans prix), des questions fréquentes, puis un rappel avec les boutons des stores. Aucune image à fournir, aucun JavaScript. Les textes sont rédigés depuis ce que l'app fait vraiment, et tu les relis. Décisions prises avec le porteur le 2026-10-17 (sections, visuels, ambiance, textes).

## Requirements

**Acceptance criteria**:
- **AC-1**: `src/pages/index.astro` keeps title `Noli`, a description, and renders, in order: a hero (`h1` accroche, sub title, `StoreButtons`, decorative phone), « Dans l’application » (3 screenshots, AC-11), « Pourquoi Noli » (3 atouts), « Comment ça marche » (3 numbered steps), « Gratuit ou Premium » (2 cards), « Questions fréquentes » (5 questions), a final call with `StoreButtons`; each section has an `h2`, the page one `h1`.
- **AC-2**: Every claim matches the code or the legal pages: free offer (series not premium in full, free episodes of premium series if any), premium (every episode, 30 days per payment, no automatic renewal, KkiaPay mobile money or card, price shown in the app before paying, payment not open yet), resume where you stopped, no advertising, app coming soon on Google Play and the App Store; no price, no release date, no catalogue title, no number of series.
- **AC-3**: The FAQ uses native `<details>`/`<summary>` (no JavaScript), keyboard operable, and links to `/cgu` only once that page exists, to `/confidentialite` and `/suppression-compte`.
- **AC-4** (révisé le 2026-10-17, captures réelles fournies par le porteur) : the decor (halos, grid, rings, phone frame) is pure CSS from tokens, `aria-hidden="true"`. The phone screen and the « Dans l’application » section show the three real app screenshots (`src/assets/captures/accueil.png`, `serie.png`, `explorer.png`) through Astro `<Image>`: WebP served from `/_astro/`, `srcset` 280 and 560 px, width and height set, no inline style, no request to another domain. In the hero phone (decorative) `alt` is empty; in the gallery each screenshot has a real `alt` that describes the screen without naming a catalogue title.
- **AC-11** (2026-10-17) : a « Dans l’application » section, between the marquee and « Pourquoi Noli », shows the three screenshots in phone frames with a caption (`h3` and a sentence each). From 768 px: three columns, sides lower. Below: a horizontal carousel with snap points, the scroll area reachable by keyboard (`role="region"`, `aria-label`, `tabindex="0"`), no sideways scroll of the page. The screenshots show demo content of the app; AC-2 applies to the page text, not to what the screenshots display.
- **AC-5**: Two tokens join `@theme` and the `design.md` table: `--color-plum: #1e1a2e` and `--color-violet: #6c5ce7` (app `NColors.plum` and `secondary`), used only on the home page.
- **AC-6**: At 320 px no sideways scroll; at 1280 px the hero shows text and phone side by side; text pairs meet WCAG AA; `prefers-reduced-motion` respected (no animation is required).

- **AC-7** (ajouté le 2026-10-17, demande du porteur) : the home page is animated with GSAP (core and ScrollTrigger): hero entrance (lines unblur and rise, then sub title and buttons, the phone rises and straightens in 3D), a living backdrop (perspective grid scrolling on the floor, breathing halos, drifting amber particles, floating phone tilting toward a fine pointer), scroll reveals of headings and cards, the phone cycling through the app screens, and the gallery fanning out then straightening with the scroll. Intensity: marked but elegant (0.6 to 1.2 s, nothing blinks).
- **AC-8**: The script is an external module served from `/_astro/` and loaded by the home page only (CSP `script-src 'self'` unchanged); the build check still refuses any script written in a page. Legal pages and the 404 stay without JavaScript.
- **AC-9**: Without JavaScript the page is complete and readable; with JavaScript, hero elements are hidden only under `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)` and reappear after 2.5 s if the script fails; with `prefers-reduced-motion: reduce` nothing moves and everything is visible at once.
- **AC-10**: No Content Security Policy violation and no console error with the `render.yaml` CSP applied (checked in Chrome).

## Animations

| Effet | Éléments | Détail |
|---|---|---|
| Entrée du bandeau | `[data-hero="line"]`, `[data-hero="fade"]`, `[data-hero="phone"]` | `fromTo` vers un état visible explicite (le CSS les masque avant le script) |
| Décor | `[data-motion="grid"]`, `"halo"`, `"particle"`, `"float"` | boucles infinies `sine.inOut` |
| Inclinaison | `[data-motion="tilt"]` | `quickTo` sur `rotationX` et `rotationY` (noms canoniques de GSAP), pointeur précis seulement |
| Révélations | `[data-reveal]` | `ScrollTrigger.batch`, une seule fois, à 88 % de la hauteur |
| Écrans du téléphone | `[data-motion="screen"]` | toutes les 4 s, l'écran suivant se dévoile de haut en bas (`clipPath`), en boucle ; sans script ou en mouvement réduit, seul l'accueil est visible |
| Éventail | `[data-shot]` (`data-angle`) | à partir de 768 px : les captures arrivent inclinées (`rotationY` de ±24°, `rotationX` 18°), floues et sombres, puis se redressent avec le défilement (`scrub`) |

**Version futuriste (2026-10-17, demande du porteur)** : accroche qui se décode (ScrambleText) puis reflet qui la balaie ; projecteur qui suit le curseur ; anneaux orbitaux en 3D autour du téléphone ; capsules en verre (« Reprise · épisode 3 », « Mobile money », « Sans publicité », « Nouvel épisode ») qui bougent selon leur profondeur ; ligne de balayage et reflet sur l'écran ; horizon lumineux et grille plus visible ; bande de mots en lettres contour qui accélère avec le défilement ; titres découpés en lettres (SplitText, `aria` conservé) ; compteurs 01 02 03 ; cartes inclinées en 3D avec lueur sous le curseur ; bordure conique tournante de la carte Premium ; boutons stores magnétiques. Les effets de souris ne s'activent qu'avec un pointeur précis.

Coût : environ 52 Ko compressés de JavaScript (GSAP, ScrollTrigger, SplitText, ScrambleText), sur l'accueil seulement. Code : `src/scripts/home-motion.ts`.

Ce choix revient, pour l'accueil seulement, sur la règle « zéro JavaScript » des specs 0001 et 0002.

## Design

| Section | Contenu |
|---|---|
| Bandeau | accroche en Bricolage 40 à 64 px, sous titre, boutons stores ; à droite (dessous sur mobile) un cadre de téléphone en CSS qui fait défiler les trois captures de l'app ; halo radial prune et ambre en fond |
| Dans l’application | L’accueil · La fiche d’une série · Explorer : chaque capture dans un cadre de téléphone, numéro 01 à 03, titre et une phrase |
| Pourquoi Noli | Commencez gratuitement · Reprenez où vous en étiez · Sans engagement (30 jours, mobile money ou carte, pas de renouvellement automatique) |
| Comment ça marche | 1. Téléchargez l'app (bientôt sur Google Play et l'App Store) · 2. Créez votre compte (email, nom d'utilisateur, mot de passe) · 3. Regardez |
| Gratuit ou Premium | deux cartes ; Premium mise en avant (bordure ambre) ; « Prix affiché dans l'application » |
| Questions fréquentes | Quand sort l'application ? · Combien coûte le premium ? · Comment payer ? · Y a-t-il de la publicité ? · Comment supprimer mon compte ? |
| Rappel final | « Noli arrive bientôt sur votre téléphone » et les boutons stores |

Copy: written by Claude from the facts of specs 0003 to 0005, reviewed by the porteur before the stores. Store links stay in `storeLinks` (one place).

## Build plan

1. Tokens `plum` and `violet` in `global.css` and `design.md` (AC-5)
2. Rewrite `index.astro` with the six sections and the CSS visuals (AC-1, AC-4, AC-6)
3. Copy from the facts (AC-2, AC-3)
4. Tests: sections and headings, absences (price with currency, dates), FAQ `details`, no inline style, tokens concordance (AC-1 to AC-5); browser check at 320 and 1280 px (AC-6)

## Follow-up

- [x] Replace the CSS phone with real app screenshots when available (`src/assets/`, `<Image>`). Done 2026-10-17 (AC-4, AC-11).
- [ ] Before the stores: replace the screenshots with ones showing the real catalogue (today: demo posters and stock photos).
- [ ] Add the `/cgu` link to the FAQ when feature 6 ships.
