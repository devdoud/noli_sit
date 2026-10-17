# 0003. Politique de confidentialité : raisonnement

Le registre de la décision. La construction se fait à partir de [index.md](index.md).

## Context

Google Play et l'App Store refusent une app sans politique de confidentialité publique. Celle ci doit nommer l'éditeur et un contact, les données collectées et partagées, leurs destinataires, leur conservation et leur suppression, et la façon de retirer son consentement. Elle doit aussi être liée dans l'app (basis: Google Play User Data policy ; App Store Review Guidelines 5.1.1). Noli vise l'Afrique de l'Ouest francophone depuis le Bénin, où le Code du numérique encadre les données personnelles sous le contrôle de l'APDP. Une partie des utilisateurs peut aussi se trouver dans l'Union européenne, donc sous le RGPD (article 13 : identité, finalités et bases légales, destinataires, transferts, durées, droits, réclamation).

La fiche de passation donnait une liste des données. La vérification du code au 2026-10-17 la confirme, et ajoute trois points. Le jeton push est stocké avec la plateforme et la version de l'app. Des recommandations sont calculées à partir de l'historique. L'adresse IP sert à limiter les tentatives de mot de passe oublié sans être stockée. Le code montre aussi des paquets de connexion Google et Apple installés dans l'app mais inutilisés, et Cloudflare Stream est prévu mais pas actif (basis: `noli_app/pubspec.yaml`, schémas de `noli-backend/src`).

Deux informations manquent encore : l'identité exacte de l'éditeur, et la région d'hébergement des données. La page ne doit pas partir en ligne sans elles. C'est aussi la première mise en ligne du site : l'approche Tracer Bullet veut prouver tout le chemin (Render, DNS, HTTPS) avec cette page.

## Options considered

### Option 1 : texte complet fondé sur le code, valeurs injectées depuis `site.ts` par un plugin remark

Le texte est un Markdown de la collection `legal`. Des balises `{{…}}` sont remplacées au build par les valeurs de `site.ts`, et le build Render échoue si une valeur est vide.

**Pros**:
- Une seule source pour l'identité, que les mentions légales réutiliseront.
- Le fichier reste lisible pour la personne qui relit.
- La garde est automatique.

**Cons**:
- Un petit plugin à maintenir.
- Tout déploiement est bloqué tant que les valeurs manquent.

### Option 2 : MDX

On passe en `@astrojs/mdx`, et le texte importe `site.ts`.

**Pros**:
- Officiel et souple.

**Cons**:
- Une intégration de plus.
- Un format moins naturel pour la relecture juridique.
- La spec 0001 avait fixé des `.md`.

### Option 3 : valeurs tapées dans le texte, avec une marque « À COMPLÉTER »

**Pros**:
- Aucun code.

**Cons**:
- L'identité est recopiée dans deux textes (avec les mentions légales).
- On risque d'oublier une copie.

### Option 4 : générateur de politique en ligne

**Pros**:
- Rapide.

**Cons**:
- Un texte générique qui décrit des traitements que Noli ne fait pas, ou en oublie.
- Le résultat est souvent hébergé chez un tiers.

## Rationale

Ce qui compte le plus ici, c'est l'exactitude. Une politique fausse est pire qu'aucune, car elle engage l'éditeur. D'où un texte rédigé depuis un inventaire vérifié dans le code, avec l'interdiction de citer des services non actifs, ce qui écarte l'option 4. L'option 1 garde une seule source pour l'identité de l'éditeur, que les mentions légales réutiliseront. Elle garde aussi le Markdown simple que la spec 0001 avait choisi pour la relecture.

Échouer seulement sur Render, et pas en local, laisse l'équipe construire et tester les autres pages pendant que les valeurs manquent, tout en rendant impossible une publication incomplète. La mise en ligne se fait par toi, pas à pas, parce que l'agent n'a accès ni à Render ni à Hostinger. La procédure DNS est déjà fixée dans la spec 0001.

Le cadre béninois n'a pas pu être confirmé en ligne : les règles de transfert et les formalités auprès de l'APDP restent floues. Le texte reste donc général sur ces points, et la relecture juridique doit les trancher avant l'envoi aux stores.

## References

**Project sources**:
- `HANDOFF.md`, sections données et suppression de compte.
- `noli_app/pubspec.yaml` (dépendances : Firebase Messaging, image_picker, connexion Google et Apple non utilisées).
- `noli-backend/src` : schémas `user`, `device`, `notification` (30 jours), `password-reset` (24 heures), `account-deletion` (3 ans), `watch-history`, `pending-checkout`, `webhook-event` ; `series.service.ts` (`rateSeries`, moyenne seulement) ; `recommendations.service.ts`.
- Spec 0010 du backend (suppression de compte), spec 0001 (mise en ligne), spec 0002 (gabarit).

**Practices & standards**:
- RGPD article 13 (information à fournir), délai de réponse d'un mois.
- Minimisation et exactitude : ne décrire que ce qui est réellement traité.

**Links** (vérifiés le 2026-10-17) :
- Google Play, User Data policy : https://support.google.com/googleplay/android-developer/answer/10144311?hl=en
- Apple, App Store Review Guidelines (5.1.1) : https://developer.apple.com/app-store/review/guidelines/
- APDP, présentation de l'autorité (document de l'APDP) : https://archive.apdp.bj/wp-content/uploads/2022/01/Decouverte_APDP_Pt_YD_re.pdf
- Non vérifiés : le texte du RGPD sur EUR-Lex (page illisible pendant la vérification), le Livre V du Code du numérique (règles de transfert et formalités), le site actuel de l'APDP.
