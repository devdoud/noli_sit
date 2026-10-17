// Génère les favicons du site : un « N » ambre sur fond obsidienne (specs 0002 et 0006).
// Le « N » est un tracé SVG, pas une police, pour un rendu identique partout.
// À lancer à la main quand le dessin change : node scripts/make-icons.mjs. Les fichiers sont commités.
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0b0c10"/>
  <path d="M17 50V14h8.5l14 22.5V14H48v36h-8.5l-14-22.5V50z" fill="#f5a623"/>
</svg>
`

const publicDir = new URL('../public/', import.meta.url)
await writeFile(new URL('favicon.svg', publicDir), svg, 'utf8')
console.log('make-icons : favicon.svg')

const icons = [
  { file: 'favicon-32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
]

for (const { file, size } of icons) {
  const target = fileURLToPath(new URL(file, publicDir))
  await sharp(Buffer.from(svg), { density: 72 * (size / 64) * 4 })
    .resize(size, size)
    .png()
    .toFile(target)
  console.log(`make-icons : ${file} (${size} px)`)
}
