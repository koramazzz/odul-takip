import { DAYS_IN_WEEK, PERCENT, PRAYERS } from "../config.js";
import { todayISO, weekStart } from "../dates.js";
import { dayEarnings, dayOf, prayerBonusReached, sumValues, weekSummary } from "../earnings.js";
import { esc, formatLongDate, formatWeekday, money } from "../format.js";
import { dayProgress, encouragement } from "../motivation.js";
import { state } from "../state.js";
import { DAILY_TASKS } from "../tasks.js";
import { mascot, starIcon } from "./mascot.js";
import { checkButton, countedMoney, dateNav } from "./shared.js";

/* Üst kart: maskot, cesaret sözü, günün ilerlemesi ve kazanç özeti. */
function hero(progress, dayTotal, weekTotal) {
  return `<section class="card hero">
    ${mascot({ party: progress.done === progress.total })}
    <div class="hero-body">
      <h2>${esc(encouragement(progress.ratio))}</h2>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${progress.total}" aria-valuenow="${progress.done}" aria-label="Günün görevleri">
        <div class="progress-fill" style="width:${progress.ratio * PERCENT}%"></div>
      </div>
      <p class="strong num">${progress.done}/${progress.total} görev</p>
      <p class="earned num">Bugün <strong>${countedMoney("day", dayTotal)}</strong> · Bu hafta <strong>${countedMoney("week", weekTotal)}</strong></p>
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

/* Yalnızca tam hafta ödülü olan görevlerde gösterilen kısa hedef satırı. */
function fullWeekNote(task, week, reward) {
  if (reward.fullWeek === undefined) return "";
  const text = week.fullWeekTasks.includes(task.id)
    ? `Tam hafta! ${money(reward.fullWeek)} kazandın.`
    : `${DAYS_IN_WEEK} gün yap, ${money(reward.fullWeek)} kazan!`;
  return `<p class="note num">${esc(text)}</p>`;
}

function taskCard(task, { day, week, rewards, iso }) {
  const reward = rewards[task.id];
  return `<section class="card task-card">
    ${checkButton({ task: task.id, icon: task.icon, pressed: day[task.id], title: task.title(reward), reward: reward.amount })}
    ${weekStars(task, week, iso)}
    ${fullWeekNote(task, week, reward)}
  </section>`;
}

function prayerCard(day, rewards) {
  const { amount, bonusMinCount, bonusAmount } = rewards.prayer;
  const note = prayerBonusReached(day, rewards)
    ? `Bonus kazandın: +${money(bonusAmount)}`
    : `Her vakit +${money(amount)} · ${bonusMinCount} vakitte +${money(bonusAmount)} bonus`;
  return `<section class="card task-card">
    <div class="row spread"><h3>Namaz</h3><span class="pill num">${day.prayers.length}/${PRAYERS.length}</span></div>
    <div class="chips prayers">
      ${PRAYERS.map((p) => `<button type="button" class="chip" data-action="toggle-prayer" data-prayer="${p.id}" aria-pressed="${day.prayers.includes(p.id)}">${esc(p.label)}</button>`).join("")}
    </div>
    <p class="note num">${esc(note)}</p>
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
    ${hero(dayProgress(day), sumValues(dayEarnings(day, rewards)), week.total)}
    ${DAILY_TASKS.map((task) => taskCard(task, { day, week, rewards, iso })).join("")}
    ${prayerCard(day, rewards)}`;
}
