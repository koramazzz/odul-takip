/* Tuval üzerinde konfeti patlaması. Hareket azaltma tercihi açıksa hiçbir şey çizmez. */
import { CONFETTI } from "../config.js";

const canvas = document.getElementById("confetti");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const FULL_TURN = Math.PI * 2;
let particles = [];
let running = false;

const between = ({ min, max }) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

function newParticle(x, y) {
  const angle = Math.random() * FULL_TURN;
  const speed = between(CONFETTI.speed);
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - CONFETTI.speed.min,
    size: between(CONFETTI.size),
    color: pick(CONFETTI.colors),
    spin: Math.random() * FULL_TURN,
    life: CONFETTI.lifeFrames,
  };
}

function fitCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  return ratio;
}

function step(ctx, ratio) {
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  for (const p of particles) {
    p.vx *= CONFETTI.drag;
    p.vy = p.vy * CONFETTI.drag + CONFETTI.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.spin += 0.2;
    p.life -= 1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.spin);
    ctx.globalAlpha = Math.min(1, p.life / (CONFETTI.lifeFrames / 3));
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  }
  particles = particles.filter((p) => p.life > 0);
  if (particles.length) requestAnimationFrame(() => step(ctx, ratio));
  else running = false;
}

export function burst({ x, y }, count) {
  if (reducedMotion.matches) return;
  particles.push(...Array.from({ length: count }, () => newParticle(x, y)));
  if (running) return;
  running = true;
  const ratio = fitCanvas();
  requestAnimationFrame(() => step(canvas.getContext("2d"), ratio));
}
