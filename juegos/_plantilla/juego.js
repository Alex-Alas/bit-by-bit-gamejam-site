// Juego de ejemplo: toca el cuadro para sumar puntos. Reemplázalo por el tuyo.
const c = document.getElementById('c');
const ctx = c.getContext('2d');
let puntos = 0, x = 100, y = 100;
function mover() { x = 20 + Math.random() * 400; y = 40 + Math.random() * 240; }
c.addEventListener('pointerdown', e => {
  const r = c.getBoundingClientRect();
  const px = (e.clientX - r.left) * (c.width / r.width);
  const py = (e.clientY - r.top) * (c.height / r.height);
  if (Math.abs(px - x) < 30 && Math.abs(py - y) < 30) { puntos++; mover(); }
});
(function dibujar() {
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#9b88ff';
  ctx.fillRect(x - 25, y - 25, 50, 50);
  ctx.fillStyle = '#fff';
  ctx.font = '20px system-ui';
  ctx.fillText('Puntos: ' + puntos, 12, 28);
  requestAnimationFrame(dibujar);
})();
