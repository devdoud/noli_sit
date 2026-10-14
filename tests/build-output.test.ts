// Résultat du build (spec 0001 « Configuration du projet », scope feature 1 « le projet se construit »).
// Construit le site une fois dans un dossier temporaire (astro build --outDir) pour ne pas toucher au vrai dist/.
import { spawnSync } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const astroBin = join(projectRoot, 'node_modules', 'astro', 'bin', 'astro.mjs');

let outDir: string;
let files: string[];
let indexHtml: string;
let notFoundHtml: string;

beforeAll(async () => {
  outDir = await mkdtemp(join(tmpdir(), 'noli-build-'));
  const result = spawnSync(process.execPath, [astroBin, 'build', '--outDir', outDir], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });
  if (result.status !== 0) {
    throw new Error(`astro build a échoué :\n${result.stdout}\n${result.stderr}`);
  }
  files = (await readdir(outDir, { recursive: true })).map((file) => file.replaceAll('\\', '/'));
  indexHtml = await readFile(join(outDir, 'index.html'), 'utf8');
  notFoundHtml = await readFile(join(outDir, '404.html'), 'utf8');
}, 120_000);

afterAll(async () => {
  if (outDir) await rm(outDir, { recursive: true, force: true });
});

describe('build output', () => {
  it('produces the home page and the 404 page as flat .html files', () => {
    expect(files).toContain('index.html');
    expect(files).toContain('404.html');
    expect(files.some((file) => file.endsWith('/index.html') && file !== 'index.html')).toBe(false);
  });

  it('marks every page as French', () => {
    expect(indexHtml).toContain('<html lang="fr"');
    expect(notFoundHtml).toContain('<html lang="fr"');
  });

  it('gives the home page a title and a description', () => {
    expect(indexHtml).toMatch(/<title>Noli<\/title>/);
    expect(indexHtml).toMatch(/<meta name="description" content="[^"]+"/);
  });

  it('gives the 404 page its own title and a link back home', () => {
    expect(notFoundHtml).toContain('<title>Page introuvable · Noli</title>');
    expect(notFoundHtml).toMatch(/<a [^>]*href="\/"[^>]*>Retour à l'accueil<\/a>/);
  });

  it.each([
    ['home page', () => indexHtml],
    ['404 page', () => notFoundHtml],
  ])('keeps the %s free of inline script, style and data: resources', (_name, html) => {
    const page = html();
    expect(page).not.toMatch(/<script\b/i);
    expect(page).not.toMatch(/<style\b/i);
    expect(page).not.toMatch(/\sstyle\s*=/i);
    expect(page).not.toContain('data:');
  });

  it('serves CSS only as hashed files under /_astro/', () => {
    const stylesheets = [...indexHtml.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
    expect(stylesheets.length).toBeGreaterThan(0);
    for (const href of stylesheets) expect(href).toMatch(/^\/_astro\/[^/]+\.css$/);
  });

  it('ships no JavaScript file at all', () => {
    expect(files.filter((file) => file.endsWith('.js'))).toEqual([]);
  });

  it('carries the brand color from the app into the CSS', async () => {
    const cssFile = files.find((file) => file.startsWith('_astro/') && file.endsWith('.css'));
    const css = await readFile(join(outDir, cssFile ?? ''), 'utf8');
    expect(css).toContain('--color-brand:#f5a623');
  });
});
