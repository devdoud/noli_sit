// Réglages partagés du site : un seul endroit à modifier (spec 0001).

export const site = {
  name: 'Noli',
  supportEmail: 'support@nollli.com',
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

// Liens des stores. null tant que l'app n'est pas publiée : le bouton affiche « Bientôt disponible ».
export const storeLinks: { googlePlay: string | null; appStore: string | null } = {
  googlePlay: null,
  appStore: null,
}
