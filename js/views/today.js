import { DAYS_IN_WEEK, MIN_STREAK_TO_SHOW, PERCENT, PRAYERS } from "../config.js";
import { todayISO, weekStart } from "../dates.js";
import { dayEarnings, dayOf, prayerBonusReached, sumValues, weekSummary } from "../earnings.js";
import { esc, formatLongDate, formatWeekday, money } from "../format.js";
import { dayProgress, encouragement, taskStreak } from "../motivation.js";
import { state } from "../state.js";
import { DAILY_TASKS } from "../tasks.js";
import { mascot, starIcon } from "./mascot.js";
import { checkButton, countedMoney, dateNav } from "./shared.js";

function hero(progress) {
  return `<section class="card hero">
    ${mascot({ party: progress.done === progress.total })}
    <div class="hero-body">
      <h2>${esc(encouragement(progress.ratio))}</h2>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${progress.total}" aria-valuenow="${progress.done}" aria-label="Günün görevleri">
        <div class="progress-fill" style="width:${progress.ratio * PERCENT}%"></div>
      </div>
      <p class="strong num">${progress.done}/${progress.total} görev tamam</p>
    </div>
  </section>`;
}

/* Haftanın yedi günü için yıldız sırası; görevin rengini alır. */
function weekStars(task, week, selectedISO) {
  return `<div class="stars ${task.id}" aria-label="${task.weekLabel}">
    ${week.rows.map((r) => `<div class="star ${r.day[task.id] ? "on" : ""}" ${r.iso === selectedISO ? `data-fresh-on="${task.id}"` : ""}>
      ${starIcon()}<span>${esc(formatWeekday(r.iso))}</span></div>`).join("")}
  </div>`;
}

/* Haftalık satır: tam hafta ödülü olan görevde hedefe kalan günü, olmayanda yapılan günü ve kazancı söyler. */
function weekLine(task, week, reward) {
  const count = week.daysDone[task.id];
  if (reward.fullWeek === undefined) return `${task.weekLine(count)} · ${money(week.totals[task.id])}`;
  return count === DAYS_IN_WEEK
    ? task.bonusDone(money(reward.fullWeek))
    : task.bonusHint(DAYS_IN_WEEK - count, money(reward.fullWeek));
}

function prayerBonusLine(day, rewards) {
  const { bonusMinCount, bonusAmount } = rewards.prayer;
  if (prayerBonusReached(day, rewards)) return `Bonus kazanıldı: +${money(bonusAmount)}`;
  return `${bonusMinCount} vakit kılınca +${money(bonusAmount)} bonus · ${bonusMinCount - day.prayers.length} vakit kaldı`;
}

function taskCard(task, { day, week, rewards, iso }) {
  const reward = rewards[task.id];
  const streak = task.showStreak ? taskStreak(state.days, iso, task.id) : 0;
  return `<section class="card">
    ${checkButton({ task: task.id, icon: task.icon, pressed: day[task.id], title: task.title(reward), reward: reward.amount })}
    ${weekStars(task, week, iso)}
    <div class="row spread">
      <p class="muted strong num">${esc(weekLine(task, week, reward))}</p>
      ${streak >= MIN_STREAK_TO_SHOW ? `<span class="pill coin num">${streak} gün üst üste</span>` : ""}
    </div>
  </section>`;
}

export function renderToday() {
  const { rewards } = state.settings;
  const iso = state.selectedDate;
  const day = dayOf(state.days, iso);
  const week = weekSummary(weekStart(iso), state, rewards);
  const isToday = iso === todayISO();

  return `
    ${dateNav({ action: "shift-day", picker: "day", value: iso, label: `${isToday ? "Bugün · " : ""}${formatLongDate(iso)}`, canGoNext: !isToday })}
    ${hero(dayProgress(day))}
    <div class="tiles">
      <div class="tile coin"><div class="label">Bu günün kazancı</div><div class="value num">${countedMoney("day", sumValues(dayEarnings(day, rewards)))}</div></div>
      <div class="tile"><div class="label">Bu haftanın kazancı</div><div class="value num">${countedMoney("week", week.total)}</div></div>
    </div>
    ${DAILY_TASKS.map((task) => taskCard(task, { day, week, rewards, iso })).join("")}
    <section class="card">
      <div class="row spread"><h3>Namaz</h3><span class="pill num">${day.prayers.length}/${PRAYERS.length} vakit · her vakit +${money(rewards.prayer.amount)}</span></div>
      <div class="chips prayers">
        ${PRAYERS.map((p) => `<button type="button" class="chip" data-action="toggle-prayer" data-prayer="${p.id}" aria-pressed="${day.prayers.includes(p.id)}">${esc(p.label)}</button>`).join("")}
      </div>
      <p class="muted strong num">${esc(prayerBonusLine(day, rewards))}</p>
    </section>`;
}
