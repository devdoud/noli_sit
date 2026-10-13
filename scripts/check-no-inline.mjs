// Garde fou de la CSP (spec 0001) : le build échoue si une page de dist/ contient
// une balise <script>, une balise <style> ou un attribut style="".
// `astro preview` n'applique pas les en têtes de render.yaml, donc ce contrôle les remplace en local.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const forbidden = [
  { label: 'balise <script>', pattern: /<script\b/i },
  { label: 'balise <style>', pattern: /<style\b/i },
  { label: 'attribut style=', pattern: /\sstyle\s*=/i },
];

async function listHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return listHtmlFiles(path);
      return entry.name.endsWith('.html') ? [path] : [];
    }),
  );
  return files.flat();
}

const htmlFiles = await listHtmlFiles(root);
if (htmlFiles.length === 0) {
  console.error('check-no-inline : aucune page HTML trouvée dans dist/.');
  process.exit(1);
}

const problems = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const { label, pattern } of forbidden) {
    if (pattern.test(html)) problems.push(`${relative(root, file)} : ${label}`);
  }
}

if (problems.length > 0) {
  console.error('check-no-inline : contenu en ligne interdit par la CSP :');
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`check-no-inline : ${htmlFiles.length} pages contrôlées, aucun script ni style en ligne.`);
