/* Para tutarlarını eski değerden yenisine sayarak gösterir: <span data-count="120" data-count-key="today">. */
import { COUNT_UP_MS } from "../config.js";
import { money } from "../format.js";

const lastShown = new Map();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function animate(el, from, to) {
  const startedAt = performance.now();
  const tick = (now) => {
    if (!el.isConnected) return;
    const t = Math.min(1, (now - startedAt) / COUNT_UP_MS);
    el.textContent = money(Math.round(from + (to - from) * t));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function animateCounts(root) {
  for (const el of root.querySelectorAll("[data-count]")) {
    const key = el.dataset.countKey;
    const to = Number(el.dataset.count);
    const from = lastShown.get(key);
    lastShown.set(key, to);
    if (from !== undefined && from !== to && !reducedMotion.matches) animate(el, from, to);
  }
}
