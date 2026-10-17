# 0004. Page suppression de compte : raisonnement

Le registre de la décision. La construction se fait à partir de [index.md](index.md).

## Context

Google Play exige, pour toute app qui permet de créer un compte, une adresse web où l'on peut demander la suppression de son compte et de ses données, sans avoir l'app. Cette page doit nommer l'app ou son éditeur, donner les étapes, dire quelles données sont supprimées ou gardées et pour combien de temps (basis: Google Play User Data policy ; spec 0010 du backend, AC-11).

Le backend sait déjà supprimer un compte (`DELETE /users/me` avec le mot de passe, `DELETE /users/:id` pour un admin, spec 0010, en cours de construction côté backend). En revanche, l'app n'a **pas encore** d'écran de suppression : seul « Retirer la photo » existe dans le profil (`noli_app/lib/core/constants/app_constants.dart`). Le backend n'a pas non plus de route pour effacer seulement l'historique d'un compte. La page doit donc décrire un chemin dans l'app qui reste à construire, et une suppression partielle traitée à la main par un admin.

## Options considered

Alternatives écartées : ne décrire que l'email tant que l'écran de l'app n'existe pas (la page serait à réécrire avant l'envoi aux stores, et l'app n'est pas publiée, donc personne ne suit un chemin absent) ; refuser toute suppression partielle (moins conforme au droit d'effacement, alors qu'un admin peut le faire).

## Rationale

Décrire tout de suite le chemin prévu dans l'app fixe les libellés que l'écran devra afficher, et évite de réécrire la page avant l'envoi aux stores ; l'app n'étant pas publiée, personne ne suit un chemin absent. Accepter la suppression partielle par email respecte le droit d'effacement, même si un admin doit la faire à la main tant que le backend n'a pas de route dédiée.

## References

**Project sources**: spec 0010 du backend (`../noli-backend/docs/specs/0010-account-deletion/index.md`) ; spec 0003 (inventaire) ; `noli_app/lib/core/constants/app_constants.dart` (« Mot de passe oublié ? », « Retirer la photo ») ; `HANDOFF.md`.

**Practices & standards**: droit à l'effacement (RGPD article 17), délai de réponse d'un mois.

**Links** (vérifiés le 2026-10-17) :
- Google Play, User Data policy : https://support.google.com/googleplay/android-developer/answer/10144311?hl=en
- Apple, App Store Review Guidelines (5.1.1) : https://developer.apple.com/app-store/review/guidelines/
