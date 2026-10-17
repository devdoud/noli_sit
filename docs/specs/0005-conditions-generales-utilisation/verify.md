# Verify: conditions générales d'utilisation · spec 0005 · updated 2026-10-17
_Steps derived from spec 0005 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [ ] Ouvrir `http://localhost:4321/cgu` (puis `https://nollli.com/cgu` une fois en ligne) → titre « Conditions générales d’utilisation », date « Mis à jour le … », un seul `h1` → AC-1
- [ ] Parcourir les titres → 14 sections dans l'ordre de la spec, de « Objet et acceptation » à « Nous contacter » → AC-2
- [ ] Lire « Objet et acceptation » → éditeur rempli depuis `site.ts` (Nollli Studio, SARL, Cotonou, Bénin), aucun `{{` ni `[À COMPLÉTER` → AC-3
- [ ] Lire tout le texte → « vous » partout, aucun « tu », « ton », « ta », « t’ » → AC-3
- [ ] « Le service » → Gratuit = séries non premium en entier plus les épisodes gratuits d'une série premium (nombre par série, peut être nul) ; Premium = tout ; aucune date de sortie promise → AC-4 (source : `content-access.ts`, `freeEpisodeCount ?? 0`)
- [ ] « Votre compte » → email consultable, nom d'utilisateur de 3 à 30 caractères, mot de passe sans longueur promise, 13 ans déclarés, accord parental avant 18 ans pour le premium → AC-5 (source : `create-user.dto.ts`, spec 0003)
- [ ] « Utilisation des contenus » → usage privé, liste des usages interdits du brouillon → AC-6
- [ ] « L’abonnement premium » → paiement pas encore ouvert ; prix affiché avant tout paiement ; KkiaPay ; 30 jours par paiement ; pas de renouvellement automatique ; empilement sur la date de fin si elle n'est pas passée ; un jour de plus ; rappels désactivables ; « sans remboursement, sauf erreur de paiement » avec les trois cas et 72 heures ; numéro de transaction ; réponse sous un mois ; premium perdu à la suppression ; changement de prix annoncé ; droits du consommateur réservés → AC-7
- [ ] Changer `BILLING_PERIOD_DAYS` ou `BILLING_GRACE_PERIOD_DAYS` dans `noli-backend/src/billing/billing.constants.ts` (en lecture seulement, pour l'exercice) → le texte doit être relu et corrigé : il affirme 30 jours et un jour de grâce → AC-7, AC-13
- [ ] Vérifier dans `billing.service.ts` que le crédit part de `max(endDate, now)` → correspond à « s’ajoutent à la date de fin … sinon à partir du jour du paiement » → AC-7
- [ ] Vérifier dans `notifications.scheduler.ts` que les rappels premium respectent `notificationPrefs.premium` → « Vous pouvez les désactiver » est vrai → AC-7
- [ ] « Supprimer votre compte » → cliquer le lien → arrive sur `/suppression-compte` → AC-8
- [ ] « Modifications des conditions » → préavis de 30 jours, sauf obligation légale ou point mineur ; « Droit applicable et litiges » → droit du Bénin, solution amiable par support@nollli.com, tribunaux du siège de l'éditeur, protection du consommateur réservée → AC-9
- [ ] « Suspension du compte », « Disponibilité et responsabilité », « Propriété intellectuelle » → avertissement par email sauf urgence, contestation par email, force majeure, signalement de contrefaçon, licence de la photo de profil → AC-10
- [ ] « Dispositions générales » → clause non valable isolée, version française prévaut, clauses qui survivent → AC-11
- [ ] Pied de page de chaque page (accueil, 404, confidentialité, CGU, suppression) → « Conditions d’utilisation » entre « Confidentialité » et « Suppression de compte », mène à `/cgu` → AC-12
- [ ] Au clavier (Tab) sur `/cgu` → lien d'évitement, liens du texte et du pied de page atteignables avec un focus visible → spec 0002
- [ ] Relecture par une personne qualifiée en droit, section premium d'abord (remboursement, droit de rétractation dans l'UE, responsabilité, droit applicable), avant l'envoi de l'app aux stores → AC-13

## Commands
- [ ] `npm run build` → « 5 pages contrôlées », aucune erreur → AC-1
- [ ] `RENDER=true npm run build` → réussit (éditeur rempli) → AC-3
- [ ] `npm test` → bloc « terms of use page (spec 0005) » au vert → AC-1 à AC-12
- [ ] `curl -sI https://nollli.com/cgu` après déploiement → `200`, en tête `content-security-policy` présent → AC-1

## Acceptance-criteria coverage
- AC-1 … étapes 1, build, curl · AC-2 … étape 2 · AC-3 … étapes 3, 4, build Render · AC-4 … étape 5 · AC-5 … étape 6 · AC-6 … étape 7 · AC-7 … étapes 8 à 11 · AC-8 … étape 12 · AC-9 … étape 13 · AC-10 … étape 14 · AC-11 … étape 15 · AC-12 … étape 16 · AC-13 … étapes 9 et 18 (relecture juridique)
