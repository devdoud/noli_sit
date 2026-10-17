# Verify: politique de confidentialité · spec 0003 · updated 2026-10-17
_Steps derived from spec 0003 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones (most are already in `tests/`)._

## Avant la mise en ligne (local)
- [ ] `npm run build` → 0 erreur ; la page affiche les valeurs de `src/config/site.ts` (ou « [À COMPLÉTER : … ] » si vides) → AC-6
- [ ] `RENDER=true npm run build` avec une valeur vide → le build échoue avec « Valeur vide pour {{…}} » ; avec toutes les valeurs remplies → il passe → AC-6
- [ ] `npm test` → tous les tests passent (sections, prestataires, mots clés, services inactifs absents, balises, gardes du build) → AC-1 à AC-9, AC-12
- [ ] `/confidentialite` dans un navigateur à 320 px et 1280 px → aucune page qui défile en largeur, tableaux lisibles (ils défilent seuls sur mobile), lien « Confidentialité » dans le pied de page → AC-2, AC-9

## En ligne (après la mise en ligne, par toi)
- [ ] `curl -I https://nollli.com/confidentialite` → `200`, sans `.html` → AC-10
- [ ] `curl -I http://nollli.com/confidentialite` → redirection vers `https://nollli.com/confidentialite` → AC-10
- [ ] `curl -I https://www.nollli.com/` → redirection vers `https://nollli.com/` → AC-10
- [ ] `curl -I https://nollli.com/abc` → `404`, page « Page introuvable » → AC-10
- [ ] En têtes : `Content-Security-Policy` présent, `Strict-Transport-Security` une seule fois, pas de `X-Robots-Tag: noindex` → AC-10
- [ ] Un email de test Brevo (par exemple un code de mot de passe oublié depuis l'app) arrive toujours après le changement DNS → AC-10
- [ ] Aucun « [À COMPLÉTER » sur la page en ligne → AC-6

## Relecture juridique (avant l'envoi aux stores)
- [ ] Texte relu par une personne qualifiée en droit ; noter ici son nom ou sa fonction, la date, et les points tranchés (transferts hors du Bénin et garanties, formalités APDP, bases légales, âge minimum, durée de conservation des paiements) → AC-11
- [ ] Après la relecture : mettre à jour le texte et `updatedAt` si besoin → AC-1

## Acceptance-criteria coverage
- AC-1 : test du build (page, titre, canonical, date) ; relecture : mise à jour de la date
- AC-2 : test du build (ordre des 15 `h2`)
- AC-3, AC-4, AC-5, AC-7, AC-8, AC-12 : tests du build (prestataires, mots clés, phrases interdites)
- AC-6 : `tests/site-values.test.ts`, `tests/check-no-inline.test.ts` ; build strict (local et en ligne)
- AC-9 : test du build (lien du pied de page sur chaque page)
- AC-10 : contrôles en ligne
- AC-11 : relecture juridique
