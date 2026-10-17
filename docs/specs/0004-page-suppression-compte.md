# 0004. Page suppression de compte

**Date**: 2026-10-17
**Status**: In Progress

## Summary

La page `https://nollli.com/suppression-compte` explique comment supprimer son compte Noli : dans l'application, par email au support pour qui n'a plus l'app, et que faire en cas de mot de passe oublié ou d'adresse email perdue. Elle dit ce qui est effacé, ce qui est gardé et combien de temps, ce qui arrive au premium, et comment supprimer seulement une partie de ses données. Les règles viennent de la spec 0010 du backend et de l'inventaire de la spec 0003. C'est un fichier Markdown de la collection `legal`, rendu par la route déjà construite, et la politique de confidentialité y renvoie.

## Context

Google Play exige, pour toute app qui permet de créer un compte, une adresse web où l'on peut demander la suppression de son compte et de ses données, sans avoir l'app. Cette page doit nommer l'app ou son éditeur, donner les étapes, dire quelles données sont supprimées ou gardées et pour combien de temps (basis: Google Play User Data policy ; spec 0010 du backend, AC-11).

Le backend sait déjà supprimer un compte (`DELETE /users/me` avec le mot de passe, `DELETE /users/:id` pour un admin, spec 0010, en cours de construction côté backend). En revanche, l'app n'a **pas encore** d'écran de suppression : seul « Retirer la photo » existe dans le profil (`noli_app/lib/core/constants/app_constants.dart`). Le backend n'a pas non plus de route pour effacer seulement l'historique d'un compte. La page doit donc décrire un chemin dans l'app qui reste à construire, et une suppression partielle traitée à la main par un admin.

## Requirements

**User stories**:
- As a Noli user, I want to know how to delete my account and what happens to my data, with or without the app, so that I can leave Noli cleanly.
- As a Google Play reviewer, I want a public page that explains account deletion, so that I can approve the app.

**Acceptance criteria**:
- **AC-1**: `src/content/legal/suppression-compte.md` exists in the `legal` collection with `title: "Supprimer votre compte Noli"`, a non empty `description` and `updatedAt`, and is rendered at `/suppression-compte` (`dist/suppression-compte.html`) through `LegalLayout`.
- **AC-2**: The opening paragraph names the app (« Noli ») and its publisher through `{{editeur.nom}}`, then two bullets give both ways at once, before any section: in the app (Profil, then Supprimer mon compte), or without the app and without a password, by writing to `support@nollli.com` from the account's address.
- **AC-3**: The `h2` sections are, in this order: Dans l'application ; Sans l'application ; Mot de passe oublié ; Plus d'accès à votre adresse email ; Ce qui est supprimé ; Ce que nous gardons ; Votre abonnement premium ; Après la suppression ; Supprimer seulement une partie de vos données ; Une question.
- **AC-4**: « Dans l'application » gives these exact steps and labels: open **Profil**, tap **Supprimer mon compte**, read the warning (final, premium lost without refund), type your password, tap **Supprimer définitivement**; the deletion is immediate.
- **AC-5**: « Sans l'application » says to write from the account's email address, with the username in the message, through a link `mailto:support@nollli.com?subject=Suppression%20de%20mon%20compte%20Noli` labelled « Écrire au support »; that it works without the app and without a password; that support answers by email; and that the request is handled within one month, extendable by two months if it is complex (as in the privacy policy).
- **AC-6**: « Mot de passe oublié » says to use **Mot de passe oublié ?** on the app's login screen (a code arrives by email), then delete, or to write to support. « Plus d'accès à votre adresse email » says: if you can still sign in, delete from the app; otherwise write to support with your username, and support will tell you what it needs to check that the account is yours (no specific proof is promised), so that no one can have someone else's account deleted.
- **AC-7**: « Ce qui est supprimé » lists the account, watch history, notifications (and the daily push counter), devices registered for push, password reset requests, and profile photos removed from our storage. « Ce que nous gardons » lists: payment records without the mobile money number, without payment failure details and without link to the account (transaction id, amount, fees, method), for the time required by accounting and tax obligations; the deletion trace (former account id, who started it, dates) for 3 years; series ratings, which were never linked to the person; copies kept by providers for their own retention (email logs at Brevo, cached images at Cloudinary, payment records at KkiaPay). It also says that deleting the account does not wipe the phone: ratings and saved series stored by the app go away when the app is uninstalled.
- **AC-8**: « Votre abonnement premium » says an active premium is lost without refund and that the deletion is final.
- **AC-9**: « Après la suppression » says you normally receive a confirmation email whose subject is quoted as « Ton compte Noli a été supprimé », at the account address; the account can no longer sign in; the same address can create a new, empty account.
- **AC-10**: « Supprimer seulement une partie de vos données » says the profile photo can be removed in the app (**Retirer la photo** in Profil), and that other data, such as the watch history, can be deleted on request by email, within the same delay as AC-5, without deleting the account.
- **AC-11**: `footerLinks` gets `{ label: 'Suppression de compte', href: '/suppression-compte' }` after « Confidentialité ». The « Supprimer votre compte » section of `confidentialite.md` links to `/suppression-compte` and states the same delay as AC-5 for email requests, without changing that file's `updatedAt` (no change of substance).
- **AC-12**: Every fact on the page matches spec 0010 of the backend and the inventory of spec 0003; the text is reviewed with the privacy policy before the app is sent to the stores.
- **AC-13** (release gate, checked by `/check verify` before the stores): the labels **Supprimer mon compte** and **Supprimer définitivement** exist in `../noli_app/lib/core/constants/app_constants.dart` and the in app deletion works; `site.publisher.name` is exactly the developer name of the Play Console listing; `https://nollli.com/suppression-compte` is entered as the account deletion URL in the Play Console; the Data safety form declares the same deleted and kept data. Apple (5.1.1(v)) also requires the in app deletion, so the iOS submission waits for it too.

## Decision

**Chosen option**: un texte Markdown de la collection `legal`, rendu par `src/pages/[slug].astro`, qui décrit le chemin prévu dans l'app avec des libellés fixés ici (contrat pour `noli_app`), la demande par email avec un lien `mailto` au sujet prérempli, et les cas mot de passe oublié, email perdu et suppression partielle.

Alternatives écartées : ne décrire que l'email tant que l'écran de l'app n'existe pas (la page serait à réécrire avant l'envoi aux stores, et l'app n'est pas publiée, donc personne ne suit un chemin absent) ; refuser toute suppression partielle (moins conforme au droit d'effacement, alors qu'un admin peut le faire).

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.claude/skills/astro/`) · `vitest` (`antfu/skills`, `.claude/skills/vitest/`)

## Feature design

**Data model**: aucun. Le texte vit dans `src/content/legal/suppression-compte.md` (schéma de la collection `legal`, spec 0001). Une seule balise : `{{editeur.nom}}` (spec 0003, mêmes règles : strict sur Render).

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| titre, description, date | « Supprimer votre compte Noli », description, `updatedAt` | frontmatter |
| nom de l'éditeur | `{{editeur.nom}}` | `site.publisher.name` (spec 0003) |
| libellés de l'app | Profil, Supprimer mon compte, Supprimer définitivement, Mot de passe oublié ?, Retirer la photo | fixés par cette spec (les trois premiers deviennent un contrat pour `noli_app`) ; « Mot de passe oublié ? » et « Retirer la photo » existent déjà dans `app_constants.dart` |
| données supprimées et gardées, durées | listes de AC-7 | spec 0010 du backend (AC-3, AC-4, AC-6) et inventaire de la spec 0003 |
| délai des demandes par email | un mois, prolongeable de deux mois si la demande est complexe | décision de cette spec, alignée sur la spec 0003 |
| sujet de l'email du support | `Suppression de mon compte Noli` | décision de cette spec |
| objet de l'email de confirmation | « Ton compte Noli a été supprimé » | spec 0010, AC-5 |
| adresse du support | `support@nollli.com` | `site.supportEmail` |

**Key invariants**:
- La page ne dit rien que la spec 0010 ou l'inventaire de la spec 0003 ne disent pas.
- Les libellés de l'app cités ici sont ceux que l'écran de l'app doit afficher.
- Aucun JavaScript : le lien `mailto` est un simple lien.

**Security model**: page publique. La règle « depuis l'adresse du compte, sinon prouver que le compte est à vous » empêche de faire supprimer le compte de quelqu'un d'autre ; la vérification elle même est faite par l'admin, hors site.

**Configuration required**: aucune.

**Critical test scenarios**:
- Happy path : `dist/suppression-compte.html` existe, avec le titre, la date, les 10 `h2` dans l'ordre, et le nom de l'éditeur ou `[À COMPLÉTER : editeur.nom]`, verifies **AC-1**, **AC-2**, **AC-3**
- Contenu : la page contient les libellés de AC-4 et AC-6, la chaîne exacte `mailto:support@nollli.com?subject=Suppression%20de%20mon%20compte%20Noli`, « sans mot de passe », « un mois », « deux mois », « 3 ans », « obligations comptables et fiscales », « sans remboursement », « Ton compte Noli a été supprimé », « Retirer la photo », « désinstall », verifies **AC-2**, **AC-4** à **AC-10**
- Liens : le pied de page de chaque page a « Suppression de compte » vers `/suppression-compte`, après « Confidentialité » ; la politique de confidentialité a un lien vers `/suppression-compte` et le délai ; son `updatedAt` n'a pas changé, verifies **AC-11**
- Publication : les contrôles de AC-13 dans `verify.md`, faits par `/check verify` avant l'envoi aux stores, verifies **AC-13**

## Build plan

1. Rédiger `src/content/legal/suppression-compte.md` (10 sections, depuis la spec 0010 et l'inventaire de la spec 0003), satisfies **AC-1** à **AC-10**, **AC-12**
2. Ajouter « Suppression de compte » à `footerLinks`, et dans `confidentialite.md` (section « Supprimer votre compte ») le lien vers `/suppression-compte` et le délai des demandes par email, sans toucher son `updatedAt`, satisfies **AC-11**
3. Tests du build : page, ordre des `h2`, libellés, `mailto`, mots clés, liens du pied de page et de la politique, satisfies **AC-1** à **AC-11**
4. Écrire les contrôles de publication de AC-13 dans `verify.md` (libellés dans `app_constants.dart`, nom du développeur, Play Console, Data safety), satisfies **AC-13**

## Consequences

**Positive**:
- Google Play a son adresse de suppression de compte, utilisable sans l'app.
- Les libellés de l'écran de suppression sont fixés avant qu'il soit construit : l'app et la page diront la même chose.
- Aucun nouveau code : la route `legal` et les balises existent déjà.

**Negative / tradeoffs**:
- La page décrit un écran de l'app qui n'existe pas encore ; l'envoi aux stores (Google et Apple) attend qu'il soit construit, et AC-13 le vérifie.
- La suppression partielle par email est faite à la main par un admin dans la base, tant que le backend n'a pas de route pour ça.
- La vérification d'identité d'une personne qui a perdu son email reste à définir par l'équipe support.

**Neutral**:
- La politique de confidentialité gagne un lien, sans changement de date.

## Follow-up

- [ ] `../noli_app` : construire l'écran de suppression avec ces libellés exacts (Profil, **Supprimer mon compte**, avertissement, mot de passe, **Supprimer définitivement**), branché sur `DELETE /users/me` (spec 0010).
- [ ] `../noli-backend` : une route admin pour effacer seulement l'historique (ou une autre donnée) d'un compte, pour les demandes de suppression partielle.
- [ ] Support : écrire la procédure de vérification d'identité pour une personne qui a perdu l'accès à son email.
- [ ] Relecture juridique de cette page avec la politique de confidentialité.

## References

**Project sources**: spec 0010 du backend (`../noli-backend/docs/specs/0010-account-deletion/index.md`) ; spec 0003 (inventaire) ; `noli_app/lib/core/constants/app_constants.dart` (« Mot de passe oublié ? », « Retirer la photo ») ; `HANDOFF.md`.

**Practices & standards**: droit à l'effacement (RGPD article 17), délai de réponse d'un mois.

**Links** (vérifiés le 2026-10-17) :
- Google Play, User Data policy : https://support.google.com/googleplay/android-developer/answer/10144311?hl=en
- Apple, App Store Review Guidelines (5.1.1) : https://developer.apple.com/app-store/review/guidelines/
