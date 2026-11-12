/* Günün ilerlemesi, cesaret sözleri, seri ve kutlanacak anlar. Saf hesap; ekrana dokunmaz. */
import { ENCOURAGEMENTS, PRAYERS } from "./config.js";
import { addDays, weekStart } from "./dates.js";
import { dayEarnings, dayOf, sumValues, weekSummary } from "./earnings.js";

const DAILY_TASK_COUNT = 2 + PRAYERS.length; // ödev + kitap + her vakit

export function dayProgress(day) {
  const done = Number(day.homework) + Number(day.reading) + day.prayers.length;
  return { done, total: DAILY_TASK_COUNT, ratio: done / DAILY_TASK_COUNT };
}

export const encouragement = (ratio) => ENCOURAGEMENTS.find((e) => ratio >= e.from).text;

/* Seçili günde biten, arka arkaya kitap okunan gün sayısı. Seçili gün henüz okunmadıysa dünden sayar. */
export function readingStreak(days, iso) {
  let cursor = dayOf(days, iso).reading ? iso : addDays(iso, -1);
  let streak = 0;
  while (dayOf(days, cursor).reading) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/* Bir işaretlemeden önce ve sonra karşılaştırılacak durum. */
export function progressSnapshot(days, iso, rewards) {
  const day = dayOf(days, iso);
  const week = weekSummary(weekStart(iso), days, rewards);
  const progress = dayProgress(day);
  return {
    iso,
    done: progress.done,
    dayTotal: sumValues(dayEarnings(day, rewards)),
    weekTotal: week.total,
    reached: {
      dayComplete: progress.done === progress.total,
      fullWeek: week.fullWeek,
      allPrayers: day.prayers.length === PRAYERS.length,
    },
  };
}

/* Bu işaretlemeyle yeni ulaşılan anlar; en büyüğü önce. Gün tamamlandıysa "5 vakit" ayrıca sayılmaz. */
export function newMilestones(before, after) {
  const fresh = Object.keys(after.reached).filter((key) => after.reached[key] && !before.reached[key]);
  return fresh.includes("dayComplete") ? fresh.filter((key) => key !== "allPrayers") : fresh;
}
