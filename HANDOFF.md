# Noli Site · fiche de passation

Ce dossier accueille le **site public de Noli**, sur le domaine racine **`nollli.com`** (avec trois « l »). C'est un site séparé du backend, du dashboard et de l'app mobile. Cette fiche donne à une nouvelle session Claude le contexte nécessaire pour démarrer. Elle ne contient aucun secret.

Feature correspondante dans le scope du backend : **23. Public Site & Legal Pages** (`../noli-backend/docs/scope/scope.md`, tranche « Slice 4 : Store launch readiness »).

## Le produit

Noli est une plateforme de streaming de séries pour l'Afrique de l'Ouest francophone :
- une app mobile Flutter (`../noli_app`) ;
- une API NestJS sur `https://api.nollli.com` (`../noli-backend`) ;
- un dashboard admin sur `https://admin.nollli.com` (`../noli_dashboard`).

Tout est en **français**.

## Ce que le site doit contenir

| Page | Adresse | Rôle |
|---|---|---|
| Accueil | `https://nollli.com/` | présenter Noli et proposer le téléchargement (boutons Google Play et App Store) |
| Politique de confidentialité | `https://nollli.com/confidentialite` | **obligatoire** pour Google Play et l'App Store |
| Conditions générales d'utilisation | `https://nollli.com/cgu` | règles d'usage, abonnement premium, résiliation |
| Suppression de compte | `https://nollli.com/suppression-compte` | **exigée par Google Play** : comment supprimer son compte et ses données |

Les liens des stores n'existent pas encore, car l'app n'est pas publiée. Prévoir des boutons « Bientôt disponible », faciles à remplacer. Identifiants de l'app : Android `com.noli.noli_app`, iOS `com.noli.noliApp`.

Ressources de marque : `../noli_app/assets/brand/` (logos Google et Apple pour les boutons), `../noli_app/assets/images/`. Les couleurs et le style sont à reprendre de l'app ou du dashboard.

## Ce que l'app collecte vraiment (base de la politique de confidentialité)

**Données de compte**
- email, nom d'utilisateur, prénom et nom (facultatifs) ;
- mot de passe, stocké seulement sous forme chiffrée (bcrypt) ;
- photo de profil (facultative).

**Données d'usage**
- historique de visionnage et progression ;
- notes données aux séries (stockées seulement comme une moyenne anonyme) ;
- réglages des notifications ;
- identifiants de téléphone pour les notifications push.

**Abonnement**
- formule (gratuite ou premium), dates de début et de fin ;
- identifiant de la dernière transaction.
- Le paiement passe par **KkiaPay** (mobile money et carte) : Noli ne voit jamais le numéro de carte. KkiaPay transmet le numéro mobile money dans ses notifications de paiement, et il est retiré si le compte est supprimé.

**Prestataires (sous-traitants)**
- **MongoDB Atlas** : base de données.
- **Render** : hébergement de l'API et des sites.
- **Cloudinary** : images et photos de profil.
- **Brevo** : emails, comme les codes de mot de passe oublié, les alertes et la confirmation de suppression.
- **Firebase Cloud Messaging (Google)** : notifications push.
- **KkiaPay** : paiements.
- **Cloudflare Stream** : vidéos (prévu, pas encore actif).

**Durées de conservation**
- codes de mot de passe oublié : 24 heures ;
- notifications : 30 jours ;
- tout le reste : tant que le compte existe.
- Après une suppression de compte : les traces de paiement sont gardées **sans lien avec la personne**, pour la comptabilité. Un journal de suppression, sans donnée personnelle, est gardé 3 ans.

**Cadre légal**
- la loi du pays de l'utilisateur sur les données personnelles. Au Bénin, c'est le Code du numérique, avec l'APDP (Autorité de Protection des Données Personnelles) ;
- le RGPD européen pour les utilisateurs dans l'Union européenne.
- Droits : accès, rectification, suppression.
- Contact : `support@nollli.com` (la boîte est encore à mettre en place côté domaine).

## Règles de la suppression de compte (spec 0010 du backend, base de la page `/suppression-compte`)

- **Dans l'app** : la suppression est immédiate et définitive après confirmation par le mot de passe (Profil, puis Supprimer mon compte).
- **Sans l'app** : écrire à `support@nollli.com` **depuis l'adresse du compte**. Un admin traite la demande.
- **Ce qui est effacé** : le compte, l'historique, les notifications, les appareils, les photos, les demandes de mot de passe oublié.
- **Ce qui est gardé** : les traces de paiement, anonymisées (sans nom, email ni numéro), et un journal sans donnée personnelle.
- **Premium** : un abonnement en cours est **perdu sans remboursement**.
- **Après** : un email confirme la suppression, et la même adresse peut recréer un compte vide.
- **Chez les prestataires** : des copies restent le temps de leur propre conservation (journaux d'envoi Brevo, copies en cache Cloudinary, dossiers KkiaPay).

Les textes doivent être **relus par une personne qualifiée en droit** avant la publication de l'app, surtout les CGU liées au paiement.

## Domaine et hébergement (déjà en place côté DNS)

- **DNS chez Hostinger** (zone `nollli.com`). Existent déjà :
  - `api` (CNAME vers l'API) ;
  - `admin` (CNAME vers le dashboard) ;
  - les enregistrements email de Brevo (`brevo-code`, DKIM `brevo1` et `brevo2`, DMARC).
- **Ne rien supprimer.** Pour ce site, il faudra **ajouter** :
  - à la racine `@`, ce que l'hébergeur demande pour un domaine racine (souvent un enregistrement `A`) ;
  - un `www` (souvent un `CNAME`).
  - Il ne faut pas de `CNAME` à la racine, ça casserait les enregistrements email.
- **Hébergement :** à décider dans `/architect`. Les deux autres projets sont sur **Render** (le dashboard est un site statique Render, voir `../noli_dashboard/render.yaml` comme modèle). Un site statique Render gratuit est le choix le plus cohérent.
- **CORS :** le site n'appelle pas l'API, donc rien à ajouter côté backend.

## Ce qui reste à décider (dans la nouvelle session)

La technique (HTML et CSS simples, ou un générateur de site statique), l'hébergement, le design, et le contenu exact de chaque page. C'est le rôle de `/scope` puis `/architect`. Rien ne doit être installé avant.

## Comment démarrer

Dans une nouvelle session Claude Code ouverte **dans ce dossier** :
1. `Lis HANDOFF.md`.
2. `/scope`, en décrivant le site en une phrase.
3. `/architect` pour la pile, l'hébergement et le contenu des pages.
4. `/develop`, puis une mise en ligne sur `nollli.com`.

## Règles reprises des autres projets

- Créer `.gitignore` en **UTF-8** (un `.gitignore` en UTF-16 avait laissé passer `.env` dans le backend).
- Aucun secret dans le dépôt.
- Communication en français.
