// Configuration du site public de Noli. Voir la spec 0001, sections « Configuration du projet »
// et « Règles pour garder la CSP valide ».
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://nollli.com',
  output: 'static',
  // Adresses sans barre finale : /cgu est servi par dist/cgu.html.
  trailingSlash: 'never',
  build: {
    format: 'file',
    // Tout le CSS en fichiers, pour une CSP sans 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  vite: {
    plugins: [tailwindcss()],
    // Aucune ressource transformée en data: (font-src 'self' les bloquerait).
    build: { assetsInlineLimit: 0 },
  },
  devToolbar: { enabled: false },
  prefetch: false,
})
