import { todayISO } from "../dates.js";
import { esc, money } from "../format.js";

export function checkButton({ action, pressed, title, reward }) {
  return `<button type="button" class="check" data-action="${action}" aria-pressed="${pressed}">
    <span class="box" aria-hidden="true">✓</span>
    <span class="grow">${esc(title)}</span>
    <span class="reward num">+${money(reward)}</span>
  </button>`;
}

/* Önceki/sonraki okları ve geçmişe doğrudan gitmek için tarih seçici. */
export function dateNav({ action, picker, value, label, canGoNext }) {
  const pickerId = `pick-${picker}`;
  return `<div class="date-nav">
    <button type="button" class="btn" data-action="${action}" data-step="-1" aria-label="Önceki">‹</button>
    <div class="date-nav-center">
      <h2>${esc(label)}</h2>
      <div class="date-pick">
        <label for="${pickerId}">Tarih seç</label>
        <input id="${pickerId}" type="date" data-pick="${picker}" value="${esc(value)}" max="${todayISO()}">
      </div>
    </div>
    <button type="button" class="btn" data-action="${action}" data-step="1" aria-label="Sonraki" ${canGoNext ? "" : "disabled"}>›</button>
  </div>`;
}

export const formError = (message) => (message ? `<p class="error" role="alert">${esc(message)}</p>` : "");
