// Collections de contenu (spec 0001) : un fichier Markdown par texte légal, dont le nom est
// l'adresse publique (confidentialite.md → /confidentialite).
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    updatedAt: z.coerce.date(),
  }),
})

export const collections = { legal }
