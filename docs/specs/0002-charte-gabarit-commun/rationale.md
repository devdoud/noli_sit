# 0002. Charte visuelle et gabarit commun : raisonnement

Le registre de la décision. La construction se fait à partir de [index.md](index.md).

## Context

Le site public doit inspirer confiance aux visiteurs qui découvrent Noli et aux équipes de revue des stores. Il doit aussi être reconnu comme le site de l'app. L'app a déjà un design system abouti (spec 0005 de l'app, `noli_app/lib/core/theme/app_theme.dart`) : un fond obsidienne, une couleur ambre safran, un violet secondaire, une grille de 4, des arrondis précis, et deux polices embarquées (Bricolage Grotesque pour les titres, Plus Jakarta Sans pour le texte). Son logo est une icône sombre avec un trait ambre.

Le site a des contraintes que l'app n'a pas. Il ne doit envoyer aucun JavaScript et ne contenir aucun style en ligne, à cause de la politique de sécurité (spec 0001). Il doit charger vite sur une connexion mobile lente en Afrique de l'Ouest. Il ne doit faire aucune requête vers un tiers, pour que la politique de confidentialité reste simple. Il doit être accessible (WCAG AA, choisi dans le scope). Et il affichera surtout de longs textes juridiques, qui doivent rester lisibles.

Le site se construit page par page (Tracer Bullet). Le gabarit doit donc être utilisable tout de suite, avec seulement l'accueil provisoire et la page 404, sans montrer de liens vers des pages pas encore construites. Les boutons des stores doivent signaler « Bientôt disponible » sans enfreindre les règles d'usage des badges de Google et d'Apple.

Sans cette décision, chaque page inventerait ses couleurs, son haut de page et sa façon d'afficher un texte légal, et le site ne ressemblerait pas à l'app.

## Options considered

### Option 1 : jetons de l'app dans `@theme`, gabarit Astro en composants, polices Fontsource

Les valeurs de l'app deviennent des variables Tailwind 4. Les polices viennent des paquets Fontsource, en woff2 servi par le site. Un gabarit Astro est découpé en `BaseLayout`, `SiteHeader`, `SiteFooter`, `StoreButtons` et `LegalLayout`, et documenté dans `design.md`.

**Pros**:
- Une identité fidèle à l'app.
- Des polices légères, découpées par alphabet, et sans requête externe.
- Chaque page n'apporte que son contenu.

**Cons**:
- Deux polices à charger.
- Les jetons sont recopiés à la main depuis l'app.

### Option 2 : même charte, polices `.ttf` copiées depuis l'app

Le gabarit et les jetons sont identiques à l'option 1, mais on copie les fichiers de police déjà présents dans `noli_app/assets/google_fonts/`.

**Pros**:
- Aucune dépendance npm de plus.
- Exactement les mêmes fichiers que l'app.

**Cons**:
- Les `.ttf` sont lourds et non découpés.
- Il faut un fichier par graisse, et une conversion en woff2 à faire à la main pour retrouver le poids de l'option 1.

### Option 3 : charte minimale, polices du système

On reprend seulement les couleurs de l'app, avec les polices du système et un gabarit réduit.

**Pros**:
- Rien à charger.
- Le site le plus rapide possible.

**Cons**:
- Le site ne ressemble plus vraiment à l'app.
- Les titres perdent la personnalité de Bricolage Grotesque.

## Rationale

L'identité compte ici. Le site sert à rassurer, et un visiteur qui vient de l'app doit s'y reconnaître : c'est ce qui écarte l'option 3. Entre les options 1 et 2, Fontsource donne les mêmes polices en woff2 variable, découpées par alphabet. On gagne en poids et en simplicité, et les fichiers passent par le build d'Astro (donc `/_astro/`, conforme à `font-src 'self'`) sans conversion manuelle.

Vous avez choisi un thème sombre seul. C'est cohérent avec l'app et le logo, et les contrastes du gabarit restent largement au dessus de AA. L'ambiance sobre garde l'ambre pour les liens et les actions, et laisse le violet et les dégradés à l'accueil. Les pages légales, qui sont l'essentiel du site, restent ainsi calmes et lisibles. La colonne de 70 caractères en 16 px suit la largeur de lecture confortable pour un texte long.

Les boutons stores maison, en texte seul, évitent de modifier les badges officiels ou d'utiliser les logos de Google et d'Apple hors de leurs règles. À la publication, on passera aux badges officiels.

Enfin, `footerLinks` ne liste que les pages existantes. Ce choix découle de l'approche Tracer Bullet : le site est en ligne dès la feature 4, et ne doit jamais renvoyer un visiteur ou un relecteur vers une page 404.
