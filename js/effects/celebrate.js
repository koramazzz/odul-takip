/* Bir görev işaretlenince ne kutlanacağına karar verir: ses, konfeti, uçan ödül, bildirim. */
import { badgeById } from "../badges.js";
import { CONFETTI, FLOAT_REWARD_MS, MILESTONE_SUMMARIES, NEW_BADGE_SOUND, TOAST_MS } from "../config.js";
import { esc, money } from "../format.js";
import { describeMilestone, newMilestones } from "../motivation.js";
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

function bigCelebration(title, detail, sound) {
  playSound(sound);
  burst(screenCenter(), CONFETTI.bigBurst);
  showToast(title, detail);
}

/* `before` ve `after`: işlemden önceki ve sonraki durum (ilerleme + kazanılmış rozetler).
   `origin`: dokunulan düğmenin ekran konumu. Yeni rozet, günün kutlamasından önce gelir. */
export function celebrate(before, after, origin) {
  const sameDay = before.iso === after.iso;
  if (sameDay && after.done < before.done) { playSound("undo"); return; }

  const progressed = sameDay && after.done > before.done;
  const gained = after.weekTotal - before.weekTotal;
  if (progressed && gained > 0) floatReward(origin, gained);

  const newBadgeId = after.badges.find((id) => !before.badges.includes(id));
  if (newBadgeId) {
    const badge = badgeById(newBadgeId);
    bigCelebration("Yeni rozet kazandın!", `${badge.icon} ${badge.title}`, NEW_BADGE_SOUND);
    return;
  }
  const [milestone] = progressed ? newMilestones(before, after) : [];
  if (milestone) {
    const { title, scope, sound } = describeMilestone(milestone);
    bigCelebration(title, MILESTONE_SUMMARIES[scope]({ day: money(after.dayTotal), week: money(after.weekTotal) }), sound);
    return;
  }
  if (progressed) {
    playSound("done");
    burst(origin, CONFETTI.smallBurst);
  }
}
