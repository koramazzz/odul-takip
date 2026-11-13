import { CURRENCY, DAYS_IN_WEEK, PRAYERS } from "../config.js";
import { addDays, todayISO, weekStart } from "../dates.js";
import { allTimeTotal, sumValues, weekSummary } from "../earnings.js";
import { esc, formatNumber, formatRowDate, formatShortDate, money } from "../format.js";
import { state } from "../state.js";
import { DAILY_TASKS, taskById } from "../tasks.js";
import { dateNav } from "./shared.js";

const mark = (on) => (on ? '<span class="yes">✓</span>' : '<span class="no">–</span>');

function fullWeekPill(taskId, rewards) {
  const { amount, fullWeek } = rewards[taskId];
  return `<span class="pill coin">${DAYS_IN_WEEK} gün ${esc(taskById(taskId).short.toLocaleLowerCase("tr"))}: ${money(amount * DAYS_IN_WEEK)} yerine ${money(fullWeek)}</span>`;
}

export function renderEarnings() {
  const { rewards } = state.settings;
  const start = weekStart(state.weekAnchor);
  const week = weekSummary(start, state, rewards);
  const label = `${formatShortDate(start)} – ${formatShortDate(addDays(start, DAYS_IN_WEEK - 1))}`;

  return `
    ${dateNav({ action: "shift-week", picker: "week", value: state.weekAnchor, label, canGoNext: start < weekStart(todayISO()) })}
    <div class="tiles">
      <div class="tile coin"><div class="label">Haftalık toplam</div><div class="value num">${money(week.total)}</div></div>
      ${Object.entries(week.byPayer).map(([payer, amount]) =>
        `<div class="tile"><div class="label">${esc(payer)} ödeyecek</div><div class="value num">${money(amount)}</div></div>`).join("")}
    </div>
    <section class="card">
      <div class="row spread">
        <h3>Gün gün</h3>
        ${week.fullWeekTasks.map((taskId) => fullWeekPill(taskId, rewards)).join("")}
      </div>
      <div class="scroll-x">
        <table>
          <thead><tr><th>Gün</th>${DAILY_TASKS.map((task) => `<th>${esc(task.short)}</th>`).join("")}<th>Namaz</th><th class="r">${CURRENCY}</th></tr></thead>
          <tbody>
            ${week.rows.map((r) => `<tr>
              <td>${esc(formatRowDate(r.iso))}</td>
              ${DAILY_TASKS.map((task) => `<td>${mark(r.day[task.id])}</td>`).join("")}
              <td class="num">${r.day.prayers.length}/${PRAYERS.length}</td>
              <td class="r num">${formatNumber(sumValues(r.earned))}</td></tr>`).join("")}
          </tbody>
          <tfoot>
            <tr><td>Toplam</td>
            ${[...DAILY_TASKS.map((task) => task.id), "prayer"].map((key) => `<td class="num">${formatNumber(week.totals[key])}</td>`).join("")}
            <td class="r num">${formatNumber(week.dailyTotal)}</td></tr>
          </tfoot>
        </table>
      </div>
      ${week.totals.exam ? `<p class="strong num">Sınav ödülü: +${money(week.totals.exam)}</p>` : ""}
    </section>
    <div class="tiles"><div class="tile"><div class="label">Bugüne kadar toplam kazanç</div><div class="value num">${money(allTimeTotal(state, rewards))}</div></div></div>`;
}
