import { EXAM_KINDS, PERCENT } from "./config.js";
import { todayISO } from "./dates.js";

export const questionCount = (r) => r.correct + r.wrong + r.blank;
export const successRate = (r) => (questionCount(r) ? (r.correct / questionCount(r)) * PERCENT : 0);
export const examKind = (id) => EXAM_KINDS.find((k) => k.id === id);
export const kindLabel = (id) => examKind(id)?.label ?? id;
export const byDateAsc = (a, b) => a.date.localeCompare(b.date);

export function examTotals(exam) {
  const sum = (key) => exam.results.reduce((a, r) => a + r[key], 0);
  const totals = { correct: sum("correct"), wrong: sum("wrong"), blank: sum("blank") };
  return { ...totals, rate: successRate(totals) };
}

/* Ders bazında: tarihe göre başarı serisi ve hata yapılan konuların kaç sınavda geçtiği. */
export function subjectStats(exams) {
  const stats = new Map();
  for (const exam of [...exams].sort(byDateAsc)) {
    for (const result of exam.results) {
      if (!stats.has(result.subject)) stats.set(result.subject, { subject: result.subject, series: [], mistakes: new Map() });
      const entry = stats.get(result.subject);
      entry.series.push({ date: exam.date, rate: successRate(result) });
      for (const topic of result.mistakes ?? []) entry.mistakes.set(topic, (entry.mistakes.get(topic) ?? 0) + 1);
    }
  }
  return [...stats.values()];
}

export const newExamDraft = () => ({ id: null, date: todayISO(), kind: EXAM_KINDS[0].id, name: "", rows: {} });

export function draftFromExam(exam) {
  const rows = Object.fromEntries(exam.results.map((r) => [r.subject, {
    correct: String(r.correct), wrong: String(r.wrong), blank: String(r.blank), mistakes: (r.mistakes ?? []).join(", "),
  }]));
  return { id: exam.id, date: exam.date, kind: exam.kind, name: exam.name, rows };
}

/* Formda gösterilecek satırlar. Ders ders girilmeyen türlerde tek satır vardır ve adı türün adıdır. */
export function draftSubjects(draft, subjects) {
  const kind = examKind(draft.kind);
  if (!kind.bySubject) return [kind.label];
  const otherKindRows = EXAM_KINDS.filter((k) => !k.bySubject).map((k) => k.label);
  return [...new Set([...subjects, ...Object.keys(draft.rows)])].filter((s) => !otherKindRows.includes(s));
}

/* Boş alan 0 sayılır; geçersiz değer null döner. */
export function parseCount(text) {
  if (text === undefined || text === null || text === "") return 0;
  const n = Number(text);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function buildExamFromDraft(draft, subjects) {
  if (!draft.date) return { error: "Sınavın tarihini seç." };
  if (draft.date > todayISO()) return { error: "Sınav tarihi gelecekte olamaz." };
  const results = [];
  for (const subject of draftSubjects(draft, subjects)) {
    const row = draft.rows[subject] ?? {};
    const counts = { correct: parseCount(row.correct), wrong: parseCount(row.wrong), blank: parseCount(row.blank) };
    if (Object.values(counts).includes(null)) return { error: `${subject}: sayılar 0 ya da daha büyük tam sayı olmalı.` };
    if (!questionCount(counts)) continue;
    const mistakes = (row.mistakes ?? "").split(",").map((t) => t.trim()).filter(Boolean);
    results.push({ subject, ...counts, mistakes });
  }
  if (!results.length) return { error: "Doğru, yanlış ya da boş sayısı gir." };
  return { exam: { date: draft.date, kind: draft.kind, name: draft.name.trim() || kindLabel(draft.kind), results } };
}
