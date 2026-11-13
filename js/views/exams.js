import { EXAM_KINDS } from "../config.js";
import { todayISO } from "../dates.js";
import { byDateAsc, draftSubjects, examKind, examReward, examTotals, kindLabel, successRate } from "../exams.js";
import { esc, formatLongDate, money, percent } from "../format.js";
import { state } from "../state.js";
import { formError } from "./shared.js";

const COUNT_FIELDS = [
  { field: "correct", label: "Doğru" },
  { field: "wrong", label: "Yanlış" },
  { field: "blank", label: "Boş" },
];

function countInput(index, subject, { field, label }, row) {
  const id = `exam-${field}-${index}`;
  return `<div class="field"><label for="${id}">${label}</label>
    <input id="${id}" type="number" min="0" step="1" inputmode="numeric" data-subject="${esc(subject)}" data-field="${field}" value="${esc(row[field] ?? "")}"></div>`;
}

function subjectRow(subject, index, row) {
  return `<div class="subject-row">
    <div class="name">${esc(subject)}</div>
    ${COUNT_FIELDS.map((f) => countInput(index, subject, f, row)).join("")}
    <div class="field wide"><label for="exam-mistakes-${index}">Hatalar</label>
      <input id="exam-mistakes-${index}" type="text" data-subject="${esc(subject)}" data-field="mistakes" placeholder="virgülle ayır" value="${esc(row.mistakes ?? "")}"></div>
  </div>`;
}

function renderExamForm() {
  const draft = state.examDraft;
  const rewardRule = state.settings.rewards.exam;
  return `<form class="card" data-form="exam" novalidate>
    <h2>${draft.id ? "Sınavı düzenle" : "Yeni sınav ekle"}</h2>
    <div class="form-grid">
      <div class="field"><label for="exam-date">Tarih</label><input id="exam-date" type="date" data-draft="date" value="${esc(draft.date)}" max="${todayISO()}"></div>
      <div class="field"><label for="exam-kind">Tür</label>
        <select id="exam-kind" data-draft="kind">${EXAM_KINDS.map((k) => `<option value="${k.id}" ${k.id === draft.kind ? "selected" : ""}>${esc(k.label)}</option>`).join("")}</select></div>
      <div class="field"><label for="exam-name">Sınavın adı</label><input id="exam-name" type="text" data-draft="name" placeholder="Yayın ya da kitap adı" value="${esc(draft.name)}"></div>
    </div>
    <p class="muted">${esc(examKind(draft.kind).hint)}</p>
    ${draft.kind === rewardRule.kind ? `<p class="strong num">Başarı ${percent(rewardRule.minRate)}'yi geçerse ${money(rewardRule.amount)} ödül!</p>` : ""}
    <div>${draftSubjects(draft, state.settings.subjects).map((subject, i) => subjectRow(subject, i, draft.rows[subject] ?? {})).join("")}</div>
    ${formError(state.formError)}
    <div class="row">
      <button type="submit" class="btn primary">${draft.id ? "Değişiklikleri kaydet" : "Sınavı kaydet"}</button>
      ${draft.id ? '<button type="button" class="btn" data-action="reset-exam-form">Vazgeç</button>' : ""}
    </div>
  </form>`;
}

function examActions(exam) {
  const id = esc(exam.id);
  if (state.pendingDeleteId === exam.id) {
    return `<span class="error">Bu sınav silinsin mi?</span>
      <button type="button" class="btn small danger" data-action="confirm-delete-exam" data-id="${id}">Evet, sil</button>
      <button type="button" class="btn small" data-action="cancel-delete-exam">Vazgeç</button>`;
  }
  return `<button type="button" class="btn small" data-action="edit-exam" data-id="${id}">Düzenle</button>
    <button type="button" class="btn small danger" data-action="ask-delete-exam" data-id="${id}">Sil</button>`;
}

function renderExamCard(exam) {
  const reward = examReward(exam, state.settings.rewards.exam);
  return `<article class="card">
    <div class="row spread">
      <div><h3>${esc(exam.name)}</h3><span class="muted">${esc(formatLongDate(exam.date))}</span></div>
      <div class="row"><span class="pill">${esc(kindLabel(exam.kind))}</span><span class="pill coin num">${percent(examTotals(exam).rate)}</span>
        ${reward ? `<span class="pill good num">Ödül +${money(reward)}</span>` : ""}</div>
    </div>
    <div class="exam-lines">
      ${exam.results.map((r) => `<div class="exam-line">
        <strong>${esc(r.subject)}</strong>
        <span class="num">${r.correct} doğru · ${r.wrong} yanlış · ${r.blank} boş · ${percent(successRate(r))}</span>
        ${r.mistakes?.length ? `<span class="muted full-line">Hatalar: ${esc(r.mistakes.join(", "))}</span>` : ""}
      </div>`).join("")}
    </div>
    <div class="row">${examActions(exam)}</div>
  </article>`;
}

export function renderExams() {
  const exams = [...state.exams].sort(byDateAsc).reverse();
  return `${renderExamForm()}
    <h2>Kayıtlı sınavlar</h2>
    ${exams.length ? exams.map(renderExamCard).join("") : '<p class="muted">Henüz sınav eklenmedi. İlk sınavı yukarıdan ekle.</p>'}`;
}
