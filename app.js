'use strict';
// Carga los datos del evento pasado y arma el podio y la lista de participantes.
// Todo se escribe con textContent (sin innerHTML) para que ningún dato inyecte HTML.

const params = new URLSearchParams(location.search);
const demo = params.has('demo');
const file = demo ? 'data/ejemplo.json' : 'data/evento.json';

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

// Solo enlaces http(s); cualquier otro esquema se ignora.
function safeLink(url, label) {
  if (!/^https?:\/\//i.test(url || '')) return null;
  const a = el('a', '', label);
  a.href = url;
  a.rel = 'noopener noreferrer';
  a.target = '_blank';
  return a;
}

function render(d) {
  document.getElementById('edicion').textContent = d.edicion || 'Bit-by-Bit GameJam';
  document.getElementById('descripcion').textContent = d.descripcion || '';
  document.getElementById('meta').textContent = [d.fecha, d.lugar].filter(Boolean).join(' · ');

  if (demo) {
    const a = document.getElementById('aviso');
    a.hidden = false;
    a.textContent = 'Vista de ejemplo con datos inventados.';
  }

  const podio = document.getElementById('podio');
  podio.replaceChildren();
  const puestos = (d.podio || []).slice().sort((a, b) => a.puesto - b.puesto);
  if (!puestos.length) {
    podio.append(el('p', 'vacio', 'Pronto publicaremos a los ganadores.'));
  }
  for (const p of puestos) {
    const card = el('article', 'puesto p' + p.puesto);
    card.append(el('div', 'pos', p.puesto + '.º'));
    if (p.categoria) card.append(el('p', 'cat', p.categoria));
    card.append(el('h3', '', p.juego || 'Juego'));
    const quienes = [p.equipo, (p.integrantes || []).join(', ')].filter(Boolean).join(' — ');
    if (quienes) card.append(el('p', 'equipo', quienes));
    const link = safeLink(p.enlace, 'Jugar');
    if (link) card.append(link);
    podio.append(card);
  }

  const lista = document.getElementById('participantes');
  lista.replaceChildren();
  const gente = d.participantes || [];
  document.getElementById('count').textContent = gente.length ? gente.length + ' participantes' : '';
  if (!gente.length) {
    const li = el('li', 'vacio', 'Pronto publicaremos a los participantes.');
    li.style.gridColumn = '1 / -1';
    lista.append(li);
  }
  for (const g of gente) {
    const li = el('li');
    li.append(el('div', 'n', g.nombre));
    if (g.juego) li.append(el('div', 'j', g.juego));
    const link = safeLink(g.enlace, 'Ver juego');
    if (link) li.append(link);
    lista.append(li);
  }
}

fetch(file)
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(render)
  .catch(() => render({}));

// Galería de juegos alojados en juegos/<slug>/ (lista generada por scripts/indexar.mjs).
function renderJuegos(lista) {
  const cont = document.getElementById('juegos');
  cont.replaceChildren();
  if (!lista.length) {
    cont.append(el('p', 'vacio', 'Pronto estarán los juegos aquí.'));
    return;
  }
  for (const j of lista) {
    const card = el('article', 'juego');
    card.append(el('h3', '', j.titulo));
    card.append(el('p', 'autores', j.autores.join(', ')));
    if (j.descripcion) card.append(el('p', 'desc', j.descripcion));
    if (j.controles) card.append(el('p', 'ctl', 'Controles: ' + j.controles));
    if ((j.herramientas_ia || []).length) card.append(el('p', 'ctl', 'IA: ' + j.herramientas_ia.join(', ')));
    const a = el('a', 'boton', 'Jugar');
    a.href = 'jugar.html?g=' + encodeURIComponent(j.slug);
    card.append(a);
    cont.append(card);
  }
}

fetch('juegos/index.json')
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(d => renderJuegos(d.juegos || []))
  .catch(() => renderJuegos([]));
