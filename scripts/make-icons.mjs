// Génère les favicons depuis le logo de l'app (spec 0002). À lancer à la main quand le logo change :
// node scripts/make-icons.mjs. Les fichiers produits sont commités dans public/.
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const source = fileURLToPath(new URL('../src/assets/noli-logo.png', import.meta.url))
const icons = [
  { file: 'favicon-32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
]

for (const { file, size } of icons) {
  const target = fileURLToPath(new URL(`../public/${file}`, import.meta.url))
  await sharp(source)
    .resize(size, size, { fit: 'contain', background: '#00000000' })
    .png()
    .toFile(target)
  console.log(`make-icons : ${file} (${size} px)`)
}
