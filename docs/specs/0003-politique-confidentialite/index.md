# 0003. Politique de confidentialité et première mise en ligne de nollli.com

**Date**: 2026-10-17
**Status**: Proposed

## Summary

La page `https://nollli.com/confidentialite` explique, en français et en clair, quelles données Noli traite vraiment, pourquoi, chez quels prestataires, combien de temps, et comment exercer ses droits. Le contenu part d'un inventaire vérifié dans le code de l'app et du backend, ligne à ligne. Le texte est un fichier Markdown ; le nom de l'éditeur, son adresse et la région d'hébergement viennent de `src/config/site.ts`, et Render refuse de publier tant qu'ils sont vides. Cette feature est aussi la première mise en ligne du site : Render, le domaine `nollli.com`, `www` et le HTTPS, en suivant la procédure de la spec 0001. La relecture par une personne qualifiée en droit reste obligatoire avant d'envoyer l'app aux stores.

## Requirements

**User stories**:
- As a Noli user, I want to read in plain French what data Noli keeps about me and how to get it deleted, so that I can trust the app.
- As a Google Play or App Store reviewer, I want a public privacy policy URL that covers what your policies require, so that I can approve the app.
- As the team, I want the policy to stay true to the code and impossible to publish half filled, so that we never ship a wrong or incomplete legal text.

**Acceptance criteria**:
- **AC-1**: `src/content/legal/confidentialite.md` exists in the `legal` collection with `title: "Politique de confidentialité"`, a non empty `description` and `updatedAt` set to the date the final text is committed, and `src/pages/[slug].astro` renders it at `/confidentialite` (file `dist/confidentialite.html`) through `LegalLayout`.
- **AC-2**: The text has these sections, in this order, each as an `h2`: Qui sommes nous ; En bref ; Les données que nous traitons ; Sur votre téléphone ; Pourquoi nous les utilisons ; Avec qui nous les partageons ; Où elles sont hébergées ; Combien de temps nous les gardons ; Vos droits ; Supprimer votre compte ; Les mineurs ; La sécurité ; Ce site web ; Les changements de cette politique ; Nous contacter.
- **AC-3**: Every data category of the inventory below appears, each with its purpose, its legal basis and its retention, and no data the code does not process appears.
- **AC-4**: Every service provider of the inventory appears with its role, the data it receives and where it is based; the phrases « Cloudflare », « Sign in with Apple », « connexion Apple », « Google Sign » and « connexion Google » do not appear.
- **AC-5**: The rights section lists access, rectification, deletion, opposition, limitation, portability and consent withdrawal; says requests go to `support@nollli.com` from the account's address and get an answer within one month (extendable by two months if complex); says no data protection officer is appointed and `support@nollli.com` is the contact; and names the right to complain to the APDP in Benin, to the data protection authority of the user's EU country (for example the CNIL in France), or to the authority of any other country of residence.
- **AC-6**: The tags `{{editeur.nom}}`, `{{editeur.forme}}`, `{{editeur.adresse}}`, `{{editeur.pays}}` and `{{hebergement.region}}` in the Markdown body text are replaced at build by the values in `src/config/site.ts`. An unknown tag always fails the build. A tag left anywhere it cannot be replaced (inline code, code block, link address) fails the build. An empty value fails the build in strict mode (the `RENDER` environment variable is set, as in Render builds), and otherwise renders `[À COMPLÉTER : <tag>]` with a console warning.
- **AC-7**: The page states the minimum age (13), and that a user under 18 needs a parent's agreement to take the premium subscription.
- **AC-8**: The « Ce site web » section says the site sets no cookie and has no audience measurement, and that the host keeps technical logs (IP address, browser) for security, for a duration the host decides.
- **AC-9**: `footerLinks` gets `{ label: 'Confidentialité', href: '/confidentialite' }`, so every page links to the policy.
- **AC-10**: Online: `https://nollli.com/confidentialite` answers `200` over HTTPS with no `.html`; `http://` and `www.nollli.com` redirect to `https://nollli.com`; an unknown address answers `404` with `404.html`; `Strict-Transport-Security` appears once; a Brevo test email still sends after the DNS change.
- **AC-11**: A person qualified in law has reviewed the text, and the review date and the points they settled are recorded in `verify.md`, before the app is sent to the stores.
- **AC-12**: The text says there is no automated decision with legal effect (recommendations are only a personalisation), and that an account cannot be created without an email address, a username and a password.

## Decision

**Chosen option**: Option 1 : texte Markdown complet fondé sur l'inventaire du code, valeurs d'identité injectées depuis `site.ts` par un plugin remark, mise en ligne Render pas à pas

La politique est un texte Markdown de la collection `legal`, rédigé depuis l'inventaire ci dessous, avec des balises `{{…}}` remplies au build depuis `src/config/site.ts` ; la page est publiée sur Render et `nollli.com` est branché selon la spec 0001.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.claude/skills/astro/`) · `vitest` (`antfu/skills`, `.claude/skills/vitest/`)

## Rationale

Le raisonnement, les options et les sources sont dans [rationale.md](rationale.md).

## Feature design

### Inventaire des données (source de vérité du texte, vérifié dans `noli_app` et `noli-backend` le 2026-10-17)

| Catégorie | Données | Finalité | Base légale | Conservation |
|---|---|---|---|---|
| Compte | email, nom d'utilisateur, prénom et nom (facultatifs), mot de passe (seulement chiffré, bcrypt), photo de profil (facultative), email vérifié ou non, réglages de notifications, rôle (utilisateur ou administrateur), état de session, dates de création et de modification | créer et gérer le compte, se connecter, sécuriser les sessions | exécution du contrat (conditions d'utilisation) | tant que le compte existe |
| Visionnage | séries, saisons et épisodes regardés, durée regardée, progression, dates | reprendre la lecture, afficher l'historique, proposer des séries proches de celles regardées (calculées à la demande, jamais stockées) | exécution du contrat | tant que le compte existe |
| Notes | note donnée à une série | afficher une note moyenne | intérêt légitime (aucun impact sur la personne : la note n'est pas gardée avec elle) | sur nos serveurs, seuls la moyenne et le nombre de votes sont gardés, sans lien avec la personne |
| Notifications dans l'app | titre, texte, série et épisode concernés, état d'envoi, lue ou non | informer des nouveaux épisodes, des séries, du premium, des paiements | exécution du contrat (épisodes, paiements, premium) ; consentement pour les notifications push (autorisation du téléphone) | 30 jours ; tâches d'envoi 7 jours ; compteur quotidien d'envois 2 jours |
| Appareils | jeton de notification push, plateforme (Android, iOS), version de l'app, date de dernière activité (10 appareils au plus par compte) | envoyer les notifications push | consentement | tant que le compte existe |
| Abonnement | formule (gratuite ou premium), dates de début et de fin, identifiant de la dernière transaction | fournir le premium | exécution du contrat | tant que le compte existe |
| Paiements | paiement en attente (identifiant, montant attendu) ; notifications de paiement de KkiaPay (identifiant de transaction, montant, frais, moyen de paiement, numéro mobile money, état) | encaisser et vérifier les paiements, tenir la comptabilité | exécution du contrat ; obligation légale (comptabilité) | tant que le compte existe ; après suppression du compte, le numéro mobile money et le lien avec le compte sont effacés, et le reste (identifiant de transaction, montant, frais, moyen) est gardé le temps exigé par nos obligations comptables et fiscales |
| Mot de passe oublié | code à usage unique (seulement chiffré), nombre d'essais | réinitialiser le mot de passe | exécution du contrat | 24 heures |
| Sécurité | adresse IP | limiter les tentatives répétées (mot de passe oublié, vérification de code, envoi d'images, suppression de compte) | intérêt légitime (sécurité, sans impact disproportionné) | en mémoire seulement, jamais dans la base ; journaux techniques de l'hébergeur selon sa propre durée |
| Suppression de compte | ancien identifiant du compte, qui l'a lancée (la personne ou un administrateur), dates | prouver qu'une suppression a été faite | obligation légale et intérêt légitime | 3 ans après la suppression |

**Sur le téléphone (gardé par l'app, pas par nous)** : jetons de connexion et profil (stockage sécurisé), préférences d'affichage, notes données, séries enregistrées. Effacés à la déconnexion (jetons) ou avec l'app.

**Ce que Noli ne fait pas** : aucune publicité, aucune revente, aucun outil de statistiques ni de rapport de plantage, aucun cookie, aucune décision automatisée ayant un effet juridique. Noli ne voit jamais de numéro de carte (le paiement passe par KkiaPay). Une photo n'est lue que si la personne en choisit une.

**Personnel** : les administrateurs de Noli peuvent consulter les comptes pour le support et la modération, et lancer une suppression à la demande de la personne.

### Prestataires (sous traitants)

| Prestataire | Rôle | Données reçues | Où |
|---|---|---|---|
| MongoDB Atlas | base de données | toutes les données du compte ci dessus | `{{hebergement.region}}` |
| Render | hébergement de l'API et du site | les données en transit, journaux techniques (adresse IP) | `{{hebergement.region}}` |
| Cloudinary | stockage des photos de profil et des images | la photo de profil (effacée avec le compte) | États Unis |
| Brevo | envoi des emails (codes de mot de passe oublié, alertes, confirmation de suppression) | email, prénom, contenu de l'email | France (Union européenne) |
| Firebase Cloud Messaging (Google) | envoi des notifications push | jeton de l'appareil, identifiant d'installation, adresse IP, contenu de la notification | États Unis |
| KkiaPay | paiements (mobile money et carte) | ce que la personne saisit chez KkiaPay ; Noli reçoit l'identifiant de transaction, le montant, les frais, le moyen et le numéro mobile money | Bénin |

Transferts : les données peuvent être traitées hors du pays de l'utilisateur, chez ces prestataires. Le texte le dit, et dit que ces prestataires s'engagent par contrat à protéger les données (clauses contractuelles types pour les transferts depuis l'UE). La relecture juridique confirme ou corrige ces garanties et les règles béninoises de transfert.

### Structure et contenu du texte (AC-2)

| Section (`h2`) | Ce qu'elle dit |
|---|---|
| Qui sommes nous | `{{editeur.nom}}` (`{{editeur.forme}}`), `{{editeur.adresse}}`, `{{editeur.pays}}`, responsable du traitement ; pas de délégué à la protection des données ; contact `support@nollli.com` |
| En bref | 4 à 6 puces : ce qu'on traite, ce qu'on ne fait pas (publicité, revente, statistiques, cookies), paiement par KkiaPay sans carte vue, suppression possible à tout moment, contact |
| Les données que nous traitons | les catégories de l'inventaire, en phrases simples ; sans email, nom d'utilisateur et mot de passe, pas de compte (AC-12) ; une photo n'est lue que si on la choisit |
| Sur votre téléphone | le paragraphe « Sur le téléphone » |
| Pourquoi nous les utilisons | finalités et bases légales de l'inventaire ; recommandations = personnalisation, aucune décision automatisée à effet juridique (AC-12) ; accès des administrateurs |
| Avec qui nous les partageons | le tableau des prestataires ; aucune vente ; transmission aux autorités seulement si la loi l'impose |
| Où elles sont hébergées | colonne « Où » et paragraphe sur les transferts |
| Combien de temps nous les gardons | les durées de l'inventaire |
| Vos droits | AC-5 ; retrait du consentement aux notifications push dans les réglages de l'app ou du téléphone |
| Supprimer votre compte | dans l'app (Profil, puis Supprimer mon compte, confirmation par mot de passe, immédiat et définitif) ou par email à `support@nollli.com` depuis l'adresse du compte ; ce qui est effacé, ce qui est gardé (inventaire, lignes Paiements et Suppression) ; copies chez les prestataires le temps de leur propre conservation ; le premium en cours est perdu sans remboursement. Le lien vers `/suppression-compte` est ajouté par la feature 5, pas avant |
| Les mineurs | AC-7 |
| La sécurité | mots de passe et codes chiffrés, connexions en HTTPS, limitation des tentatives, accès limité aux personnes qui en ont besoin |
| Ce site web | AC-8 |
| Les changements de cette politique | la date en haut de page ; un changement important est annoncé dans l'app ou par email avant d'entrer en vigueur |
| Nous contacter | `support@nollli.com` |

Ton : « vous » et « nous », phrases courtes, sans jargon juridique inutile, en français. Liens internes seulement vers des pages construites. Pas de HTML brut (spec 0001). Balises `{{…}}` seulement dans le texte courant (jamais dans le frontmatter, un code ou l'adresse d'un lien).

### Valeurs injectées (AC-6)

`src/config/site.ts` gagne :
- `publisher` : `{ name: string; legalForm: string; address: string; country: string }`, valeurs `''` au départ (réutilisé par les mentions légales, feature 7).
- `dataHosting` : `{ region: string }`, valeur `''` au départ (ex. `Union européenne (Francfort, Allemagne)`).

`src/config/site-values.ts` (nouveau) :
- `siteValues` : `editeur.nom` → `publisher.name`, `editeur.forme` → `publisher.legalForm`, `editeur.adresse` → `publisher.address`, `editeur.pays` → `publisher.country`, `hebergement.region` → `dataHosting.region`.
- `fillSiteValues(text: string, values: Readonly<Record<string, string>>, strict: boolean): { text: string; missing: string[] }` (fonction pure) : remplace chaque `{{tag}}` ; tag inconnu → erreur ; valeur vide → erreur si `strict`, sinon `[À COMPLÉTER : tag]` et le tag dans `missing`.
- `remarkSiteValues(options: { values?: Readonly<Record<string, string>>; strict?: boolean })` : plugin remark qui, avec `unist-util-visit`, applique `fillSiteValues` aux seuls nœuds `text`, puis parcourt tout l'arbre (code, `inlineCode`, URL des liens) et échoue s'il reste `{{`. Valeurs par défaut : `values = siteValues`, `strict = Boolean(process.env.RENDER)` (lu dans `astro.config.ts`, passé en option, jamais lu dans la fonction pure). Avertissement en console pour chaque valeur manquante.

`astro.config.ts` : `markdown: { remarkPlugins: [[remarkSiteValues, { strict: Boolean(process.env.RENDER) }]] }`. Une vérification au build (test ci dessous) confirme que la collection `legal` passe bien par ce plugin.

Tests : le test du build reconstruit le site sans `RENDER` ; il vérifie donc la présence de `[À COMPLÉTER : editeur.nom]` tant que `site.ts` est vide, et le nom réel une fois rempli (le test lit `site.ts` pour savoir quoi attendre). Les cas stricts se testent sur `fillSiteValues` et sur le plugin directement.

### Value sourcing

| Action | Value produced / displayed | Source |
|---|---|---|
| page `/confidentialite` | texte | `src/content/legal/confidentialite.md` |
| titre, description, date | `Politique de confidentialité`, description, `updatedAt` | frontmatter ; `updatedAt` = date du commit du texte final, mise à jour à chaque modification du fond |
| identité de l'éditeur | nom, forme, adresse, pays | `site.publisher` via les balises |
| région d'hébergement | ex. `Union européenne (Francfort, Allemagne)` | `site.dataHosting.region` via la balise |
| pays des autres prestataires | États Unis, France, Bénin | tableau des prestataires de cette spec |
| données, durées, bases légales | tableaux ci dessus | inventaire de cette spec (code au 2026-10-17) |
| durée des traces de paiement | « le temps exigé par nos obligations comptables et fiscales » | décision de cette spec ; chiffre exact fixé par la relecture (AC-11) |
| adresse de contact | `support@nollli.com` | `site.supportEmail` (écrite en clair, vérifiée par un test) |
| strict ou non | échec ou `[À COMPLÉTER …]` | `process.env.RENDER`, lu dans `astro.config.ts` |
| lien dans le pied de page | « Confidentialité » | `footerLinks` |

**Key invariants**:
- Le texte ne décrit que ce que le code fait : toute nouvelle collecte ou tout nouveau prestataire dans l'app ou le backend impose de mettre à jour ce texte et sa date.
- Aucune balise `{{…}}` ne reste dans le HTML construit ; aucune page `[À COMPLÉTER …]` ne part en ligne (le build Render échoue).
- Aucun lien vers une page non construite.

**Security model**: page publique, sans donnée de visiteur. Aucune donnée personnelle dans le dépôt (l'identité de l'éditeur est publique par nature).

**Configuration required**: aucune variable à créer ; `RENDER` est fournie par Render. Valeurs à saisir dans `site.ts` **avant la fusion dans `main`** : `publisher.*` et `dataHosting.region` (visible dans les tableaux de bord Atlas et Render). Nouvelle dépendance de développement : `unist-util-visit` (et ses types).

### Mise en ligne (AC-10), étapes à faire par toi

1. Remplir `publisher` et `dataHosting.region` dans `site.ts`, **avant** de fusionner dans `main` : sinon le build Render échoue et plus rien ne se déploie (c'est voulu).
2. Fusionner `chore/tooling`, `feat/charte-gabarit-commun` et cette feature dans `main`, puis pousser.
3. Render : New, puis Blueprint, choisir le dépôt `devdoud/noli_sit` ; Render lit `render.yaml` et crée `noli-site`. Attendre le premier déploiement vert, puis ouvrir `https://noli-site.onrender.com/confidentialite` (adresse exacte affichée par Render).
4. Domaine : suivre la section « Branchement du domaine (Hostinger) » de la spec 0001 (TTL la veille, CAA, domaine racine dans Render, `A` sur `@`, `CNAME` sur `www`, ne rien toucher d'autre).
5. Lancer `/check verify politique de confidentialité`, qui contrôle AC-10 et les trois points « au premier déploiement » du `verify.md` de la spec 0001.

**Critical test scenarios**:
- Happy path : le build produit `dist/confidentialite.html` avec le titre, la date française, les 15 `h2` dans l'ordre, et aucune balise `{{` restante, verifies **AC-1**, **AC-2**
- Valeurs : `fillSiteValues` remplace les balises connues ; balise inconnue → erreur ; valeur vide → `[À COMPLÉTER : tag]` hors strict, erreur en strict ; le plugin échoue sur une balise dans un code ou l'adresse d'un lien ; la page construite montre la valeur de `site.ts` ou `[À COMPLÉTER …]` si elle est vide, verifies **AC-6**
- Contenu : le HTML contient chaque prestataire de l'inventaire, `support@nollli.com`, « un mois », « APDP », « 13 ans », « cookie », « délégué », « décision automatisée », et ne contient aucune des phrases interdites de AC-4, verifies **AC-3**, **AC-4**, **AC-5**, **AC-7**, **AC-8**, **AC-12**
- Pied de page : un lien « Confidentialité » vers `/confidentialite` sur chaque page, verifies **AC-9**
- En ligne : `curl -I` sur `https://nollli.com/confidentialite`, `http://nollli.com`, `https://www.nollli.com`, une adresse inconnue ; email de test Brevo, verifies **AC-10**

## Build plan

Ordre Tracer Bullet : d'abord le fil complet (collection, route, plugin, page minimale visible en local avec ses valeurs), puis le texte complet, puis la mise en ligne réelle.

1. Créer la collection `legal` (`src/content.config.ts`, loader `glob`, schéma `title`, `description`, `updatedAt` en `z.coerce.date()`) et `src/pages/[slug].astro` (`getStaticPaths` sur la collection, rendu par `LegalLayout`), satisfies **AC-1**
2. Ajouter `publisher` et `dataHosting` à `site.ts`, installer `unist-util-visit`, écrire `site-values.ts` (`siteValues`, `fillSiteValues`, `remarkSiteValues`) et le brancher dans `astro.config.ts` ; vérifier sur une page minimale que la balise est remplacée, satisfies **AC-6**
3. Rédiger `src/content/legal/confidentialite.md` : les 15 sections, depuis l'inventaire, les prestataires et le tableau de contenu, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-5**, **AC-7**, **AC-8**, **AC-12**
4. Ajouter « Confidentialité » à `footerLinks`, satisfies **AC-9**
5. Tests : `fillSiteValues` et le plugin (connus, inconnu, vide, strict, code, adresse de lien) ; build : page, ordre des `h2`, pas de `{{`, valeurs ou `[À COMPLÉTER …]`, prestataires et mots clés, phrases interdites, lien du pied de page, satisfies **AC-1** à **AC-9**, **AC-12**
6. Mise en ligne par toi (étapes ci dessus), puis contrôle en ligne et relecture juridique enregistrée dans `verify.md`, satisfies **AC-10**, **AC-11**

## Consequences

**Positive**:
- La politique dit ce que le code fait vraiment, vérifié ligne à ligne, y compris ce que la fiche oubliait (paiements en attente, contenu des notifications KkiaPay, IP, stockage sur le téléphone, prénom chez Brevo).
- Impossible de publier une politique sans éditeur ni région.
- Le site est enfin en ligne : les pages suivantes se publient par un simple push.

**Negative / tradeoffs**:
- Tant que `publisher` et `dataHosting.region` sont vides, **aucun** déploiement Render ne passe, même pour une autre page. D'où l'étape « remplir avant de fusionner ».
- Un plugin remark maison et une dépendance (`unist-util-visit`) à maintenir.
- Le texte se périme si l'app ou le backend changent sans mise à jour ; seules une règle d'équipe et la relecture le protègent.
- Le cadre béninois (formalités auprès de l'APDP, transferts hors du Bénin) et les garanties de transfert n'ont pas pu être confirmés en ligne : le texte reste prudent, la relecture juridique tranche.
- Le texte promet une limite de conservation des paiements que le backend n'applique pas encore.

**Neutral**:
- Le lien vers `/suppression-compte` n'apparaît dans le texte qu'avec la feature 5, et l'envoi aux stores attend cette page aussi (Google Play exige une adresse de suppression de compte).

## Follow-up

- [ ] Relecture juridique avant l'envoi aux stores (AC-11), en particulier : transferts hors du Bénin et garanties, formalités auprès de l'APDP, bases légales, âge minimum (13 ans est sous le seuil de certains pays de l'UE, 15 ans en France), durée de conservation des paiements.
- [ ] Backend (`../noli-backend`) : ajouter une limite de conservation (TTL) aux traces de paiement et aux paiements en attente, à la durée fixée par la relecture.
- [ ] Vérifier si Noli doit déclarer ses traitements auprès de l'APDP avant le lancement (formalité préalable, gratuite selon l'APDP) : hors site, à faire par l'équipe.
- [ ] Demander à Render la durée de conservation de ses journaux, pour la préciser dans « Ce site web ».
- [ ] Mettre à jour la politique quand Cloudflare Stream, la connexion Google ou la connexion Apple deviennent actifs.
- [ ] Remplir le formulaire « Data safety » de Google Play et les « App Privacy details » d'Apple en cohérence avec cet inventaire (y compris le stockage sur le téléphone).
- [ ] L'app doit afficher un lien vers `https://nollli.com/confidentialite` (profil et inscription) : dans `../noli_app`.
- [ ] `/sync` : règle « toute nouvelle collecte ou prestataire impose de mettre à jour la politique » dans `AGENTS.md` (et dans ceux du backend et de l'app).
