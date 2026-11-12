import { DAYS_IN_WEEK, PRAYERS } from "../config.js";
import { todayISO, weekStart } from "../dates.js";
import { dayEarnings, dayOf, sumValues, weekSummary } from "../earnings.js";
import { esc, formatLongDate, formatWeekday, money } from "../format.js";
import { state } from "../state.js";
import { checkButton, dateNav } from "./shared.js";

function readingHint(week, rewards) {
  if (week.fullWeek) return `Haftanın her günü okudun. Ödül ${money(rewards.reading.fullWeek)} oldu!`;
  const remaining = DAYS_IN_WEEK - week.readingDays;
  return `Bu hafta ${week.readingDays}/${DAYS_IN_WEEK} gün. ${remaining} gün daha okursan ödül ${money(rewards.reading.fullWeek)} olur.`;
}

export function renderToday() {
  const { rewards } = state.settings;
  const iso = state.selectedDate;
  const day = dayOf(state.days, iso);
  const week = weekSummary(weekStart(iso), state.days, rewards);
  const isToday = iso === todayISO();

  return `
    ${dateNav({ action: "shift-day", picker: "day", value: iso, label: `${isToday ? "Bugün · " : ""}${formatLongDate(iso)}`, canGoNext: !isToday })}
    <div class="tiles">
      <div class="tile coin"><div class="label">Bu günün kazancı</div><div class="value num">${money(sumValues(dayEarnings(day, rewards)))}</div></div>
      <div class="tile"><div class="label">Bu haftanın kazancı</div><div class="value num">${money(week.total)}</div></div>
    </div>
    <section class="card">
      <h3>Ödev</h3>
      ${checkButton({ action: "toggle-homework", pressed: day.homework, title: "Ödevlerimi yaptım", reward: rewards.homework.amount })}
    </section>
    <section class="card">
      <h3>Kitap</h3>
      ${checkButton({ action: "toggle-reading", pressed: day.reading, title: "Kitap okudum", reward: rewards.reading.amount })}
      <div class="dots" aria-label="Bu hafta okunan günler">
        ${week.rows.map((r) => `<div class="dot ${r.day.reading ? "on" : ""}">${esc(formatWeekday(r.iso))}</div>`).join("")}
      </div>
      <p class="muted">${esc(readingHint(week, rewards))}</p>
    </section>
    <section class="card">
      <div class="row spread"><h3>Namaz</h3><span class="pill num">${day.prayers.length}/${PRAYERS.length} vakit · her vakit +${money(rewards.prayer.amount)}</span></div>
      <div class="chips prayers">
        ${PRAYERS.map((p) => `<button type="button" class="chip" data-action="toggle-prayer" data-prayer="${p.id}" aria-pressed="${day.prayers.includes(p.id)}">${esc(p.label)}</button>`).join("")}
      </div>
    </section>`;
}
