// Réglages partagés du site : un seul endroit à modifier (specs 0001 et 0002).

export const site = {
  name: 'Noli',
  supportEmail: 'support@nollli.com',
  // Fond de l'app (NColors.canvas), pour la barre du navigateur mobile.
  themeColor: '#0B0C10',
} as const

// Adresses publiques. Elles sont promises aux stores et écrites dans l'app : ne jamais les changer.
export const routes = {
  home: '/',
  privacy: '/confidentialite',
  terms: '/cgu',
  accountDeletion: '/suppression-compte',
  legalNotice: '/mentions-legales',
  contact: '/contact',
} as const

export type Route = (typeof routes)[keyof typeof routes]

// Liens du pied de page : seulement les pages déjà construites. Chaque feature de page ajoute sa
// ligne quand elle est livrée (« Confidentialité », « Conditions d'utilisation »,
// « Suppression de compte », « Mentions légales », « Contact et aide »).
export const footerLinks: readonly { label: string; href: Route }[] = []

// Liens des stores. null tant que l'app n'est pas publiée : le bouton affiche « Bientôt disponible ».
export const storeLinks: { googlePlay: string | null; appStore: string | null } = {
  googlePlay: null,
  appStore: null,
}

export function pageTitle(name?: string): string {
  return name ? `${name} · ${site.name}` : site.name
}

// Chemin canonique sans .html ni barre finale ; l'accueil reste « / ».
export function canonicalPath(pathname: string): string {
  if (pathname === '/' || pathname === '/index.html') return '/'
  const withoutHtml = pathname.endsWith('.html') ? pathname.slice(0, -'.html'.length) : pathname
  const trimmed = withoutHtml.endsWith('/') ? withoutHtml.slice(0, -1) : withoutHtml
  return trimmed === '' ? '/' : trimmed
}

const legalDateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' })

// Date de mise à jour d'un texte légal, en UTC pour ne pas dépendre du fuseau de la machine de build.
export function formatLegalDate(date: Date): string {
  return legalDateFormat.format(date)
}
