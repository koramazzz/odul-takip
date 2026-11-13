import { PERCENT } from "../config.js";
import { badgeStates, computeStats } from "../badges.js";
import { esc, formatNumber, money, percent } from "../format.js";
import { state } from "../state.js";

const VALUE_FORMATS = { count: formatNumber, money, percent };

function progressBar(ratio, label) {
  return `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${PERCENT}" aria-valuenow="${Math.round(ratio * PERCENT)}" aria-label="${esc(label)}">
    <div class="progress-fill" style="width:${Math.min(1, ratio) * PERCENT}%"></div>
  </div>`;
}

function goalCard(goal, earned) {
  if (!goal.amount) {
    return `<section class="card"><h2>Hedefim</h2>
      <p class="muted">Henüz bir hedef yok. Ayarlar bölümünden bir hedef ve tutarını yazın; kazanç biriktikçe burada dolar.</p></section>`;
  }
  const reached = earned >= goal.amount;
  return `<section class="card hero goal">
    <div class="goal-icon" aria-hidden="true">${reached ? "🎉" : "🎯"}</div>
    <div class="hero-body">
      <h2>${esc(goal.name || "Hedefim")}</h2>
      ${progressBar(earned / goal.amount, "Hedefe ilerleme")}
      <p class="strong num">${reached ? `Hedefe ulaştın! ${money(earned)} kazandın.` : `${money(earned)} / ${money(goal.amount)} · ${money(goal.amount - earned)} kaldı`}</p>
    </div>
  </section>`;
}

function badgeCard(badge) {
  const format = VALUE_FORMATS[badge.unit];
  return `<article class="badge ${badge.unlocked ? "unlocked" : ""}">
    <div class="badge-icon" aria-hidden="true">${badge.icon}</div>
    <h3>${esc(badge.title)}</h3>
    <p class="muted">${esc(badge.description)}</p>
    ${badge.unlocked
      ? '<span class="pill good">Kazanıldı</span>'
      : `${progressBar(badge.ratio, badge.title)}<span class="muted strong num">${format(badge.value)} / ${format(badge.target)}</span>`}
  </article>`;
}

export function renderBadges() {
  const stats = computeStats(state, state.settings.rewards);
  const badges = badgeStates(stats);
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  return `${goalCard(state.settings.goal, stats.totalEarned)}
    <div class="row spread"><h2>Rozetlerim</h2><span class="pill coin num">${unlockedCount} / ${badges.length}</span></div>
    <div class="badges">${badges.map(badgeCard).join("")}</div>`;
}
