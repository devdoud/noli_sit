# 0001. Pile du site public : raisonnement

Le registre de la décision : contexte, options comparées, raisonnement et sources. La construction se fait à partir de [index.md](index.md).

## Context

Noli a besoin d'un site public sur son domaine racine `nollli.com` (avec trois « l »), séparé de l'API (`api.nollli.com`) et du dashboard (`admin.nollli.com`). Le site sert d'abord aux stores : Google Play et l'App Store exigent une politique de confidentialité en ligne, et Google Play exige une page qui explique comment supprimer son compte. Il présente aussi l'app aux visiteurs et renvoie vers les stores (des boutons « Bientôt disponible » tant que l'app n'est pas publiée). Le scope prévoit six pages, toutes en français : accueil, confidentialité, CGU, suppression de compte, mentions légales, contact et aide, plus une page d'erreur, un plan du site et une image de partage (`docs/scope/scope.md`) (basis: docs/scope/scope.md, features 1 à 10).

Les forces en jeu : le contenu est presque entièrement du texte, souvent long (les pages légales), qui doit être relu par une personne qualifiée en droit et modifié sans risque. Les visiteurs sont surtout en Afrique de l'Ouest, souvent sur mobile et parfois sur une connexion lente, donc le poids des pages compte. Le site n'a ni compte, ni formulaire, ni appel à l'API, et le scope a exclu toute mesure d'audience, donc aucun cookie. Il doit être indexé par Google (référencement de base propre) et accessible (bases solides, proche de WCAG AA).

Côté exploitation, l'équipe est très petite et fait déjà tourner l'API et le dashboard sur Render. Le dashboard est un site statique Render décrit par un `render.yaml`, en TypeScript strict, avec npm et Node 22 (basis: ../noli_dashboard/render.yaml et ../noli_dashboard/AGENTS.md). Le DNS de `nollli.com` est chez Hostinger et contient déjà des enregistrements qu'il ne faut pas casser : `api`, `admin` et les enregistrements email de Brevo (code de vérification, DKIM, DMARC). Mettre un `CNAME` sur la racine les casserait (basis: HANDOFF.md, section Domaine et hébergement).

Sans décision, chaque page inventerait sa propre façon d'être faite et mise en ligne, et le branchement du domaine risquerait de casser l'envoi d'emails déjà en place.

## Options considered

Les options comparent des piles complètes. L'hébergement est le même dans les trois premières (site statique Render), parce que c'est le plus cohérent avec les deux autres projets. Les autres hébergeurs étudiés sont résumés à la fin.

### Option 1 : Astro + Tailwind, site statique Render

Un projet Astro en TypeScript strict qui produit du HTML pur au build. Les textes longs vivent dans une collection de contenu Markdown avec un schéma vérifié. Les styles sont écrits en Tailwind, avec le plugin typography pour les textes longs. Render construit et sert le site (basis: Astro, documentation d'installation et référence de configuration).

**Pros**:
- Gabarits partagés : un seul haut et pied de page pour toutes les pages.
- Markdown intégré, avec un schéma qui refuse un texte sans titre ou sans date de mise à jour.
- HTML pur en sortie, donc des pages légères et bien référencées.
- Optimisation des images intégrée.
- Même famille d'outils que le dashboard (Vite, npm, TypeScript).

**Cons**:
- Une chaîne de build et des dépendances npm à maintenir.
- Des versions majeures assez fréquentes.
- Tailwind ajoute une dépendance de plus que du CSS simple.

### Option 2 : HTML et CSS écrits à la main, site statique Render

Six fichiers HTML et une feuille de style, servis tels quels par Render, sans aucun outil de build.

**Pros**:
- Rien à installer, rien à mettre à jour, aucun build qui peut casser.
- Le résultat est exactement ce qui est écrit.

**Cons**:
- Le haut et le pied de page sont copiés dans chaque page (six copies à garder identiques).
- Les longs textes légaux s'écrivent en HTML, ce qui est pénible à relire et à corriger.
- Aucune vérification avant la mise en ligne.
- Pas d'optimisation des images.

### Option 3 : Eleventy, site statique Render

Eleventy (v3, stable) est un générateur statique minimaliste. Il propose des gabarits (Nunjucks, Liquid, JavaScript) et le Markdown intégré (basis: Eleventy, documentation).

**Pros**:
- Très léger et très stable.
- HTML pur en sortie.
- Markdown natif et peu de dépendances.

**Cons**:
- Ses langages de gabarit sont différents de ce que le projet utilise ailleurs.
- Pas de schéma typé pour les textes en standard.
- Il faut ajouter soi même l'optimisation des images et le branchement de Tailwind.

### Option 4 : React + Vite comme le dashboard, site statique Render

Une SPA (application monopage, dont tout l'affichage est fait par JavaScript dans le navigateur), construite avec les mêmes outils que le dashboard.

**Pros**:
- Exactement la même pile que le dashboard, rien de nouveau à apprendre.

**Cons**:
- Les pages s'affichent par JavaScript : plus lourdes, et moins bien lues par les robots de référencement et par les aperçus de liens (WhatsApp, Facebook).
- Il faut une règle de réécriture pour que chaque adresse fonctionne.
- C'est beaucoup de machinerie pour du texte.

### Les autres hébergeurs étudiés

- **Cloudflare Pages** : gratuit et très rapide partout. Mais il faut un compte de plus, et son offre la plus simple demande de confier tout le DNS de `nollli.com` à Cloudflare, donc de déplacer les enregistrements Brevo.
- **Netlify** : gratuit et simple. Mais c'est un compte et un tableau de bord de plus, pour un gain nul par rapport à Render ici.

## Rationale

Le site ne contient que du texte et quelques images, et il doit rester rapide sur mobile, bien référencé et facile à faire relire. C'est le terrain d'un générateur de site statique. L'option 4 (une SPA) est écartée parce qu'elle envoie du JavaScript pour afficher du texte et dégrade le référencement et les aperçus de liens, deux choses que le scope demande (basis: rendu statique pour les pages publiques référencées). L'option 2 (HTML à la main) est la plus simple au premier jour. Mais au jour 180, six copies du pied de page et des textes légaux écrits en HTML rendent chaque correction juridique risquée. Or ces textes seront corrigés après relecture.

Entre Astro et Eleventy, Astro l'emporte pour cette équipe. Il partage Vite, npm et TypeScript avec le dashboard. Sa collection de contenu vérifie chaque texte légal au build, ce qui empêche de publier un texte sans titre ni date de mise à jour. Il optimise les images de l'accueil sans plugin de plus. Il sort du HTML pur, avec Node 22.12 ou plus comme seule exigence (basis: Astro, documentation d'installation). Eleventy ferait le travail aussi bien côté résultat, mais avec des langages de gabarit à part et plus d'assemblage manuel.

Vous avez préféré Tailwind au CSS simple que je recommandais. Pour six pages, du CSS avec variables aurait suffi et évité une dépendance. Tailwind reste un choix sain : il s'intègre directement à Astro par son plugin Vite, il garde les couleurs de Noli au même endroit (`@theme`), et le plugin typography règle d'un coup la mise en forme des longs textes. Le coût à accepter consciemment, c'est une dépendance de plus et une façon d'écrire les styles différente de celle du dashboard, qui utilise Mantine.

Render est retenu pour l'hébergement parce que l'API et le dashboard y sont déjà. Il fournit le HTTPS automatiquement, ajoute et redirige `www` tout seul quand on déclare le domaine racine, et un site statique gratuit ne s'endort pas (basis: Render, documentation des domaines personnalisés, des sites statiques et de l'offre gratuite). Pour la racine, Render demande un enregistrement `A` et pas de `AAAA`. Cela ne touche pas aux enregistrements email, contrairement à un `CNAME` sur la racine (basis: Render, configuration d'un autre fournisseur DNS ; HANDOFF.md). `nollli.com` sans `www` est l'adresse principale, parce que c'est celle qui est déjà écrite dans les textes et promise aux stores.

Les choix plus fins suivent la même logique. Les adresses sans barre finale (`build.format: 'file'`) gardent exactement les adresses promises. Tout le CSS en fichiers rend possible une politique de sécurité stricte, sans `unsafe-inline`. Les polices servies par le site évitent d'envoyer des données de visiteurs à un tiers, ce qui garde la politique de confidentialité simple. Il n'y a pas de prévisualisation par pull request, pour rester simple et gratuit (basis: Astro, référence de configuration ; défense en profondeur par en têtes HTTP).

## References

**Project sources** (verifiable, in this repo or its neighbours):
- `HANDOFF.md` : pages, domaine, DNS existant chez Hostinger, règle du `.gitignore` en UTF-8.
- `docs/scope/scope.md` : features 1 à 10, choix sans mesure d'audience, référencement de base, accessibilité, niveau Alpha.
- `../noli_dashboard/render.yaml` et `../noli_dashboard/AGENTS.md` : modèle d'hébergement Render, TypeScript strict, npm, Node 22.
- `../noli-backend/docs/scope/scope.md`, feature 23 : le site vu depuis le backend.

**Practices & standards**:
- Rendu statique pour les pages publiques référencées.
- Défense en profondeur par en têtes HTTP (CSP, HSTS, X-Frame-Options, nosniff).
- Garder les adresses publiques stables une fois promises (stores, app).

**Links** (vérifiés pendant la conversation de conception, le 2026-10-13) :
- Astro, installation (Node 22.12 ou plus) : https://docs.astro.build/en/install-and-setup/
- Astro, référence de configuration (`build.format`) : https://docs.astro.build/en/reference/configuration-reference/
- Eleventy, documentation (v3 stable) : https://www.11ty.dev/docs/
- Render, domaines personnalisés (www ajouté et redirigé) : https://render.com/docs/custom-domains
- Render, configurer un autre fournisseur DNS (racine en `A`, retirer les `AAAA`) : https://render.com/docs/configure-other-dns
- Render, sites statiques (certificats HTTPS automatiques) : https://render.com/docs/static-sites
- Render, en têtes des sites statiques : https://docs.render.com/static-site-headers
- Render, redirections et réécritures : https://render.com/docs/redirects-rewrites
- Render, offre gratuite (plafonds, suspension, pas de mise en veille des sites statiques) : https://render.com/docs/free
