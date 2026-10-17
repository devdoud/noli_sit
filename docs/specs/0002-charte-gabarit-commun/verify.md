# Verify: charte visuelle et gabarit commun · spec 0002 · updated 2026-10-17
_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones (most are already in `tests/`)._

## UI / manual (navigateur, `npm run dev` puis `http://localhost:4321/` et `/abc`)
- [ ] Ouvrir l'accueil à 320 px de large → aucune barre de défilement horizontale ; haut de page, contenu et pied de page lisibles → AC-9
- [ ] Même chose à 375 px et 1280 px → pied de page empilé à 375, sur deux colonnes à 1280 ; colonne centrée de 768 px max → AC-9
- [ ] Sur une page courte (404), le pied de page touche le bas de l'écran → AC-9
- [ ] Appuyer sur Tab une fois → « Aller au contenu » apparaît en haut à gauche, pastille ambre ; Entrée → le focus passe sur le contenu → AC-3
- [ ] Tab suivant → anneau ambre de 2 px autour du logo « Noli » ; puis l'adresse support → AC-10
- [ ] Les boutons stores ne reçoivent pas le focus et affichent « Bientôt disponible » → AC-6
- [ ] Les polices visibles sont Bricolage Grotesque (titres, « Noli ») et Plus Jakarta Sans (texte), pas une police système ; l'onglet réseau ne montre aucune requête hors `localhost` → AC-8
- [ ] L'onglet affiche le favicon Noli → AC-2
- [ ] Liens du pied de page et de la 404 soulignés ; survol en ambre clair → AC-10
- [ ] Une page de test avec `LegalLayout` (titre, `updatedAt`, Markdown avec titres, liste, lien) → « Mis à jour le … » en français, colonne étroite, titres en Bricolage, liens ambre soulignés ; la retirer ensuite → AC-7

## Commands
- [ ] `npm run build` → 0 erreur, « aucun script ni style en ligne » → AC-8
- [ ] `npm test` → tous les tests passent (head, canonical, lien d'évitement, haut et pied de page, boutons stores, polices, URL absolues, jetons, fonctions de `site.ts`) → AC-1 à AC-8, AC-11
- [ ] `npm run lint` et `npm run format:check` → propres

## Acceptance-criteria coverage
- AC-1 : `tests/design-tokens.test.ts`
- AC-2 : `tests/build-output.test.ts` (head), `tests/site-config.test.ts` (`pageTitle`, `canonicalPath`) ; favicon visible : UI 8
- AC-3 : test du build (premier lien) ; UI 4
- AC-4 : test du build (lien du logo)
- AC-5 : test du build (mailto, année, nav conditionnelle, pages construites)
- AC-6 : test du build ; UI 6
- AC-7 : `formatLegalDate` (deux fuseaux) ; UI 10
- AC-8 : tests ressources ; build ; UI 7
- AC-9 : UI 1 à 3 (navigateur seulement)
- AC-10 : contrastes calculés pendant `/develop` (plus faible : 6,76:1) ; UI 5 et 9
- AC-11 : test du build
