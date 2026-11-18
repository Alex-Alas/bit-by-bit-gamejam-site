# Guía: publicar tu juego en el sitio del Bit-by-Bit GameJam

El sitio es estático (GitHub Pages). Tu juego se sube como **export web** (HTML5/WebAssembly) y se juega en el navegador, sin instalar nada.

## Si no usas GitHub

Manda tu juego como **.zip** a los organizadores por el canal de la comunidad. Ellos lo agregan por ti. Incluye: título, alias o nombre con el que quieres aparecer, motor, descripción corta (1–2 frases), las herramientas de IA que usaste, y **confirma que aceptas que se publique** (juego y nombre/alias).

## Si usas GitHub (Pull Request)

1. Copia `juegos/_plantilla/` a `juegos/<slug>/` (`<slug>`: minúsculas, números y guiones, por ejemplo `mi-juego`).
2. Pon tu export dentro. `index.html` debe estar en la raíz de esa carpeta y todas las rutas deben ser **relativas**.
3. Completa `juego.json` (título, autores —pueden ser alias—, descripción, controles, herramientas de IA) y pon `"permiso_publicar": true` solo si todas las personas autoras aprobaron publicar el juego y su nombre o alias.
4. Corre `node scripts/indexar.mjs`: valida y actualiza `juegos/index.json`.
5. Abre el PR. La acción **Validar juegos** repite la revisión.

## Cómo exportar (lo que Pages soporta)

| Motor | Qué hacer |
|---|---|
| **Godot 4** | Export *Web*. Desactiva **Thread Support** (Pages no puede enviar los encabezados COOP/COEP que exigen los hilos). Renombra el HTML exportado a `index.html`. |
| **Unity WebGL** | Compresión de build: **Disabled** (Pages no envía `Content-Encoding`, así que los `.br`/`.gz` no cargan). |
| **Phaser / JS / HTML5** | Funciona tal cual. Prefiere subir las librerías dentro de la carpeta en vez de usar CDNs. |
| **Construct / GDevelop / otros** | Export HTML5 / web. Verifica que `index.html` abra con un servidor local (`python3 -m http.server`). |

## Límites

- Máximo **95 MB por archivo** (GitHub rechaza 100 MB), **250 MB por juego** y **900 MB para todos los juegos** (Pages permite ~1 GB en total).
- Se rechazan archivos `.br` y `.gz`.
- Sin anuncios, rastreadores ni contenido que viole el [código de conducta](../CODE_OF_CONDUCT.md).
- Pages no tiene servidor ni base de datos: nada de multijugador propio ni cuentas. Los puntajes en línea requieren un servicio externo.

## Seguridad y aislamiento

Los juegos son código de terceros. El reproductor (`jugar.html`) los carga en un `iframe` con `sandbox` **sin** `allow-same-origin`: cada juego corre en un origen aislado y no puede leer a los demás ni al sitio. Costo: `localStorage` e IndexedDB pueden no estar disponibles; el juego debe tolerarlo (no guardar progreso en esa sesión).
