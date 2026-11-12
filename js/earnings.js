import { DAYS_IN_WEEK } from "./config.js";
import { weekDates, weekStart } from "./dates.js";

export const emptyDay = () => ({ homework: false, reading: false, prayers: [] });
export const dayOf = (days, iso) => ({ ...emptyDay(), ...(days[iso] ?? {}) });
export const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

export function dayEarnings(day, rewards) {
  return {
    homework: day.homework ? rewards.homework.amount : 0,
    reading: day.reading ? rewards.reading.amount : 0,
    prayer: day.prayers.length * rewards.prayer.amount,
  };
}

/* Haftanın her günü kitap okunduysa kitap ödülü günlük toplam yerine tam hafta tutarı olur. */
export function weekSummary(startISO, days, rewards) {
  const rows = weekDates(startISO).map((iso) => {
    const day = dayOf(days, iso);
    return { iso, day, earned: dayEarnings(day, rewards) };
  });
  const sumOf = (key) => rows.reduce((a, r) => a + r.earned[key], 0);
  const readingDays = rows.filter((r) => r.day.reading).length;
  const fullWeek = readingDays === DAYS_IN_WEEK;
  const totals = {
    homework: sumOf("homework"),
    reading: fullWeek ? rewards.reading.fullWeek : sumOf("reading"),
    prayer: sumOf("prayer"),
  };
  const byPayer = {};
  for (const [key, amount] of Object.entries(totals)) {
    const { payer } = rewards[key];
    byPayer[payer] = (byPayer[payer] ?? 0) + amount;
  }
  return { rows, readingDays, fullWeek, totals, byPayer, total: sumValues(totals) };
}

export function allTimeTotal(days, rewards) {
  const starts = new Set(Object.keys(days).map(weekStart));
  return [...starts].reduce((sum, start) => sum + weekSummary(start, days, rewards).total, 0);
}
