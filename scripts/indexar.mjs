// Recorre juegos/*/ (menos las carpetas que empiezan con "_"), valida cada juego
// y genera juegos/index.json. Uso: node scripts/indexar.mjs [--check]
// Con --check no escribe: sale con error si index.json no está al día.
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = 'juegos';
const MAX_CARPETA = 250 * 1024 * 1024; // 250 MB por juego
const MAX_ARCHIVO = 95 * 1024 * 1024; // GitHub rechaza archivos de 100 MB
const MAX_TOTAL = 900 * 1024 * 1024; // Pages permite ~1 GB en total
const SLUG = /^[a-z0-9][a-z0-9-]{1,40}$/;
const errores = [];
const juegos = [];
let total = 0;

function tamano(dir) {
  let total = 0;
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) total += tamano(p);
    else {
      const s = statSync(p).size;
      if (s > MAX_ARCHIVO) errores.push(`${p}: archivo de más de 95 MB`);
      if (/\.(br|gz)$/i.test(f.name)) errores.push(`${p}: no se aceptan archivos .br/.gz (Pages no envía Content-Encoding)`);
      total += s;
    }
  }
  return total;
}

for (const d of readdirSync(RAIZ, { withFileTypes: true })) {
  if (!d.isDirectory() || d.name.startsWith('_')) continue;
  const dir = join(RAIZ, d.name);
  const err = m => errores.push(`${dir}: ${m}`);
  if (!SLUG.test(d.name)) err('el nombre de carpeta debe ser minúsculas, números y guiones (2 a 41 caracteres)');
  if (!existsSync(join(dir, 'index.html'))) { err('falta index.html'); continue; }
  if (!existsSync(join(dir, 'juego.json'))) { err('falta juego.json'); continue; }
  let meta;
  try { meta = JSON.parse(readFileSync(join(dir, 'juego.json'), 'utf8')); }
  catch { err('juego.json no es JSON válido'); continue; }
  if (!meta.titulo || typeof meta.titulo !== 'string') err('falta "titulo"');
  if (!Array.isArray(meta.autores) || !meta.autores.length) err('falta "autores" (lista, puede ser alias)');
  if (meta.permiso_publicar !== true) err('"permiso_publicar" debe ser true (consentimiento de quienes lo hicieron)');
  if (Array.isArray(meta.autores) && !meta.autores.every(a => typeof a === 'string')) err('"autores" debe ser una lista de textos');
  if (meta.herramientas_ia != null && (!Array.isArray(meta.herramientas_ia) || !meta.herramientas_ia.every(a => typeof a === 'string'))) err('"herramientas_ia" debe ser una lista de textos');
  for (const k of ['descripcion', 'controles']) if (meta[k] != null && typeof meta[k] !== 'string') err(`"${k}" debe ser texto`);
  const html = readFileSync(join(dir, 'index.html'), 'utf8');
  if (/(src|href)\s*=\s*["']\/(?!\/)/i.test(html)) err('index.html usa rutas absolutas ("/algo"); usa rutas relativas');
  const peso = tamano(dir);
  total += peso;
  if (peso > MAX_CARPETA) err('la carpeta pesa más de 250 MB');
  juegos.push({
    slug: d.name,
    titulo: meta.titulo,
    autores: meta.autores,
    descripcion: meta.descripcion || '',
    controles: meta.controles || '',
    herramientas_ia: meta.herramientas_ia || []
  });
}

if (total > MAX_TOTAL) errores.push('los juegos suman más de 900 MB');

juegos.sort((a, b) => a.slug.localeCompare(b.slug));
const salida = JSON.stringify({ juegos }, null, 2) + '\n';
const destino = join(RAIZ, 'index.json');

if (process.argv.includes('--check')) {
  const actual = existsSync(destino) ? readFileSync(destino, 'utf8') : '';
  if (actual !== salida) errores.push('juegos/index.json no está al día: corre `node scripts/indexar.mjs`');
} else if (!errores.length) {
  writeFileSync(destino, salida);
}

if (errores.length) {
  console.error(errores.map(e => '✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`OK: ${juegos.length} juego(s)`);
