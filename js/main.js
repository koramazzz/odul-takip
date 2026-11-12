import { DAYS_IN_WEEK, SYNC_MESSAGES } from "./config.js";
import { addDays, todayISO } from "./dates.js";
import { dayOf } from "./earnings.js";
import { buildExamFromDraft, draftFromExam, newExamDraft, parseCount } from "./exams.js";
import { esc } from "./format.js";
import * as repository from "./repository.js";
import { state } from "./state.js";
import { store } from "./store.js";
import { renderEarnings } from "./views/earnings.js";
import { renderExams } from "./views/exams.js";
import { renderLogin } from "./views/login.js";
import { renderProgress } from "./views/progress.js";
import { renderSettings } from "./views/settings.js";
import { renderToday } from "./views/today.js";

const ROUTES = [
  { id: "bugun", label: "Bugün", render: renderToday },
  { id: "kazanc", label: "Kazanç", render: renderEarnings },
  { id: "sinavlar", label: "Sınavlar", render: renderExams },
  { id: "gelisim", label: "Gelişim", render: renderProgress },
  { id: "ayarlar", label: "Ayarlar", render: renderSettings },
];
const DEFAULT_ROUTE = ROUTES[0];

const app = document.getElementById("app");
const tabs = document.getElementById("tabs");
const banner = document.getElementById("banner");

/* ---------- Çizim ---------- */
function renderBanner() {
  const message = state.session ? SYNC_MESSAGES[state.sync] : "";
  banner.innerHTML = message ? `<div class="banner">${esc(message)}</div>` : "";
}

function renderTabs() {
  tabs.hidden = !state.session;
  tabs.innerHTML = ROUTES.map((r) =>
    `<a class="tab" href="#${r.id}" ${r.id === state.route.id ? 'aria-current="page"' : ""}>${esc(r.label)}</a>`).join("");
}

function render() {
  state.renderPending = false;
  renderTabs();
  renderBanner();
  app.innerHTML = state.session ? state.route.render() : renderLogin();
}

/* Başka cihazdan gelen güncelleme, form doldurulurken yazılanı silmesin. */
function renderUnlessTyping() {
  const typing = app.querySelector("form")?.contains(document.activeElement);
  if (typing) state.renderPending = true;
  else render();
}

/* ---------- Eylemler ---------- */
function updateSelectedDay(change) {
  const iso = state.selectedDate;
  store.saveDay(iso, change(dayOf(state.days, iso)));
}

const toggleFlag = (key) => updateSelectedDay((day) => ({ ...day, [key]: !day[key] }));

const togglePrayer = (id) => updateSelectedDay((day) => ({
  ...day,
  prayers: day.prayers.includes(id) ? day.prayers.filter((p) => p !== id) : [...day.prayers, id],
}));

function resetExamForm() {
  state.examDraft = newExamDraft();
  state.formError = "";
}

function editExam(id) {
  const exam = state.exams.find((e) => e.id === id);
  if (!exam) return;
  state.examDraft = draftFromExam(exam);
  state.formError = "";
  window.scrollTo({ top: 0 });
}

async function signOut() {
  await repository.signOut();
  location.reload();
}

const actions = {
  "toggle-homework": () => toggleFlag("homework"),
  "toggle-reading": () => toggleFlag("reading"),
  "toggle-prayer": (el) => togglePrayer(el.dataset.prayer),
  "shift-day": (el) => { state.selectedDate = addDays(state.selectedDate, Number(el.dataset.step)); },
  "shift-week": (el) => { state.weekAnchor = addDays(state.weekAnchor, Number(el.dataset.step) * DAYS_IN_WEEK); },
  "set-exam-filter": (el) => { state.examFilter = el.dataset.kind; },
  "edit-exam": (el) => editExam(el.dataset.id),
  "ask-delete-exam": (el) => { state.pendingDeleteId = el.dataset.id; },
  "cancel-delete-exam": () => { state.pendingDeleteId = null; },
  "confirm-delete-exam": (el) => { store.deleteExam(el.dataset.id); state.pendingDeleteId = null; },
  "reset-exam-form": resetExamForm,
  "sign-out": signOut,
};

/* Geçmiş bir tarihe doğrudan gitmek için; gelecek tarih seçilemez. */
const datePickers = {
  day: (iso) => { state.selectedDate = iso; },
  week: (iso) => { state.weekAnchor = iso; },
};

/* ---------- Formlar ---------- */
function submitExam() {
  const { exam, error } = buildExamFromDraft(state.examDraft, state.settings.subjects);
  if (error) { state.formError = error; return; }
  store.saveExam(state.examDraft.id, exam);
  resetExamForm();
}

function submitSettings(form) {
  const data = new FormData(form);
  const amounts = Object.fromEntries(["homework", "reading", "fullWeek", "prayer"].map((name) => [name, parseCount(data.get(name))]));
  const subjects = [...new Set(String(data.get("subjects")).split("\n").map((s) => s.trim()).filter(Boolean))];
  if (Object.values(amounts).includes(null)) { state.formError = "Tutarlar 0 ya da daha büyük tam sayı olmalı."; return; }
  if (!subjects.length) { state.formError = "En az bir ders yaz."; return; }
  const { rewards } = state.settings;
  store.saveSettings({
    rewards: {
      homework: { ...rewards.homework, amount: amounts.homework },
      reading: { ...rewards.reading, amount: amounts.reading, fullWeek: amounts.fullWeek },
      prayer: { ...rewards.prayer, amount: amounts.prayer },
    },
    subjects,
  });
  state.formError = "";
  state.settingsSaved = true;
}

async function submitLogin(form) {
  const data = new FormData(form);
  try {
    state.session = await repository.signIn(String(data.get("email")).trim(), String(data.get("password")));
    state.formError = "";
    startData();
  } catch {
    state.formError = "Giriş yapılamadı. E-posta ve şifreyi kontrol et.";
  }
}

const formHandlers = { exam: submitExam, settings: submitSettings, login: submitLogin };

/* ---------- Olaylar ---------- */
app.addEventListener("click", async (event) => {
  const el = event.target.closest("[data-action]");
  if (!el || el.disabled) return;
  await actions[el.dataset.action](el);
  render();
});

app.addEventListener("submit", async (event) => {
  event.preventDefault();
  await formHandlers[event.target.dataset.form](event.target);
  render();
});

app.addEventListener("input", (event) => {
  const { draft, subject, field } = event.target.dataset;
  const { value } = event.target;
  if (draft) state.examDraft[draft] = value;
  else if (subject) state.examDraft.rows[subject] = { ...(state.examDraft.rows[subject] ?? {}), [field]: value };
});

app.addEventListener("change", (event) => {
  const { pick } = event.target.dataset;
  const iso = event.target.value;
  if (!pick || !iso) return;
  datePickers[pick](iso > todayISO() ? todayISO() : iso);
  render();
});

app.addEventListener("focusout", () => {
  if (state.renderPending) setTimeout(renderUnlessTyping, 0);
});

function applyRoute() {
  state.route = ROUTES.find((r) => r.id === location.hash.slice(1)) ?? DEFAULT_ROUTE;
  state.formError = "";
  state.settingsSaved = false;
  render();
}

/* Tablet uykudan dönünce kaçırılan değişiklikleri al. */
function refreshWhenVisible() {
  if (document.visibilityState === "visible" && state.session) store.refresh();
}

function startData() {
  store.start({ onChange: renderUnlessTyping, onStatus: renderBanner });
  document.addEventListener("visibilitychange", refreshWhenVisible);
}

async function boot() {
  window.addEventListener("hashchange", applyRoute);
  applyRoute();
  state.session = await repository.getSession();
  render();
  if (state.session) startData();
}

boot();
