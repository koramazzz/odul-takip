import { CURRENCY, DAYS_IN_WEEK, PRAYERS } from "../config.js";
import { addDays, todayISO, weekStart } from "../dates.js";
import { allTimeTotal, sumValues, weekSummary } from "../earnings.js";
import { esc, formatNumber, formatRowDate, formatShortDate, money } from "../format.js";
import { state } from "../state.js";
import { dateNav } from "./shared.js";

const mark = (on) => (on ? '<span class="yes">✓</span>' : '<span class="no">–</span>');

export function renderEarnings() {
  const { rewards } = state.settings;
  const start = weekStart(state.weekAnchor);
  const week = weekSummary(start, state.days, rewards);
  const label = `${formatShortDate(start)} – ${formatShortDate(addDays(start, DAYS_IN_WEEK - 1))}`;
  const readingWithoutBonus = week.readingDays * rewards.reading.amount;

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
        ${week.fullWeek ? `<span class="pill coin">${DAYS_IN_WEEK} gün kitap: ${money(readingWithoutBonus)} yerine ${money(rewards.reading.fullWeek)}</span>` : ""}
      </div>
      <div class="scroll-x">
        <table>
          <thead><tr><th>Gün</th><th>Ödev</th><th>Kitap</th><th>Namaz</th><th class="r">Kazanç (${CURRENCY})</th></tr></thead>
          <tbody>
            ${week.rows.map((r) => `<tr>
              <td>${esc(formatRowDate(r.iso))}</td>
              <td>${mark(r.day.homework)}</td><td>${mark(r.day.reading)}</td>
              <td class="num">${r.day.prayers.length}/${PRAYERS.length}</td>
              <td class="r num">${formatNumber(sumValues(r.earned))}</td></tr>`).join("")}
          </tbody>
          <tfoot>
            <tr><td>Toplam (${CURRENCY})</td>
            ${[week.totals.homework, week.totals.reading, week.totals.prayer].map((n) => `<td class="num">${formatNumber(n)}</td>`).join("")}
            <td class="r num">${formatNumber(week.total)}</td></tr>
          </tfoot>
        </table>
      </div>
    </section>
    <div class="tiles"><div class="tile"><div class="label">Bugüne kadar toplam kazanç</div><div class="value num">${money(allTimeTotal(state.days, rewards))}</div></div></div>`;
}
