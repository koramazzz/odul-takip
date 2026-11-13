import { todayISO } from "../dates.js";
import { esc, money } from "../format.js";

/* Günlük görev düğmesi. `task` görevin kimliğidir; rengini (CSS sınıfı) de o belirler. */
export function checkButton({ task, icon, pressed, title, reward }) {
  return `<button type="button" class="check ${task}" data-action="toggle-task" data-task="${task}" aria-pressed="${pressed}">
    <span class="icon" aria-hidden="true">${icon}</span>
    <span class="grow">${esc(title)}</span>
    <span class="reward num">+${money(reward)}</span>
    <span class="box" aria-hidden="true">✓</span>
  </button>`;
}

/* Değişince eski değerden yenisine sayarak gösterilen para tutarı. */
export const countedMoney = (key, amount) =>
  `<span data-count="${amount}" data-count-key="${key}">${money(amount)}</span>`;

/* Önceki/sonraki okları ve geçmişe doğrudan gitmek için tarih seçici. */
export function dateNav({ action, picker, value, label, canGoNext }) {
  const pickerId = `pick-${picker}`;
  return `<div class="date-nav">
    <button type="button" class="btn" data-action="${action}" data-step="-1" aria-label="Önceki">‹</button>
    <div class="date-nav-center">
      <h2>${esc(label)}</h2>
      <input id="${pickerId}" class="date-pick" type="date" aria-label="Tarih seç" data-pick="${picker}" value="${esc(value)}" max="${todayISO()}">
    </div>
    <button type="button" class="btn" data-action="${action}" data-step="1" aria-label="Sonraki" ${canGoNext ? "" : "disabled"}>›</button>
  </div>`;
}

export const formError = (message) => (message ? `<p class="error" role="alert">${esc(message)}</p>` : "");
