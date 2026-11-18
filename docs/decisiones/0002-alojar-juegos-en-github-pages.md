# 0002 · Alojar los juegos de los participantes en GitHub Pages

Fecha: 2026-11-18 · Decide: Claude (delegado, ver regla de gobernanza), con la dirección dada por Alex.

**Dado por Alex:** la prioridad ahora no es una próxima edición ni la rúbrica, sino preparar GitHub Pages para alojar los juegos de los participantes del evento pasado, con una página de participantes y ganadores. Su juego Laberinto Gatuno entra como ejemplo.

## Decisiones

- **Un juego por carpeta** `juegos/<slug>/` con `index.html` y `juego.json`; sitio estático sin build, servido desde la raíz de `main`.
- **Galería generada**: `scripts/indexar.mjs` valida (slug, archivos, rutas relativas, tamaños, permiso) y escribe `juegos/index.json`; una GitHub Action corre `--check` en cada PR.
- **Aislamiento**: los juegos corren en un iframe con `sandbox` sin `allow-same-origin` (origen opaco). Motivo: el código de terceros vive bajo el mismo dominio; así no puede leer ni modificar el almacenamiento del sitio ni de otros juegos. Costo: `localStorage` puede fallar dentro del juego.
- **Consentimiento**: `permiso_publicar: true` es obligatorio. Los autores pueden ser alias. Nada de datos personales sin su OK.
- **Límites**: 250 MB por juego, 95 MB por archivo y 900 MB en total (GitHub rechaza ≥ 100 MB y recomienda sitios ≤ 1 GB).

## Riesgo aceptado

El sandbox solo protege cuando el juego se abre desde `jugar.html`. Quien visite directamente `juegos/<slug>/` lo ejecuta con el origen del sitio, y GitHub Pages no permite enviar encabezados (CSP) para impedirlo. Se acepta porque el sitio no guarda cuentas ni datos, los enlaces públicos apuntan siempre al visor y cada juego lo revisa el equipo organizador antes de unirlo. Si algún día el sitio guarda datos, los juegos deben ir a un dominio aparte.

## Restricción conocida

GitHub Pages desde un repo **privado** requiere un plan de pago de GitHub. Para usar Pages gratis, el repo debe ser **público**. Eso exige el OK de Alex, y de los participantes para sus juegos y nombres. Alternativa: publicar en otro hosting estático y dejar el repo privado.

## Notas del ejemplo

Laberinto Gatuno es una copia de la versión de `Alex-Alas/laberinto-gatuno` (commit `e67684b`). Su tabla de clasificación usa un servicio externo (Supabase) con la clave pública del juego original, así que comparte marcas con la versión ya publicada.
