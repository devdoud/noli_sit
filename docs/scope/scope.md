# Scope: Noli Site

Le site public de Noli sur `nollli.com` : une vitrine qui présente l'app de streaming de séries et renvoie vers les stores, plus les pages légales que Google Play et l'App Store exigent. Pour les personnes en Afrique de l'Ouest francophone qui découvrent Noli, et pour les équipes de revue des stores. Tout est en français. Le site n'appelle pas l'API et n'enregistre aucune donnée. Feature 23 du scope du backend (`../noli-backend/docs/scope/scope.md`).

**Build approach:** Tracer Bullet (une vraie page en ligne sur `nollli.com` de bout en bout d'abord, puis chaque page s'ajoute sur ce chemin déjà prouvé).
**Workflow:** Alpha (après `/develop`, un `/check verify` sur le vrai site). Le niveau de rigueur par défaut du projet. `/architect` reste le premier arrêt conseillé pour une feature qui porte une vraie décision, mais tu peux le sauter si tu sais déjà comment la construire. Une feature peut porter son propre niveau (par exemple `· Beta`).

_Ce sont des recommandations pour garder une construction ordonnée, pas des obligations. Saute ce qui ne colle pas : si tu sais déjà construire une feature, passe directement par `/develop`. C'est toi qui décides quand une feature est `done`._

Choix déjà faits pour tout le site : aucune mesure d'audience (donc aucun cookie ni bandeau de consentement), référencement de base propre (titre, description, image de partage, plan du site), accessibilité aux bases solides (lisible sur petit téléphone, bons contrastes, titres hiérarchisés, clavier, images décrites, proche de WCAG AA sans audit formel). Les textes légaux doivent être relus par une personne qualifiée en droit avant la publication de l'app.

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Pile technique, hébergement et domaine | Foundation | done |
| 2 | Standards et outillage | Foundation | in-progress |
| 3 | Charte visuelle et gabarit commun | Foundation | planned |
| 4 | Politique de confidentialité en ligne | Slice 1 | planned |
| 5 | Page suppression de compte | Slice 2 | planned |
| 6 | Conditions générales d'utilisation | Slice 3 | planned |
| 7 | Mentions légales | Slice 4 | planned |
| 8 | Accueil vitrine | Slice 5 | planned |
| 9 | Contact et aide | Slice 6 | planned |
| 10 | Plan du site et image de partage | Slice 7 | planned |

## Foundations

Pas de modèle de données : le site est fait de pages fixes et n'enregistre rien.

### 1. Pile technique, hébergement et domaine · done · Beta
Choisir comment le site est fait (pages écrites à la main ou générateur de site statique), où il est hébergé (un site statique Render serait cohérent avec le dashboard, voir `../noli_dashboard/render.yaml`) et comment `nollli.com` et `www` pointent vers lui, puis poser un projet vide qui se construit.
**Done when:** la décision est notée dans une spec (pile, hébergeur, enregistrements DNS à ajouter chez Hostinger sans toucher `api`, `admin` ni les enregistrements email Brevo, aucun `CNAME` à la racine), et le projet vide se construit et s'affiche en local.
- [x] Decide the stack (spec): `/architect pile technique, hébergement et domaine`
- [x] Scaffold from the decision: `/develop pile technique, hébergement et domaine`
- [x] Verify it: `/check verify pile technique, hébergement et domaine`
- [x] Test it: `/test pile technique, hébergement et domaine`
spec [0001](../specs/0001-pile-hebergement-domaine/index.md) · code in `./` (`astro.config.ts`, `render.yaml`, `src/`, `scripts/check-no-inline.mjs`)

### 2. Standards et outillage · in-progress
Noter les conventions du projet dans `AGENTS.md` à partir du vrai projet posé, puis installer le formatage et les vérifications choisis.
**Done when:** `AGENTS.md` décrit le vrai projet, `.gitignore` existe en UTF-8, aucun secret n'est suivi, et les vérifications choisies passent.
- [x] Capture conventions + tooling choices: `/audit`
- [x] Install the tooling: `/develop tooling`
- [ ] Verify it: `/check verify standards et outillage`
code in `eslint.config.js`, `.prettierrc.json`, `.husky/pre-commit`, `.gitattributes`, `package.json` (scripts, lint-staged)

### 3. Charte visuelle et gabarit commun · needs a decision
Reprendre les couleurs, la typo et le logo de l'app (`../noli_app/assets/`) et poser le gabarit que toutes les pages partagent : haut de page avec le logo, pied de page avec les liens légaux et l'adresse support, mise en page de texte long lisible.
**Done when:** `design.md` couvre couleurs, typo, espacements et composants (dont les boutons stores « Bientôt disponible »), le gabarit s'affiche bien sur un petit téléphone comme sur un ordinateur, et chaque page reçoit son titre et sa description.
- [ ] Design it (spec): `/architect charte visuelle et gabarit commun`

## Slice 1: première page en ligne

### 4. Politique de confidentialité en ligne · needs a decision
La page qui bloque la publication sur les deux stores, et le premier fil complet : texte, gabarit, hébergement, DNS et HTTPS sur le vrai domaine. Elle prouve tout le chemin pour les pages suivantes. Le contenu part de la liste des données réellement collectées dans `HANDOFF.md`.
**Done when:** `https://nollli.com/confidentialite` répond en HTTPS (et `www` y mène aussi), les emails Brevo partent toujours, la page liste chaque type de donnée collectée, chaque prestataire, les durées de conservation, le cadre légal (Bénin et APDP, RGPD) et les droits avec le contact `support@nollli.com`, et le texte a été relu par une personne qualifiée.
- [ ] Design it (spec): `/architect politique de confidentialité`

## Slice 2: suppression de compte

### 5. Page suppression de compte · needs a decision
La page exigée par Google Play : comment supprimer son compte dans l'app ou sans l'app, ce qui est effacé, ce qui est gardé. Les règles viennent de la spec 0010 du backend.
**Done when:** `https://nollli.com/suppression-compte` explique les deux chemins (dans l'app, ou par email à `support@nollli.com` depuis l'adresse du compte), ce qui est effacé et gardé, la perte du premium sans remboursement, l'email de confirmation et les copies chez les prestataires, en accord avec la spec 0010, et le texte a été relu.
- [ ] Design it (spec): `/architect page suppression de compte`

## Slice 3: conditions d'utilisation

### 6. Conditions générales d'utilisation · needs a decision
Les règles d'usage du service : compte, contenu, abonnement premium payé par KkiaPay, durée, résiliation, suppression de compte.
**Done when:** `https://nollli.com/cgu` couvre l'usage, l'abonnement premium (ce qu'il donne, comment il se paie, ce qui se passe à la fin ou à la résiliation), la suppression de compte et le droit applicable, et le texte a été relu par une personne qualifiée, en priorité la partie paiement.
- [ ] Design it (spec): `/architect conditions générales d'utilisation`

## Slice 4: mentions légales

### 7. Mentions légales · needs a decision
Qui édite le site et qui l'héberge, comme on l'attend dans les pays francophones.
**Done when:** `https://nollli.com/mentions-legales` (adresse à confirmer dans la spec) donne l'éditeur, le contact, le responsable de la publication et l'hébergeur, et elle est liée depuis le pied de page.
- [ ] Design it (spec): `/architect mentions légales`

## Slice 5: accueil

### 8. Accueil vitrine · needs a decision
Une vitrine courte qui donne envie d'installer Noli : logo, phrase d'accroche, 3 ou 4 atouts, captures de l'app, boutons stores.
**Done when:** `https://nollli.com/` présente Noli avec ses atouts et des captures, les boutons Google Play et App Store affichent « Bientôt disponible » et se remplacent en un seul endroit par les vrais liens, et la page charge vite sur une connexion mobile lente.
- [ ] Design it (spec): `/architect accueil vitrine`

## Slice 6: contact et aide

### 9. Contact et aide · needs a decision
Un endroit simple pour joindre le support et trouver les réponses aux questions fréquentes (compte, mot de passe oublié, premium, suppression).
**Done when:** une page donne l'adresse `support@nollli.com` et quelques questions fréquentes justes par rapport à l'app, et elle est liée depuis le pied de page.
- [ ] Design it (spec): `/architect contact et aide`

## Slice 7: référencement et partage

### 10. Plan du site et image de partage
Aider Google à trouver les pages et rendre un lien partagé sur WhatsApp ou Facebook propre, avec l'image et la description de Noli.
**Done when:** un plan du site et un fichier `robots.txt` listent toutes les pages publiques, et un lien vers n'importe quelle page affiche une image et une description correctes à l'aperçu.
- [ ] Build it: `/develop plan du site et image de partage`

## Deferred
Hors de cette première version, gardé ici pour que le plan reste honnête.
- **Vrais liens des stores** : remplacer les boutons « Bientôt disponible » quand l'app est publiée
- **Liens depuis l'app** : l'app pointe vers ces pages (profil, inscription), à faire dans `../noli_app`, pas ici
- **Mesure d'audience** : compter les visites, de préférence sans cookie · needs a decision
- **Section offre premium** : présenter l'abonnement et son prix sur l'accueil · needs a decision
- **Version anglaise** : si Noli vise un public non francophone · needs a decision

## Legend

**La case de décision.** Chaque feature en porte une seule, la sous tâche dont le libellé finit par `(spec)`. Son libellé varie (`Design it (spec)` en général, `Decide the stack (spec)` pour la pile), donc les skills la trouvent par ce suffixe `(spec)`, jamais par un libellé exact. Toutes les autres cases sont des cases d'exécution, et `/architect` n'en coche jamais.

**Cycle de vie d'une feature** : le scope suit la feature, chaque ligne dit ce qu'elle montre et qui la met à jour.

| État | Mis par | La feature montre |
|---|---|---|
| `planned` · needs a decision | `/scope` | une case : `Design it (spec): /architect <feature>` |
| `in-progress` (conçue) | **`/architect` à la capture de la spec** | `Design it` cochée, spec liée, `Build it: /develop <feature>` + **2 à 5 étapes**, puis les cases de fin du niveau (`Verify it` dès Alpha, `Test it` dès Beta, `Review it` + `Document it` en GA) |
| `in-progress` (en construction) | `/develop` | les étapes se cochent une à une, le chemin du code est ajouté |
| `in-progress` (vérifiée) | `/check verify` | `Build it` et ses étapes cochées, `Verify it` cochée |
| `done` | **toi, quand tu le décides** (n'importe quel skill le met si tu le dis), `/sync` réconcilie | les cases passées cochées, celles sautées notées comme sautées ; la dernière étape du niveau (`Prototype` après `/develop`, `Alpha` après `/check verify`, `Beta`/`GA` après `/test`) est le moment conseillé pour dire `done` |

- **Étape suivante** = la première case non cochée (toujours une commande ou une étape suivie).
- **needs a decision** = lancer `/architect` d'abord ; sinon directement `/develop` (ou `/audit` pour les standards). L'étiquette disparaît quand la spec est capturée.
- **Les tâches de construction détaillées vivent dans la section `## Build plan` de la spec**, pas ici : le scope ne garde que les grandes étapes.
- **Statut** `planned` → `in-progress` → `done`, plus `existing` (avant ce workflow) et `dropped` (retiré, gardé pour l'historique).
- **Étiquette d'approche** à côté d'un titre (par exemple `· Facade`) : remplace l'approche du projet pour cette feature ; sans étiquette, elle hérite.
- **Étiquette de niveau** à côté d'un titre (par exemple `· Beta`) : plus ou moins de rigueur que le niveau du projet pour cette feature ; sans étiquette, elle hérite. Elle décide des cases de fin et de ce que chaque skill propose ensuite.
- **Workflow** (ligne d'en tête) : le niveau du projet, ce qui tourne après `/develop`. **Prototype** = rien ; **Alpha** = `/check verify` ; **Beta** = `/check verify` puis `/test` ; **GA** = en plus un `/check review` par un autre modèle, puis `/document`. Une feature construite sur une décision non ratifiée (spec `Assumed`) reste signalée, mais ça ne bloque jamais `done`.
- **Ligne de renvoi** (`spec <n> · code in <chemin>`) : le lien de spec ajouté par `/architect`, le chemin du code par `/develop`.
