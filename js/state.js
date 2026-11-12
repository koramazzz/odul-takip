import { ALL_KINDS, DEFAULT_SETTINGS, SYNC } from "./config.js";
import { todayISO } from "./dates.js";
import { newExamDraft } from "./exams.js";

export const state = {
  session: null,
  route: null,
  selectedDate: todayISO(),
  weekAnchor: todayISO(),
  days: {},
  exams: [],
  settings: DEFAULT_SETTINGS,
  sync: SYNC.loading,
  examDraft: newExamDraft(),
  examFilter: ALL_KINDS,
  pendingDeleteId: null,
  formError: "",
  settingsSaved: false,
  renderPending: false,
};

/* Kayıtlı ayarlarda eksik kalan alanlar varsayılanlarla tamamlanır. */
export function mergeSettings(saved) {
  const rewards = {};
  for (const [key, defaults] of Object.entries(DEFAULT_SETTINGS.rewards)) {
    rewards[key] = { ...defaults, ...(saved?.rewards?.[key] ?? {}) };
  }
  const subjects = Array.isArray(saved?.subjects) && saved.subjects.length ? saved.subjects : DEFAULT_SETTINGS.subjects;
  return { rewards, subjects };
}
