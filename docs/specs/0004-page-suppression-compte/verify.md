# Verify: page suppression de compte · spec 0004 · updated 2026-10-17
_Steps derived from spec 0004 acceptance criteria. `/check verify` runs these; most are already locked in `tests/build-output.test.ts`._

## Local
- [x] `npm run build` → 0 erreur, `dist/suppression-compte.html` produit → AC-1
- [x] `npm test` → tests « account deletion page » verts (sections, libellés, `mailto`, mots clés, liens) → AC-1 à AC-11
- [x] `/suppression-compte` dans un navigateur à 320 px et 1280 px → les deux façons de supprimer sont visibles avant la première section ; le lien « Écrire au support » ouvre un email avec le sujet « Suppression de mon compte Noli » ; aucune page qui défile en largeur → AC-2, AC-5
- [x] La politique de confidentialité renvoie vers `/suppression-compte`, et son `updatedAt` n'a pas changé → AC-11
- [x] Chaque fait de la page correspond à la spec 0010 du backend et à l'inventaire de la spec 0003 → AC-12

## En ligne (après la mise en ligne de la feature 4)
- [ ] `curl -I https://nollli.com/suppression-compte` → `200`, sans `.html` → AC-1
- [ ] Aucun « [À COMPLÉTER » sur la page en ligne → AC-2

## Conditions de publication (avant l'envoi aux stores) → AC-13
- [ ] `../noli_app/lib/core/constants/app_constants.dart` contient les libellés **Supprimer mon compte** et **Supprimer définitivement**, et la suppression dans l'app fonctionne de bout en bout (Profil, avertissement, mot de passe, suppression)
- [ ] `site.publisher.name` est exactement le nom du développeur affiché sur la fiche Play Console
- [ ] `https://nollli.com/suppression-compte` est renseignée comme adresse de suppression de compte dans la Play Console
- [ ] Le formulaire Data safety déclare les mêmes données supprimées et gardées que cette page
- [ ] Relecture juridique faite avec la politique de confidentialité → AC-12

## Acceptance-criteria coverage
- AC-1 à AC-11 : `tests/build-output.test.ts` (« account deletion page ») ; navigateur
- AC-12 : relecture des faits et relecture juridique
- AC-13 : conditions de publication ci dessus
