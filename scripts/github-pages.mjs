// Gera a versão do site para o GitHub Pages: um único arquivo docs/index.html.
// Uso: npm run pagina
import { build } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const { default: siteConfig } = await import(join(raiz, 'site.config.js'));

const resultado = await build({
  entryPoints: [join(raiz, 'estatico/App.js')],
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  loader: { '.js': 'jsx' },
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  nodePaths: process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : [],
  logLevel: 'error',
});

const js = resultado.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const css = readFileSync(join(raiz, 'app/globals.css'), 'utf8');
const escapar = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const titulo = escapar(`${siteConfig.nomeProfissional} | ${siteConfig.titulo}`);

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#1f3a5f">
<meta name="description" content="${escapar(siteConfig.descricao)}">
<title>${titulo}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Fraunces:opsz,wght@9..144,600&display=swap">
<style>${css}</style>
</head>
<body>
<div id="app"></div>
<noscript>Ative o JavaScript para agendar.</noscript>
<script>${js}</script>
</body>
</html>
`;

mkdirSync(join(raiz, 'docs'), { recursive: true });
writeFileSync(join(raiz, 'docs/index.html'), html);
writeFileSync(join(raiz, 'docs/.nojekyll'), '');
console.log(`docs/index.html gerado (${Math.round(html.length / 1024)} KB)`);
