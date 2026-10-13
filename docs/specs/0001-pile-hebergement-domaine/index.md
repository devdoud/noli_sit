# 0001. Pile du site public : Astro + Tailwind, site statique Render sur nollli.com

**Date**: 2026-10-13
**Status**: In Progress

## Summary

Le site public de Noli sera fabriqué avec Astro, un générateur de site statique : toutes les pages deviennent du HTML pur au moment du build, sans JavaScript envoyé au navigateur. Il est écrit en TypeScript strict, avec les styles en Tailwind et les longs textes légaux en fichiers Markdown faciles à relire. Il est hébergé comme site statique gratuit sur Render, comme le dashboard, et servi sur `https://nollli.com` (avec `www` qui redirige). Concrètement, chaque page du scope s'ajoute sur ce socle, et le branchement du domaine se fait en ajoutant deux enregistrements chez Hostinger sans toucher à `api`, `admin` ni aux emails Brevo.

## Decision

**Chosen option**: Option 1 : Astro + Tailwind, site statique Render

Le site est un projet Astro en TypeScript strict, stylé avec Tailwind, avec les textes longs en Markdown, construit par Render à chaque push sur `main` et servi sur `https://nollli.com`.

**Implementation skills**: `astro` (`astrolicious/agent-skills`, `.claude/skills/astro/`) · `tailwind-design-system` (`wshobson/agents`, `.claude/skills/tailwind-design-system/`)

Le skill `astro` décrit aussi les adaptateurs (pour le rendu côté serveur) : ce site n'en utilise **aucun**, il reste en `output: 'static'`. Pour l'API exacte d'Astro, le serveur MCP Astro Docs fait foi (voir Follow-up).

## Rationale

Le raisonnement et les options comparées sont dans [rationale.md](rationale.md).

## Proposed stack

Versions connues au 2026-10-13. Ce domaine bouge vite : au scaffold, prenez la dernière version majeure stable de chaque outil et notez les versions réelles dans `package.json` (Astro est probablement en v7, pas confirmé).

| Layer | Choice | Reason |
|---|---|---|
| Type de site | Site statique pré généré (tout le HTML est produit au build), zéro JavaScript côté navigateur | Six pages de texte et de présentation, sans compte ni appel à l'API : rien à exécuter côté serveur ni dans le navigateur. |
| Langage | TypeScript en mode strict (préréglage `strict` d'Astro), avec `astro check` lancé avant chaque build | Comme le backend et le dashboard ; une erreur de type ou un texte Markdown mal rempli bloque la mise en ligne au lieu de partir en production. |
| Runtime | Node 22 (22.12 ou plus), fixé dans `.nvmrc`, `package.json` (`engines`) et la variable `NODE_VERSION` de Render | La version minimale demandée par Astro, et la même que le dashboard. |
| Gestionnaire de paquets | npm, avec `package-lock.json` commité, `npm ci` sur Render | Comme les autres projets ; des builds reproductibles. |
| Générateur | Astro, dernière majeure stable, sortie `output: 'static'` | Gabarits partagés (un seul haut et pied de page pour toutes les pages), Markdown intégré, HTML pur en sortie. |
| Adresse du site | `site: 'https://nollli.com'` dans `astro.config` | Sert aux adresses canoniques et, plus tard, au plan du site (feature 10). |
| Forme des adresses | `build.format: 'file'` et `trailingSlash: 'never'` : la page `cgu` donne `dist/cgu.html`, servie à `/cgu` | Les adresses restent exactement celles promises aux stores et à l'app (`/confidentialite`, `/cgu`, `/suppression-compte`), sans barre finale. |
| Adresses fixées | `/` (accueil), `/confidentialite`, `/cgu`, `/suppression-compte`, `/mentions-legales`, `/contact`, toutes listées dans `src/config/site.ts` (objet `routes`) que le haut, le pied de page et les liens utilisent | Une adresse promise aux stores ou écrite dans l'app ne change jamais ; un seul endroit les déclare. |
| Textes longs | Collection de contenu Astro `legal`, chargée par `glob({ pattern: '**/*.md', base: './src/content/legal' })` : un fichier `src/content/legal/<adresse>.md` par texte, dont le nom **est** l'adresse publique. Schéma : `title` (texte), `description` (texte), `updatedAt` (`z.coerce.date()`), tous obligatoires. Une seule page dynamique `src/pages/[slug].astro` les affiche via `getStaticPaths` | Un fichier par page, lisible par la personne qui fait la relecture juridique ; le schéma refuse un texte sans titre ni date ; ajouter un texte légal ne demande aucun code. |
| Rendu du Markdown | Markdown standard avec tableaux (GFM) ; **pas de HTML brut** dans les fichiers ; pas de sommaire ni d'ancres de titres pour l'instant ; la date `updatedAt` s'affiche en français (`Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' })`) | Du HTML brut pourrait apporter un `style` ou un `script` en ligne que la CSP bloquerait ; le reste est l'affaire de chaque page légale. |
| Langue | `<html lang="fr">` dans `BaseLayout` | Lecteurs d'écran et moteurs de recherche lisent la page en français. |
| Styles | Tailwind CSS v4 branché par `@tailwindcss/vite`, avec un fichier `src/styles/global.css` qui importe Tailwind et déclare les couleurs et espacements de Noli dans `@theme` | Le choix que vous avez fait ; les valeurs exactes viennent de la charte (feature 3). |
| Mise en forme des textes longs | `@tailwindcss/typography` (classes `prose`), ajusté aux couleurs de Noli | Titres, listes et tableaux du Markdown lisibles d'un coup, sans styles écrits à la main. |
| CSS dans des fichiers | `build.inlineStylesheets: 'never'` | Tout le CSS sort en fichiers, ce qui permet une politique de sécurité stricte (`style-src 'self'`, sans `unsafe-inline`). |
| Aucune ressource intégrée | `vite.build.assetsInlineLimit: 0` | Sinon Vite transforme les petits fichiers (une police de moins de 4 Ko, par exemple) en `data:` dans le CSS, que `font-src 'self'` bloquerait sans rien dire. |
| Images | Composant `<Image>` d'Astro (`astro:assets`), service par défaut (sharp), images sources dans `src/assets/`, toujours avec `alt` ; **sans** les options `layout` ni `fit` (elles ajoutent un `style=""` que la CSP bloque). Le favicon va dans `public/` | Images redimensionnées et compressées au build : la page reste légère sur une connexion mobile lente. |
| Polices | Fichiers de police servis par le site lui même et passés par le build (ils sortent dans `/_astro/`), jamais de police Google en ligne ; le choix de la police et la façon de l'importer appartiennent à la charte (feature 3) | La politique de sécurité n'autorise que le site (`font-src 'self'`), et aucune donnée de visiteur ne part chez un tiers. |
| Réglages partagés | Un fichier `src/config/site.ts` : nom, adresse support (`support@nollli.com`), adresses des pages (`routes`), liens des stores (vides pour l'instant, donc « Bientôt disponible ») | Un seul endroit à modifier le jour où l'app est publiée. |
| Page d'erreur | `src/pages/404.astro`, aux couleurs de Noli, avec un lien vers l'accueil | Une adresse fausse reste dans l'univers du site. |
| Mesure d'audience, cookies | Aucune | Choix du scope : pas de cookie, donc pas de bandeau de consentement. |
| Suivi | Aucun service pour l'instant ; journaux de déploiement de Render | Un site statique tombe très rarement ; à revoir au lancement des stores. |
| Tests | Pas de suite de tests par défaut (niveau Alpha) ; `astro check` et le build servent de garde fou. La feature 1 étant en `Beta`, `/test` y ajoute un contrôle léger du résultat du build | Un site sans logique : le risque est dans le contenu et la mise en ligne, que `/check verify` contrôle sur le vrai site. |
| Lint, formatage, contrôles avant commit | À décider par `/audit` puis `/develop tooling` (feature 2) | Choisis à partir du vrai projet une fois le scaffold fait. |
| Versionnage | Nouveau dépôt GitHub dédié, branche `main`, `.gitignore` en UTF-8 qui liste au moins `node_modules/`, `dist/`, `.astro/` et `.env*` | Comme le backend et le dashboard ; un `.gitignore` en UTF-16 avait laissé passer `.env` dans le backend. |
| Hébergement | Render Static Site (offre gratuite), décrit dans un `render.yaml` calqué sur celui du dashboard ; déploiement automatique à chaque push sur `main`, pas de prévisualisation par pull request | Même compte que l'API et le dashboard, HTTPS automatique, ne s'endort pas. |
| Domaine | `nollli.com` est l'adresse principale ; `www.nollli.com` redirige vers elle | Adresse la plus courte, déjà écrite dans les textes et promise aux stores. |

### Organisation du code

```
src/
  pages/          index.astro, [slug].astro (les textes légaux), contact.astro, 404.astro
  content/legal/  un fichier Markdown par texte légal (confidentialite.md, cgu.md, suppression-compte.md, mentions-legales.md)
  content.config.ts  la collection legal (loader glob, schéma title, description, updatedAt)
  layouts/        BaseLayout.astro (lang fr, balises head, titre, description, haut et pied de page) ; LegalLayout.astro (texte long en prose, date de mise à jour)
  components/     Header, Footer, StoreButtons, et les blocs de l'accueil
  assets/         images sources (logo, captures), optimisées au build
  config/site.ts  nom, adresse support, adresses des pages, liens des stores
  styles/global.css  @import "tailwindcss", @plugin "@tailwindcss/typography", @theme aux couleurs de Noli ; importé par BaseLayout
public/           favicon, et plus tard robots.txt et l'image de partage (feature 10)
```

`src/content.config.ts` est le nom valable depuis Astro 5, qui exige aussi un `loader` explicite : si la version installée dit autre chose, suivez sa documentation (le serveur MCP Astro Docs). La page contact est une page `.astro` à part, pas un texte de la collection `legal`.

### Configuration du projet

- **`astro.config.ts`** : `site: 'https://nollli.com'`, `output: 'static'`, `trailingSlash: 'never'`, `build: { format: 'file', inlineStylesheets: 'never' }`, `vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } }`, `devToolbar: { enabled: false }`, `prefetch: false`. `compressHTML` reste à sa valeur par défaut (activé). Aucun adaptateur.
- **`tsconfig.json`** : étend `astro/tsconfigs/strict`.
- **`package.json`** : `engines.node` à `>=22.12`, scripts `dev` (`astro dev`), `check` (`astro check`), `build` (`astro check && astro build && node scripts/check-no-inline.mjs`), `preview` (`astro preview`). Dépendances de dev au moins `@astrojs/check` et `typescript`. `.nvmrc` à `22`.
- **Contrôle après build** (`scripts/check-no-inline.mjs`) : parcourt `dist/**/*.html` et fait échouer le build s'il trouve une balise `<script>`, une balise `<style>` ou un attribut `style=`. C'est le garde fou de la CSP, puisque `astro preview` en local n'applique pas les en têtes de `render.yaml`.

### Règles pour garder la CSP valide

Le site n'envoie **aucun JavaScript** au navigateur. Concrètement :

- Pas de balise `<script>` dans les fichiers `.astro`, ni `is:inline`, ni `define:vars`, ni `set:html` avec du code. Si un jour un script devient nécessaire, il vit dans un fichier `.ts` importé à part, et la spec concernée le décide.
- Pas de transitions de page (`<ClientRouter />`), pas de préchargement, pas de composant d'une autre bibliothèque (React, Vue) hydraté dans le navigateur.
- Pas d'attribut `style=""` dans le HTML : tout passe par des classes Tailwind.
- Pas de HTML brut dans les fichiers Markdown.

Le contrôle après build fait respecter ces règles automatiquement.

### Hébergement sur Render

Le `render.yaml` reprend la forme de celui du dashboard (`../noli_dashboard/render.yaml`), avec ces différences :

- Service `name: noli-site`, `runtime: static`, `buildCommand: npm ci && npm run build`, `staticPublishPath: ./dist`, `NODE_VERSION` à `22.12.0` ou une version 22 plus récente (pas seulement `22`, pour respecter le minimum d'Astro). Déploiement automatique sur la branche `main` (le comportement par défaut de Render). Le dépôt se relie depuis le tableau de bord Render (Blueprint).
- **Pas de règle de réécriture vers `index.html`** (ce n'est pas une SPA : chaque adresse a son propre fichier).
- **Pas de `X-Robots-Tag: noindex`** : le site doit être trouvé par Google.
- En têtes sur `/*` :
  - `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`
  - `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security: max-age=31536000` (sans `includeSubDomains`, pour ne rien imposer à `api` ni `admin`)
- En tête sur `/_astro/*` (les fichiers à nom unique produits par Astro) : `Cache-Control: public, max-age=31536000, immutable`. Les pages HTML et les fichiers de `public/` (noms fixes) gardent le comportement par défaut de Render, sans cache long, pour qu'une correction de texte se voie tout de suite.
- Vérifiez avec `curl -I` après le premier déploiement que `Strict-Transport-Security` n'apparaît pas deux fois (Render peut déjà l'envoyer) ; si c'est le cas, retirez la ligne du `render.yaml`.
- Les clés `headers` et `routes` du `render.yaml` marchent déjà pour le dashboard ; vérifiez quand même la référence `render.yaml` de Render au moment d'écrire le fichier.

**Deux points à contrôler au premier déploiement** (non confirmés dans la doc de Render) :

1. **Adresses sans `.html`** : `curl -I https://nollli.com/cgu` doit répondre `200`. Si Render ne sert pas `cgu.html` tout seul pour `/cgu`, ajoutez une règle `rewrite` par page dans `routes` (`/cgu` vers `/cgu.html`, et ainsi de suite). Une page existante passe avant les règles, donc ces réécritures ne cassent rien.
2. **Page 404** : une adresse inconnue doit afficher `404.html` avec le code `404`. Sinon, ajoutez une règle qui le fait, ou acceptez la page par défaut de Render et notez le dans la spec.

### Branchement du domaine (Hostinger)

À faire dans cet ordre, au moment de la mise en ligne de la feature 4 :

0. **La veille** : chez Hostinger, baissez la durée de cache (TTL) des enregistrements `@` et `www` à 300 secondes, pour qu'une erreur se corrige vite. Regardez aussi s'il existe des enregistrements `CAA` (ils disent quelles autorités peuvent délivrer un certificat pour le domaine). S'il y en a, ils doivent autoriser `letsencrypt.org` et `pki.goog`, sinon Render ne pourra pas émettre le certificat HTTPS. Sans `CAA`, rien à faire.
1. Dans Render, ajoutez le domaine personnalisé `nollli.com` (la racine, en premier) au site statique. Render ajoute `www.nollli.com` tout seul et le fait rediriger vers `nollli.com`. Notez les valeurs exactes que Render affiche : elles font foi si elles diffèrent de ce qui suit.
2. Dans la zone DNS de `nollli.com` chez Hostinger, **regardez d'abord ce qui existe sur `@` et `www`**. Remplacez seulement les enregistrements de parking Hostinger sur ces deux noms (`A`, `AAAA`, `ALIAS` ou `CNAME`), s'il y en a :
   - `@` : un enregistrement `A` vers l'adresse IP que Render donne pour les domaines racine (`216.24.57.1` selon sa doc, à confirmer dans son tableau de bord). **Supprimez tout `AAAA` sur `@`**, comme Render le demande.
   - `www` : un `CNAME` vers l'adresse `<service>.onrender.com` que Render affiche.
   - Si un « site web » Hostinger est rattaché au domaine, détachez le : il peut remettre la page d'attente tout seul.
3. **Ne touchez jamais** à `api`, `admin`, `brevo-code`, `brevo1._domainkey`, `brevo2._domainkey`, `_dmarc`, ni aux enregistrements `MX` ou `TXT` existants. **Aucun `CNAME` sur `@`** : il casserait les enregistrements email.
4. Attendez que Render valide le domaine et émette le certificat HTTPS (automatique), puis contrôlez : `https://nollli.com/confidentialite` répond, `http://` et `www` redirigent vers `https://nollli.com`, et un email de test Brevo part toujours.

## Consequences

**Positive**:
- Pages très légères (HTML et CSS seulement), rapides sur mobile et bien lues par Google.
- Un seul gabarit pour toutes les pages : le haut, le pied de page et les liens légaux se changent en un endroit.
- Les textes légaux sont de simples fichiers Markdown que la personne chargée de la relecture peut lire et annoter.
- Même hébergeur et même forme de `render.yaml` que le dashboard : rien de nouveau à apprendre côté mise en ligne.
- Pas de serveur, pas de base, pas de secret : presque rien ne peut tomber ni fuiter.

**Negative / tradeoffs**:
- Un outil de build et des dépendances npm (Astro, Tailwind) à garder à jour, là où du HTML écrit à la main n'en aurait aucune.
- Tailwind ajoute une dépendance et une façon d'écrire les styles différente du dashboard (Mantine). Pour six pages, du CSS simple aurait suffi.
- Astro change de version majeure environ une fois par an : chaque mise à jour peut demander un petit passage par son guide de migration.
- L'offre gratuite de Render a un plafond mensuel de bande passante et de minutes de build partagé avec les autres services. S'il est dépassé sans moyen de paiement enregistré, Render suspend les services gratuits jusqu'au mois suivant.
- Sans prévisualisation par pull request, la relecture juridique se fait en local ou sur les fichiers Markdown, pas sur une adresse en ligne.
- Deux comportements de Render (adresses sans `.html`, page 404) ne sont pas confirmés par sa doc et doivent être vérifiés au premier déploiement.

**Neutral**:
- La boîte `support@nollli.com` ajoutera plus tard des enregistrements `MX` sur `@`. Ils cohabitent sans souci avec l'enregistrement `A` du site.
- La politique de sécurité interdit tout script en ligne dans la page. Si un jour un petit script est nécessaire, il doit être un fichier à part (`script-src 'self'`).
- Aucun changement côté backend : le site n'appelle pas l'API, donc rien à ajouter au CORS.

## Follow-up

- [ ] Créer le dépôt GitHub du site et le relier à Render au moment du scaffold (`/develop pile technique, hébergement et domaine`).
- [ ] Au premier déploiement, contrôler les adresses sans `.html` et la page 404 sur Render (voir *Hébergement sur Render*), et compléter `render.yaml` si besoin.
- [ ] Mettre en place la boîte `support@nollli.com` avant que les pages légales soient publiées : elles la citent partout.
- [ ] Revoir le suivi de disponibilité au lancement des stores.
- [ ] Pour la spec de la charte (feature 3) : règles d'accessibilité (lien d'évitement, contour de focus visible, `prefers-reduced-motion`, contrastes vérifiés, un seul `<h1>` par page, convention des `alt`), choix et import de la police, balises du `head` (adresse canonique sans barre finale, description, `theme-color`).
- [ ] Pour la feature 8 (accueil) : boutons stores inactifs en `<span aria-disabled="true">`, jamais un lien `href="#"`.
- [ ] Pour la feature 9 (contact) : un simple lien `mailto:` vers l'adresse support, sans formulaire ni adresse masquée.
- [ ] Pour la feature 10 : balises `og:*` et image de partage, `robots.txt`, plan du site (avec `@astrojs/sitemap`, réglé pour `format: 'file'`).
- [ ] Brancher le serveur MCP officiel **Astro Docs** (gratuit, sans compte) avant le scaffold, pour que l'agent lise la doc à jour : `claude mcp add --transport http astro-docs https://mcp.docs.astro.build/mcp` (commande exacte à confirmer sur la page « Build with AI » de la doc Astro).
- [ ] Brancher le serveur MCP officiel **Render** (`https://mcp.render.com/mcp`, en HTTP) au moment de la mise en ligne. Il demande une clé d'API Render passée dans un en tête `Authorization` : vérifiez le format exact dans la doc de Render, et gardez la clé hors du dépôt.
- [ ] Conventions des skills `astro` et `tailwind-design-system` pas encore dans un `AGENTS.md` racine (il n'existe pas encore) : `/audit` (feature 2) les y référence dans `## Agent skills`, avec la ligne `MCP servers:` (Astro Docs, Render). Aucun skill Render fiable trouvé (adoption trop faible), donc aucun installé.
