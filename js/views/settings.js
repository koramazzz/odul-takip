import { CURRENCY, DAYS_IN_WEEK } from "../config.js";
import { esc } from "../format.js";
import { state } from "../state.js";
import { formError } from "./shared.js";

function amountField(name, label, value) {
  return `<div class="field"><label for="${name}">${esc(label)}</label>
    <input id="${name}" name="${name}" type="number" min="0" step="1" inputmode="numeric" value="${esc(value)}"></div>`;
}

export function renderSettings() {
  const { rewards, subjects } = state.settings;
  return `<form class="card" data-form="settings" novalidate>
    <h2>Ödül tutarları (${CURRENCY})</h2>
    <div class="form-grid">
      ${amountField("homework", `Ödev, günlük (${rewards.homework.payer})`, rewards.homework.amount)}
      ${amountField("reading", `Kitap, günlük (${rewards.reading.payer})`, rewards.reading.amount)}
      ${amountField("fullWeek", `Kitap, ${DAYS_IN_WEEK} gün tam hafta`, rewards.reading.fullWeek)}
      ${amountField("prayer", `Namaz, vakit başı (${rewards.prayer.payer})`, rewards.prayer.amount)}
    </div>
    <h2>Dersler</h2>
    <div class="field"><label for="subjects">Her satıra bir ders yaz</label>
      <textarea id="subjects" name="subjects">${esc(subjects.join("\n"))}</textarea></div>
    ${formError(state.formError)}
    <div class="row">
      <button type="submit" class="btn primary">Ayarları kaydet</button>
      ${state.settingsSaved ? '<span class="pill good">Kaydedildi</span>' : ""}
    </div>
  </form>
  <section class="card">
    <h2>Hesap</h2>
    <p class="muted">${esc(state.session.user.email)} ile giriş yapıldı.</p>
    <div class="row"><button type="button" class="btn" data-action="sign-out">Çıkış yap</button></div>
  </section>`;
}
