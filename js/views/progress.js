import { ALL_KINDS, EXAM_KINDS, PERCENT, SPARK } from "../config.js";
import { byDateAsc, examTotals, subjectStats } from "../exams.js";
import { esc, percent } from "../format.js";
import { state } from "../state.js";

const FILTERS = [{ id: ALL_KINDS, label: "Hepsi" }, ...EXAM_KINDS];

function sparkline(rates) {
  const { width, height, padX, padY, gridRates, dotRadius } = SPARK;
  const innerW = width - padX - dotRadius * 2;
  const innerH = height - padY * 2;
  const last = rates.length - 1;
  const x = (i) => padX + (last > 0 ? (i / last) * innerW : innerW);
  const y = (rate) => padY + innerH - (rate / PERCENT) * innerH;
  const points = rates.map((rate, i) => `${x(i).toFixed(1)},${y(rate).toFixed(1)}`);
  const area = `${padX},${y(0)} ${points.join(" ")} ${x(last).toFixed(1)},${y(0)}`;
  const grid = gridRates.map((g) => `<line x1="${padX}" x2="${width}" y1="${y(g)}" y2="${y(g)}" stroke="var(--line)" stroke-width="1"/>
    <text x="0" y="${y(g) + 3}">${percent(g)}</text>`).join("");
  const line = last > 0
    ? `<polygon points="${area}" fill="var(--primary)" opacity=".12"/>
       <polyline points="${points.join(" ")}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`
    : "";
  return `<svg class="spark" viewBox="0 0 ${width} ${height}" role="img" aria-label="Başarı yüzdesi: ${rates.map((r) => Math.round(r)).join(", ")}">
    ${grid}${line}
    <circle cx="${x(last).toFixed(1)}" cy="${y(rates[last]).toFixed(1)}" r="${dotRadius}" fill="var(--primary)"/>
  </svg>`;
}

function trendPill(series) {
  if (series.length < 2) return '<span class="pill">İlk sınav</span>';
  const diff = Math.round(series.at(-1).rate - series.at(-2).rate);
  if (diff > 0) return `<span class="pill good num">▲ ${diff} puan arttı</span>`;
  if (diff < 0) return `<span class="pill bad num">▼ ${Math.abs(diff)} puan düştü</span>`;
  return '<span class="pill">Değişmedi</span>';
}

function renderSubjectCard({ subject, series, mistakes }) {
  const average = series.reduce((a, s) => a + s.rate, 0) / series.length;
  const topics = [...mistakes.entries()].sort((a, b) => b[1] - a[1]);
  return `<article class="card">
    <div class="row spread"><h3>${esc(subject)}</h3>${trendPill(series)}</div>
    <div class="row">
      <span class="pill coin num">Son sınav ${percent(series.at(-1).rate)}</span>
      <span class="pill num">Ortalama ${percent(average)}</span>
      <span class="pill num">${series.length} sınav</span>
    </div>
    ${sparkline(series.map((s) => s.rate))}
    <div>
      <p class="muted strong">En çok hata yapılan konular</p>
      ${topics.length
        ? `<div class="topics">${topics.map(([topic, count]) => `<span class="pill bad">${esc(topic)} · ${count} sınav</span>`).join("")}</div>`
        : '<p class="muted">Bu ders için konu girilmedi.</p>'}
    </div>
  </article>`;
}

export function renderProgress() {
  const exams = state.exams
    .filter((e) => state.examFilter === ALL_KINDS || e.kind === state.examFilter)
    .sort(byDateAsc);
  const filterBar = `<div class="chips">${FILTERS.map((f) =>
    `<button type="button" class="chip" data-action="set-exam-filter" data-kind="${f.id}" aria-pressed="${f.id === state.examFilter}">${esc(f.label)}</button>`).join("")}</div>`;
  if (!exams.length) return `${filterBar}<p class="muted">Gelişimi görmek için önce Sınavlar bölümünden sınav ekle.</p>`;

  const overall = exams.map((exam) => ({ rate: examTotals(exam).rate }));
  return `${filterBar}
    <div class="tiles">
      <div class="tile"><div class="label">Sınav sayısı</div><div class="value num">${exams.length}</div></div>
      <div class="tile coin"><div class="label">Son sınav başarısı</div><div class="value num">${percent(overall.at(-1).rate)}</div></div>
      <div class="tile"><div class="label">Önceki sınava göre</div><div class="tile-pill">${trendPill(overall)}</div></div>
    </div>
    ${subjectStats(exams).map(renderSubjectCard).join("")}`;
}
