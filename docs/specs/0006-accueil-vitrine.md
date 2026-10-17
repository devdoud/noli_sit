# 0006. Accueil vitrine

**Date**: 2026-10-17
**Status**: Proposed

## Summary

La page `https://nollli.com/` devient une vraie vitrine, dans une ambiance « cinéma » comme l'app : un grand bandeau avec halo prune et ambre et un téléphone dessiné en CSS, trois atouts, « comment ça marche » en trois étapes, Gratuit ou Premium (sans prix), des questions fréquentes, puis un rappel avec les boutons des stores. Aucune image à fournir, aucun JavaScript. Les textes sont rédigés depuis ce que l'app fait vraiment, et tu les relis. Décisions prises avec le porteur le 2026-10-17 (sections, visuels, ambiance, textes).

## Requirements

**Acceptance criteria**:
- **AC-1**: `src/pages/index.astro` keeps title `Noli`, a description, and renders, in order: a hero (`h1` accroche, sub title, `StoreButtons`, decorative CSS phone), « Pourquoi Noli » (3 atouts), « Comment ça marche » (3 numbered steps), « Gratuit ou Premium » (2 cards), « Questions fréquentes » (5 questions), a final call with `StoreButtons`; each section has an `h2`, the page one `h1`.
- **AC-2**: Every claim matches the code or the legal pages: free offer (series not premium in full, free episodes of premium series if any), premium (every episode, 30 days per payment, no automatic renewal, KkiaPay mobile money or card, price shown in the app before paying, payment not open yet), resume where you stopped, no advertising, app coming soon on Google Play and the App Store; no price, no release date, no catalogue title, no number of series.
- **AC-3**: The FAQ uses native `<details>`/`<summary>` (no JavaScript), keyboard operable, and links to `/cgu` only once that page exists, to `/confidentialite` and `/suppression-compte`.
- **AC-4**: Decorative visuals (halo, phone, posters) are pure CSS from tokens, `aria-hidden="true"`, no image file, no inline style; the page still passes the build's CSP check and makes no request to another domain.
- **AC-5**: Two tokens join `@theme` and the `design.md` table: `--color-plum: #1e1a2e` and `--color-violet: #6c5ce7` (app `NColors.plum` and `secondary`), used only on the home page.
- **AC-6**: At 320 px no sideways scroll; at 1280 px the hero shows text and phone side by side; text pairs meet WCAG AA; `prefers-reduced-motion` respected (no animation is required).

## Design

| Section | Contenu |
|---|---|
| Bandeau | accroche en Bricolage 40 à 64 px, sous titre, boutons stores ; à droite (dessous sur mobile) un téléphone en CSS avec une grille d'affiches en dégradés et une barre de lecture ambre ; halo radial prune et ambre en fond |
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

- [ ] Replace the CSS phone with real app screenshots when available (`src/assets/`, `<Image>`).
- [ ] Add the `/cgu` link to the FAQ when feature 6 ships.
