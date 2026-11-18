# Juegos de los participantes

Cada juego vive en su carpeta `juegos/<slug>/` y se publica solo con GitHub Pages. La galería del sitio sale de `juegos/index.json`, que genera `node scripts/indexar.mjs`.

## Cómo añadir un juego

1. Copia `_plantilla/` a `juegos/<tu-slug>/` (el slug: minúsculas, números y guiones, por ejemplo `mi-juego`).
2. Pon tu juego dentro. Requisitos:
   - Debe abrir con `index.html` y funcionar como sitio estático (HTML/CSS/JS, o el resultado de exportar tu motor a web).
   - Usa **rutas relativas** (`juego.js`, `assets/sprite.png`), nunca `/juego.js`: el sitio vive bajo un subdirectorio.
   - Máximo **250 MB** por juego y **95 MB** por archivo; sin `.br`/`.gz`. Guía completa (Godot, Unity, etc.): [docs/guia-publicar-juego.md](../docs/guia-publicar-juego.md).
   - Completa `juego.json` (título, autores —pueden ser alias—, descripción, controles, herramientas de IA usadas).
   - `"permiso_publicar": true` confirma que quienes lo hicieron aceptan que se publique.
3. Corre `node scripts/indexar.mjs` (valida y actualiza `juegos/index.json`) y abre un PR. Una acción de GitHub revisa lo mismo.

## Seguridad

Cada juego se abre dentro de un `iframe` con `sandbox` sin `allow-same-origin`, así su código no puede tocar el resto del sitio. Consecuencia: `localStorage` y las cookies pueden no estar disponibles; el juego debe tolerarlo. El equipo organizador revisa los juegos antes de unirlos.
