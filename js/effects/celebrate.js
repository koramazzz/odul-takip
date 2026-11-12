/* Bir görev işaretlenince ne kutlanacağına karar verir: ses, konfeti, uçan ödül, bildirim. */
import { CONFETTI, FLOAT_REWARD_MS, MILESTONES, MILESTONE_SUMMARIES, TOAST_MS } from "../config.js";
import { esc, money } from "../format.js";
import { newMilestones } from "../motivation.js";
import { burst } from "./confetti.js";
import { playSound } from "./sound.js";

const layer = document.getElementById("fx");
let toastTimer = null;

function addTemporary(html, lifeMs) {
  layer.insertAdjacentHTML("beforeend", html);
  const el = layer.lastElementChild;
  setTimeout(() => el.remove(), lifeMs);
  return el;
}

function floatReward({ x, y }, amount) {
  const el = addTemporary(`<div class="float-reward num">+${esc(money(amount))}</div>`, FLOAT_REWARD_MS);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
}

function showToast(title, detail) {
  layer.querySelector(".toast")?.remove();
  clearTimeout(toastTimer);
  layer.insertAdjacentHTML("beforeend",
    `<div class="toast"><div class="toast-title">${esc(title)}</div><div class="muted strong">${esc(detail)}</div></div>`);
  toastTimer = setTimeout(() => layer.querySelector(".toast")?.remove(), TOAST_MS);
}

const screenCenter = () => ({ x: window.innerWidth / 2, y: window.innerHeight / 3 });

/* `before` ve `after`: motivation.progressSnapshot çıktıları. `origin`: dokunulan düğmenin ekran konumu. */
export function celebrate(before, after, origin) {
  if (before.iso !== after.iso || before.done === after.done) return;
  if (after.done < before.done) { playSound("undo"); return; }

  const gained = after.weekTotal - before.weekTotal;
  if (gained > 0) floatReward(origin, gained);

  const [milestone] = newMilestones(before, after);
  if (!milestone) {
    playSound("done");
    burst(origin, CONFETTI.smallBurst);
    return;
  }
  const { title, scope, sound } = MILESTONES[milestone];
  playSound(sound);
  burst(screenCenter(), CONFETTI.bigBurst);
  showToast(title, MILESTONE_SUMMARIES[scope]({ day: money(after.dayTotal), week: money(after.weekTotal) }));
}
