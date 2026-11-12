import { CURRENCY, DAYS_IN_WEEK } from "../config.js";
import { esc } from "../format.js";
import { state } from "../state.js";
import { DAILY_TASKS } from "../tasks.js";
import { formError } from "./shared.js";

function amountField(name, label, value) {
  return `<div class="field"><label for="${name}">${esc(label)}</label>
    <input id="${name}" name="${name}" type="number" min="0" step="1" inputmode="numeric" value="${esc(value)}"></div>`;
}

const prayerReward = { key: "prayer", short: "Namaz" };

/* Ayarlar formundaki ödül alanları; hem çizimde hem kaydederken kullanılır. */
export function rewardFields(rewards) {
  const fields = [];
  for (const { id: key, short } of DAILY_TASKS) {
    fields.push({ key, field: "amount", name: `${key}.amount`, label: `${short}, günlük (${rewards[key].payer})` });
    if (rewards[key].fullWeek !== undefined) {
      fields.push({ key, field: "fullWeek", name: `${key}.fullWeek`, label: `${short}, ${DAYS_IN_WEEK} gün tam hafta` });
    }
    if (rewards[key].questions !== undefined) {
      fields.push({ key, field: "questions", name: `${key}.questions`, label: `${short}, ders başına soru sayısı` });
    }
  }
  const { key, short } = prayerReward;
  fields.push({ key, field: "amount", name: `${key}.amount`, label: `${short}, vakit başı (${rewards[key].payer})` });
  return fields;
}

export function renderSettings() {
  const { rewards, subjects, goal } = state.settings;
  return `<form class="card" data-form="settings" novalidate>
    <h2>Ödül tutarları (${CURRENCY})</h2>
    <div class="form-grid">
      ${rewardFields(rewards).map(({ key, field, name, label }) => amountField(name, label, rewards[key][field])).join("")}
    </div>
    <h2>Hedef</h2>
    <div class="form-grid">
      <div class="field"><label for="goalName">Hedefin adı</label>
        <input id="goalName" name="goalName" type="text" placeholder="Bisiklet" value="${esc(goal.name)}"></div>
      ${amountField("goalAmount", `Hedef tutarı (${CURRENCY}), yoksa 0`, goal.amount)}
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
