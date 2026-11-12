import { DAYS_IN_WEEK } from "./config.js";
import { weekDates, weekStart } from "./dates.js";
import { DAILY_TASKS } from "./tasks.js";

export const emptyDay = () => ({ ...Object.fromEntries(DAILY_TASKS.map((task) => [task.id, false])), prayers: [] });
export const dayOf = (days, iso) => ({ ...emptyDay(), ...(days[iso] ?? {}) });
export const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

export function dayEarnings(day, rewards) {
  const earned = Object.fromEntries(DAILY_TASKS.map((task) => [task.id, day[task.id] ? rewards[task.id].amount : 0]));
  return { ...earned, prayer: day.prayers.length * rewards.prayer.amount };
}

/* Bir görev haftanın her günü yapıldıysa ve ödülünde `fullWeek` varsa, günlük toplam yerine o tutar sayılır. */
export function weekSummary(startISO, days, rewards) {
  const rows = weekDates(startISO).map((iso) => {
    const day = dayOf(days, iso);
    return { iso, day, earned: dayEarnings(day, rewards) };
  });
  const sumOf = (key) => rows.reduce((a, r) => a + r.earned[key], 0);
  const daysDone = Object.fromEntries(DAILY_TASKS.map((task) => [task.id, rows.filter((r) => r.day[task.id]).length]));
  const fullWeekTasks = DAILY_TASKS
    .filter((task) => rewards[task.id].fullWeek !== undefined && daysDone[task.id] === DAYS_IN_WEEK)
    .map((task) => task.id);
  const totals = { prayer: sumOf("prayer") };
  for (const task of DAILY_TASKS) {
    totals[task.id] = fullWeekTasks.includes(task.id) ? rewards[task.id].fullWeek : sumOf(task.id);
  }
  const byPayer = {};
  for (const [key, amount] of Object.entries(totals)) {
    const { payer } = rewards[key];
    byPayer[payer] = (byPayer[payer] ?? 0) + amount;
  }
  return { rows, daysDone, fullWeekTasks, totals, byPayer, total: sumValues(totals) };
}

export function allTimeTotal(days, rewards) {
  const starts = new Set(Object.keys(days).map(weekStart));
  return [...starts].reduce((sum, start) => sum + weekSummary(start, days, rewards).total, 0);
}
