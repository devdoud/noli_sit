# 0005. Conditions générales d'utilisation

**Date**: 2026-10-17
**Status**: In Progress

## Summary

La page `https://nollli.com/cgu` donne les règles d'usage de Noli : le service et ses deux offres, le compte, les usages interdits, l'abonnement premium tel que le backend le fait vraiment (paiement unique par KkiaPay pour 30 jours, sans renouvellement automatique, pas de remboursement sauf erreur de paiement), la suppression de compte, la propriété intellectuelle, la responsabilité, la suspension, les changements et le droit applicable. Le texte reprend le brouillon déjà présent dans l'app, corrigé contre le code et passé au vouvoiement. Le site devient la **source unique** des textes légaux : l'app remplacera ses copies par des liens vers nollli.com.

## Requirements

**User stories**:
- As a Noli user, I want clear rules on what I can do, what premium gives and costs, and how it ends, so that nothing surprises me.
- As a store reviewer, I want public terms of use at a stable URL, so that I can approve the app.
- As the team, I want one version of the legal texts, true to the code, so that the app and the site never contradict each other.

**Acceptance criteria**:
- **AC-1**: `src/content/legal/cgu.md` exists in the `legal` collection with `title: "Conditions générales d'utilisation"`, a non empty `description` and `updatedAt` (the date the final text is committed), and is rendered at `/cgu` (`dist/cgu.html`) through `LegalLayout`.
- **AC-2**: The `h2` sections are, in this order: Objet et acceptation ; Le service ; Votre compte ; Utilisation des contenus ; L'abonnement premium ; Supprimer votre compte ; Propriété intellectuelle ; Données personnelles ; Disponibilité et responsabilité ; Suspension du compte ; Modifications des conditions ; Droit applicable et litiges ; Dispositions générales ; Nous contacter.
- **AC-3**: The text uses « vous » (no tutoiement in the prose), names the publisher through `{{editeur.nom}}` ({{editeur.forme}}, {{editeur.adresse}}, {{editeur.pays}}), and uses no other tag.
- **AC-4**: « Le service » describes the two offers as the code does: Gratuit gives every series not marked premium in full, and, for a premium series, the episodes the series makes free, if any (the number is set per series and can be zero); Premium gives every episode of every series. It says the catalogue changes with the rights Noli holds, that mobile data costs are the user's, and promises nothing about release dates of new episodes.
- **AC-5**: « Votre compte » says an account needs an email address the user can read (it serves to reset the password), a username of 3 to 30 characters and a password, first and last name being optional, with no format or length promised beyond that; the user declares being 13 or older, and needs a parent's agreement under 18 to take premium; some content may not suit younger users, and the account holder answers for its use; the account is personal, must not be shared, and misuse is reported to `support@nollli.com`.
- **AC-6**: « Utilisation des contenus » grants a personal, non exclusive, non transferable right to stream for private, non commercial use during the life of the account, and lists the forbidden uses of the app draft (copy, record, download outside the app, public or paid showing, bypassing premium or protections, sharing or reselling access, robots, disrupting the service, illegal, hateful or impersonating username or profile photo).
- **AC-7**: « L'abonnement premium » says:
  - payment is not open yet, and no amount is charged until it is; when it opens, the price of a 30 day period is shown in the app before any payment, and the user pays only after confirming it;
  - payment is handled by KkiaPay; Noli never sees the card number;
  - one payment gives 30 days of premium; there is no automatic renewal; a new payment adds 30 days from the current end date if it has not passed, otherwise from the payment date;
  - at the end, premium stays one more day, then the account goes back to the free offer by itself;
  - Noli may send reminders before the end, which the user can turn off in the app; a missing reminder does not extend premium;
  - no refund once the payment is confirmed (« sans remboursement, sauf erreur de paiement »); a payment error is: charged twice for one period, charged but premium not credited within 72 hours, or charged for a deleted account (such a payment is never credited); change of mind or not using premium are not errors; the request goes to `support@nollli.com` with the transaction number, answered within one month;
  - a premium in progress is lost without refund if the account is deleted;
  - a price change is announced before it applies and never changes a period already paid;
  - nothing here removes the rights the law of the user's country grants to consumers.
- **AC-8**: « Supprimer votre compte » says the account can be deleted in the app or by email, the deletion is final, and links to `/suppression-compte` for the steps and what is kept.
- **AC-9**: « Modifications des conditions » says changes are announced at least 30 days before they apply, by email or in the app, except for a legal obligation or a minor correction; using Noli after that date means accepting them, otherwise the user can delete the account. « Droit applicable et litiges » says the terms follow the law of {{editeur.pays}}; disputes are first discussed amicably at `support@nollli.com`, then go to the competent courts of the place of the publisher's registered office, without depriving a consumer of the protective rules of their country.
- **AC-10**: « Suspension du compte » says Noli can suspend or delete an account that breaks the terms, after an email warning except urgency or legal obligation, and that the user can contest at `support@nollli.com`. « Disponibilité et responsabilité » keeps the app draft's limits (including force majeure) and states that nothing limits the rights the law of the user's country guarantees as a consumer. « Propriété intellectuelle » keeps the draft's rights holders paragraph and the infringement notice by email to `support@nollli.com`, and the profile photo licence.
- **AC-11**: « Dispositions générales » says: a clause held invalid does not affect the others; the French version prevails; clauses that by nature last beyond the account (intellectual property, liability, applicable law) survive its deletion.
- **AC-12**: `footerLinks` gets `{ label: "Conditions d'utilisation", href: '/cgu' }` between « Confidentialité » and « Suppression de compte ». The privacy policy and the deletion page are not changed.
- **AC-13**: No fact contradicts the code (`noli-backend/src/billing/billing.constants.ts`, `billing.service.ts`, `billing-grace.scheduler.ts`, `series/content-access.ts`, `users/dto/create-user.dto.ts`, `notifications/notifications.scheduler.ts`) or specs 0003 and 0004; the text is reviewed by a person qualified in law before the app is sent to the stores, payment section first.

## Decision

**Chosen option**: le site est la source unique des textes légaux ; les CGU sont un Markdown de la collection `legal`, rédigé depuis le brouillon de l'app corrigé contre le code, au vouvoiement, avec les balises `{{editeur.*}}`.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.claude/skills/astro/`) · `vitest` (`antfu/skills`, `.claude/skills/vitest/`)

## Rationale

Le contexte, les options et les sources sont dans [rationale.md](rationale.md).

## Feature design

**Data model**: aucun. Texte dans `src/content/legal/cgu.md` (collection `legal`, spec 0001), balises de la spec 0003 (`editeur.nom`, `editeur.forme`, `editeur.adresse`, `editeur.pays`), strictes sur Render.

**Corrections du brouillon de l'app** (`noli_app/docs/legal/conditions-generales-utilisation.md`, 8 octobre 2026) :
| Brouillon | Dans le code | Texte des CGU |
|---|---|---|
| « tu » | site au « vous » | « vous » |
| « cinéma et séries d'Afrique de l'Ouest » | fiche de passation : streaming de séries pour l'Afrique de l'Ouest francophone | « streaming de séries » |
| Gratuit : « les premiers épisodes de chaque série » | une série non premium est gratuite en entier ; une série premium a un nombre d'épisodes gratuits propre, parfois zéro (`content-access.ts`) | AC-4 |
| nom d'utilisateur « lettres, chiffres, point, tiret » | seule la longueur 3 à 30 est contrôlée (`create-user.dto.ts`) | AC-5, aucun format promis |
| mot de passe « d'au moins 8 caractères » | 6 au minimum côté serveur (`create-user.dto.ts:17`) | aucun chiffre promis |
| « adresse email valide » | aucune vérification à l'inscription | « une adresse email que vous pouvez consulter » |
| suppression « écris-nous… sous 30 jours » | suppression dans l'app (spec 0010) ou par email, un mois prolongeable (spec 0004) | AC-8, lien vers `/suppression-compte` |
| premium « à compléter » | 30 jours par paiement, empilés sur la date de fin si elle n'est pas passée, sinon à partir du paiement ; un jour de grâce puis retour au gratuit à la tâche de minuit (`billing.service.ts`, `billing.constants.ts`, `billing-grace.scheduler.ts`) ; rappels 3 jours avant et le jour même (`notifications.scheduler.ts`) | AC-7 |
| « achat intégré App Store ou Google Play » | paiement par KkiaPay seulement, pas encore ouvert | AC-7, non mentionné |
| éditeur, âge, droit « à compléter » | balises de la spec 0003 ; âge de la spec 0003 | AC-3, AC-5, AC-9 |
| « directeur de la publication » | relève des mentions légales (feature 7) | retiré des CGU |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| titre, description, date | « Conditions générales d'utilisation », description, `updatedAt` | frontmatter |
| identité de l'éditeur, pays du droit applicable | `{{editeur.*}}` | `site.publisher` (spec 0003) |
| durée d'une période premium | 30 jours | `BILLING_PERIOD_DAYS` |
| délai de grâce | un jour de plus | `BILLING_GRACE_PERIOD_DAYS` et la tâche de minuit |
| point de départ d'un nouveau paiement | date de fin si elle n'est pas passée, sinon date du paiement | `billing.service.ts` (max(endDate, maintenant)) |
| rappels | possibles, désactivables | `notifications.scheduler.ts`, réglage `premium` |
| offres | Gratuit et Premium, épisodes gratuits par série | `content-access.ts` |
| prix | « affiché dans l'application avant tout paiement » ; paiement pas encore ouvert | décision de cette spec (aucun montant dans le code, aucun écran de paiement) |
| erreur de paiement | double débit, premium non crédité sous 72 heures, débit pour un compte supprimé | décision de cette spec |
| délai de réponse au remboursement | un mois | décision de cette spec (aligné sur la spec 0004) |
| âge minimum, accord parental | 13 ans déclarés, accord avant 18 ans pour le premium | spec 0003 |
| préavis de changement | 30 jours | décision de cette spec |
| tribunaux | ceux du lieu du siège de l'éditeur | décision de cette spec |
| contact | `support@nollli.com` | `site.supportEmail` |

**Key invariants**:
- Le site est la source unique des CGU et de la politique de confidentialité ; aucune copie divergente ne doit rester dans l'app une fois les liens en place.
- Aucun montant, aucune devise, aucun moyen de paiement que le code n'utilise pas.
- Les CGU ne répètent pas la politique ni la page de suppression : elles y renvoient.
- Les CGU n'affirment rien sur la conformité du paiement par KkiaPay aux règles des stores.

**Security model**: page publique, sans donnée de visiteur.

**Configuration required**: aucune.

**Critical test scenarios** (sur le texte visible de la page, balises HTML retirées) :
- Happy path : `dist/cgu.html` existe avec le titre, la date, les 14 `h2` dans l'ordre (apostrophes normalisées), l'éditeur ou `[À COMPLÉTER …]`, aucune balise restante, verifies **AC-1**, **AC-2**, **AC-3**
- Contenu : la page contient « 30 jours de premium », « renouvellement automatique », « un jour de plus », « KkiaPay », « sans remboursement, sauf erreur de paiement », « 72 heures », « numéro de transaction », « affiché dans l’application avant tout paiement », « pas encore ouvert », « 13 ans », « usage privé », « 30 jours avant », « tribunaux », « version française », et des liens vers `/suppression-compte` et `/confidentialite`, verifies **AC-4** à **AC-11**
- Absences : aucun montant suivi d'une devise (FCFA, XOF, NGN, €) ; ni « 8 caractères », « lettres, chiffres », « achat intégré », « App Store », « Google Play », « directeur », « dès leur sortie » ; aucun tutoiement, cherché avec un motif qui tient compte des accents : `(?<![\p{L}\p{N}])(tu|ton|ta|tes|toi|te|tien)(?![\p{L}\p{N}])` et `(?<![\p{L}\p{N}])t[’']` avec le drapeau `u`, insensible à la casse, verifies **AC-3**, **AC-4**, **AC-5**, **AC-7**
- Pied de page : « Conditions d'utilisation » vers `/cgu`, entre « Confidentialité » et « Suppression de compte », sur chaque page construite, verifies **AC-12**

## Build plan

1. Rédiger `src/content/legal/cgu.md` (14 sections) depuis le brouillon de l'app et le tableau de corrections, sans citer l'objet d'email tutoyé de la suppression, satisfies **AC-1** à **AC-11**, **AC-13**
2. Ajouter « Conditions d'utilisation » à `footerLinks` entre les deux liens existants, satisfies **AC-12**
3. Tests du build (page, sections, mots clés, absences, tutoiement, pied de page) et `verify.md` (relecture, contrôle en ligne), satisfies **AC-1** à **AC-13**

## Consequences

**Positive**:
- Une seule version des textes légaux, corrigible sans publier l'app.
- Le premium est décrit comme le backend le fait, sans montant à tenir à jour dans deux endroits.
- Les écarts du brouillon de l'app (mot de passe, format du nom, email, suppression, offres) disparaissent.

**Negative / tradeoffs**:
- L'app doit être modifiée (liens à la place des textes embarqués), et lire les textes demande une connexion.
- Tant que l'app garde ses copies, deux versions différentes existent : l'envoi aux stores doit attendre ce changement.
- La règle « pas de remboursement » ne suffit pas pour les utilisateurs de l'Union européenne (droit de rétractation sur les contenus numériques, qui demande un consentement explicite au moment de l'achat) : la relecture juridique et l'écran de paiement doivent le traiter.
- La section premium décrit un paiement qui n'est pas encore ouvert : elle sera relue à son ouverture.

**Neutral**:
- Le « directeur de la publication » part dans les mentions légales (feature 7).
- Les notifications de l'app tutoient (« Ton compte… ») ; c'est un choix de l'app, pas des textes légaux.

## Follow-up

- [ ] `../noli_app` : remplacer `docs/legal/*.md` et l'écran `features/legal` par des liens qui ouvrent `https://nollli.com/cgu` et `https://nollli.com/confidentialite` ; retirer les copies embarquées.
- [ ] `../noli_app` : à l'ouverture du paiement, afficher le prix avant de payer, et recueillir le consentement explicite à l'exécution immédiate (perte du droit de rétractation dans l'UE).
- [ ] Équipe : vérifier avant d'ouvrir le paiement que vendre l'accès premium avec KkiaPay dans l'app est compatible avec les règles de paiement d'Apple (3.1.1) et de Google Play ; sinon, prévoir les achats intégrés ou un paiement hors de l'app.
- [ ] Relecture juridique, en priorité : remboursement et droit de rétractation dans l'UE, responsabilité, droit applicable.
- [ ] À l'ouverture du paiement : relire la section premium et mettre à jour `updatedAt`.
