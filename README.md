# Bit-by-Bit GameJam · sitio

Sitio del **Bit-by-Bit GameJam** (ESEN): galería de juegos hechos por participantes, podio y lista de participantes. Es estático, sin build, y se sirve con GitHub Pages desde la raíz de `main`.

## Estructura

| Ruta | Contenido |
|---|---|
| `index.html`, `jugar.html`, `style.css`, `app.js` | El sitio: galería, visor de juegos aislado, podio y participantes. |
| `data/evento.json` | Podio y participantes del evento (`?demo=1` muestra `data/ejemplo.json`, con datos inventados). |
| `juegos/<slug>/` | Un juego por carpeta, con `index.html` y `juego.json`. Ver [juegos/README.md](juegos/README.md). |
| `scripts/indexar.mjs` | Valida los juegos y genera `juegos/index.json`. |
| `docs/` | [Guía para publicar tu juego](docs/guia-publicar-juego.md) y decisiones. |

## Publicar tu juego

Lee la [guía](docs/guia-publicar-juego.md). En corto: copia `juegos/_plantilla/` a `juegos/<tu-slug>/`, pon tu export web, completa `juego.json` (con el permiso de publicación de todas las personas autoras), corre `node scripts/indexar.mjs` y abre un PR.

## Privacidad

No se publican nombres ni datos personales sin consentimiento explícito. Los autores pueden aparecer con un alias.
