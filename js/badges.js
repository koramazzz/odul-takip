/* Rozetler: kayıtlı günlerden ve sınavlardan hesaplanır, ayrıca saklanmaz. Saf hesap. */
import { BADGES, PRAYERS } from "./config.js";
import { addDays } from "./dates.js";
import { allTimeTotal, dayOf } from "./earnings.js";
import { examTotals } from "./exams.js";
import { dayProgress } from "./motivation.js";

/* Arka arkaya gelen en uzun gün dizisi. */
function longestRun(isoDates) {
  const dates = new Set(isoDates);
  let best = 0;
  for (const iso of dates) {
    if (dates.has(addDays(iso, -1))) continue; // dizinin başı değil
    let length = 1;
    while (dates.has(addDays(iso, length))) length += 1;
    best = Math.max(best, length);
  }
  return best;
}

export function computeStats({ days, exams }, rewards) {
  const entries = Object.keys(days).map((iso) => ({ iso, day: dayOf(days, iso) }));
  const progress = entries.map(({ day }) => dayProgress(day));
  return {
    tasksDone: progress.reduce((sum, p) => sum + p.done, 0),
    bestReadingStreak: longestRun(entries.filter(({ day }) => day.reading).map(({ iso }) => iso)),
    homeworkDays: entries.filter(({ day }) => day.homework).length,
    fullPrayerDays: entries.filter(({ day }) => day.prayers.length === PRAYERS.length).length,
    perfectDays: progress.filter((p) => p.done === p.total).length,
    totalEarned: allTimeTotal({ days, exams }, rewards),
    examCount: exams.length,
    bestExamRate: Math.round(Math.max(0, ...exams.map((exam) => examTotals(exam).rate))),
  };
}

export function badgeStates(stats) {
  return BADGES.map((badge) => {
    const value = Math.min(stats[badge.stat], badge.target);
    return { ...badge, value, unlocked: value >= badge.target, ratio: value / badge.target };
  });
}

export const unlockedBadgeIds = (stats) => badgeStates(stats).filter((b) => b.unlocked).map((b) => b.id);
export const badgeById = (id) => BADGES.find((b) => b.id === id);
