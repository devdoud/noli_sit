# 0005. Conditions générales d'utilisation : raisonnement

Le registre de la décision. La construction se fait à partir de [index.md](index.md).

## Context

Les stores exigent des règles d'usage publiques, et le paiement premium (KkiaPay) doit être encadré : ce qu'il donne, sa durée, son renouvellement, sa fin et le remboursement. Le backend fixe déjà ces règles. Une période premium dure 30 jours. Un nouveau paiement ajoute 30 jours à la date de fin. Il n'y a pas de renouvellement automatique. À la fin, il reste un jour de grâce, puis le compte repasse en gratuit tout seul. Une série premium a un nombre d'épisodes gratuits propre. Aucun prix n'existe encore, et l'app n'a pas d'écran de paiement.

L'app embarque déjà un brouillon de CGU et de politique de confidentialité (`noli_app/docs/legal/`, affiché par `features/legal`). Ce brouillon tutoie, et il contredit le code sur plusieurs points : un mot de passe de 8 caractères au lieu de 6, la suppression seulement par email, l'offre gratuite, l'achat par les stores. Il garde aussi des champs « à compléter » tapés à la main. Les pages du site vouvoient et décrivent le code vérifié. Deux sources pour les mêmes textes se contredisent donc déjà.

## Options considered

1. **Le site est la source, l'app ouvre nollli.com (retenue).**
   - Pour : une seule version ; une correction sans publier l'app ; l'adresse web est exigée de toute façon par les stores.
   - Contre : il faut modifier l'app ; lire les textes demande une connexion.
2. **L'app est la source, le site copie.**
   - Pour : les textes restent lisibles hors connexion.
   - Contre : il faut publier l'app pour corriger un texte ; la politique du site, vérifiée contre le code, serait remplacée par une version moins juste.
3. **Deux copies tenues à la main.**
   - Pour : rien à changer aujourd'hui.
   - Contre : les écarts existent déjà et reviendront.

Pour le premium, décrire le fonctionnement réel sans montant évite de bloquer la publication sur un prix pas encore fixé, et évite un chiffre à tenir à jour dans deux endroits. Une balise `{{premium.prix}}` aurait été plus précise, mais elle aurait bloqué la mise en ligne. Une section « pas encore ouvert » aurait obligé à republier au lancement du paiement.

## Rationale

L'exactitude prime, comme pour la politique (spec 0003). Les CGU décrivent ce que le backend applique, avec un renvoi vers les pages déjà vérifiées pour la suppression et les données. Le vouvoiement garde les trois textes cohérents. Le brouillon de l'app fournit de bonnes règles d'usage et de propriété : on le reprend, corrigé.

Ne pas rembourser une fois le paiement confirmé, sauf erreur, est cohérent avec la perte du premium à la suppression. Cette règle reste soumise à la relecture juridique, à cause du droit de rétractation dans l'Union européenne.

## References

**Project sources** :
- `noli-backend/src/billing/billing.constants.ts`, `billing-grace.scheduler.ts` et `billing.service.ts` ;
- `noli-backend/src/series/content-access.ts` ;
- `noli-backend/src/users/dto/create-user.dto.ts` ;
- `noli_app/docs/legal/conditions-generales-utilisation.md` et `noli_app/lib/features/legal/legal_document.dart` ;
- les specs 0003 et 0004.

**Practices & standards** : une source unique pour chaque texte ; les clauses protectrices du consommateur de son pays de résidence restent applicables.

**Links** (vérifiés le 2026-10-17) :
- Google Play, User Data policy : https://support.google.com/googleplay/android-developer/answer/10144311?hl=en
- Apple, App Store Review Guidelines : https://developer.apple.com/app-store/review/guidelines/
