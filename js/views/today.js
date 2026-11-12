import { DAYS_IN_WEEK, MIN_STREAK_TO_SHOW, PERCENT, PRAYERS, TASK_ICONS } from "../config.js";
import { todayISO, weekStart } from "../dates.js";
import { dayEarnings, dayOf, sumValues, weekSummary } from "../earnings.js";
import { esc, formatLongDate, formatWeekday, money } from "../format.js";
import { dayProgress, encouragement, readingStreak } from "../motivation.js";
import { state } from "../state.js";
import { mascot, starIcon } from "./mascot.js";
import { checkButton, countedMoney, dateNav } from "./shared.js";

function readingHint(week, rewards) {
  if (week.fullWeek) return `Haftanın her günü okudun. Ödül ${money(rewards.reading.fullWeek)} oldu!`;
  const remaining = DAYS_IN_WEEK - week.readingDays;
  return `${remaining} gün daha okursan bu haftanın kitap ödülü ${money(rewards.reading.fullWeek)} olur.`;
}

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

/* Haftanın yedi günü için yıldız sırası; `task` günün hangi görevine bakılacağını ve rengi belirler. */
function weekStars({ week, task, action, label, selectedISO }) {
  return `<div class="stars ${task}" aria-label="${label}">
    ${week.rows.map((r) => `<div class="star ${r.day[task] ? "on" : ""}" ${r.iso === selectedISO ? `data-fresh-on="${action}"` : ""}>
      ${starIcon()}<span>${esc(formatWeekday(r.iso))}</span></div>`).join("")}
  </div>`;
}

const daysDone = (week, task) => week.rows.filter((r) => r.day[task]).length;

export function renderToday() {
  const { rewards } = state.settings;
  const iso = state.selectedDate;
  const day = dayOf(state.days, iso);
  const week = weekSummary(weekStart(iso), state.days, rewards);
  const isToday = iso === todayISO();
  const streak = readingStreak(state.days, iso);

  return `
    ${dateNav({ action: "shift-day", picker: "day", value: iso, label: `${isToday ? "Bugün · " : ""}${formatLongDate(iso)}`, canGoNext: !isToday })}
    ${hero(dayProgress(day))}
    <div class="tiles">
      <div class="tile coin"><div class="label">Bu günün kazancı</div><div class="value num">${countedMoney("day", sumValues(dayEarnings(day, rewards)))}</div></div>
      <div class="tile"><div class="label">Bu haftanın kazancı</div><div class="value num">${countedMoney("week", week.total)}</div></div>
    </div>
    <section class="card">
      ${checkButton({ action: "toggle-homework", task: "homework", icon: TASK_ICONS.homework, pressed: day.homework, title: "Ödevlerimi yaptım", reward: rewards.homework.amount })}
      ${weekStars({ week, task: "homework", action: "toggle-homework", label: "Bu hafta ödev yapılan günler", selectedISO: iso })}
      <p class="muted strong num">Bu hafta ${daysDone(week, "homework")}/${DAYS_IN_WEEK} gün ödev yapıldı · ${money(week.totals.homework)}</p>
    </section>
    <section class="card">
      ${checkButton({ action: "toggle-reading", task: "reading", icon: TASK_ICONS.reading, pressed: day.reading, title: "Kitap okudum", reward: rewards.reading.amount })}
      ${weekStars({ week, task: "reading", action: "toggle-reading", label: "Bu hafta okunan günler", selectedISO: iso })}
      <div class="row spread">
        <p class="muted strong">${esc(readingHint(week, rewards))}</p>
        ${streak >= MIN_STREAK_TO_SHOW ? `<span class="pill coin num">${streak} gün üst üste</span>` : ""}
      </div>
    </section>
    <section class="card">
      <div class="row spread"><h3>Namaz</h3><span class="pill num">${day.prayers.length}/${PRAYERS.length} vakit · her vakit +${money(rewards.prayer.amount)}</span></div>
      <div class="chips prayers">
        ${PRAYERS.map((p) => `<button type="button" class="chip" data-action="toggle-prayer" data-prayer="${p.id}" aria-pressed="${day.prayers.includes(p.id)}">${esc(p.label)}</button>`).join("")}
      </div>
    </section>`;
}
