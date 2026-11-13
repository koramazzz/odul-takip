/* Kazanç hesapları. `data` kayıtlı günleri ve sınavları taşır: { days, exams }. */
import { DAYS_IN_WEEK } from "./config.js";
import { addDays, weekDates, weekStart } from "./dates.js";
import { examReward } from "./exams.js";
import { DAILY_TASKS } from "./tasks.js";

export const emptyDay = () => ({ ...Object.fromEntries(DAILY_TASKS.map((task) => [task.id, false])), prayers: [] });
export const dayOf = (days, iso) => ({ ...emptyDay(), ...(days[iso] ?? {}) });
export const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

export const prayerBonusReached = (day, rewards) => day.prayers.length >= rewards.prayer.bonusMinCount;

/* Bir günün görevlerinden kazanılan tutarlar. Namaz tutarı, yeterli vakit kılındıysa bonusu da içerir. */
export function dayEarnings(day, rewards) {
  const earned = Object.fromEntries(DAILY_TASKS.map((task) => [task.id, day[task.id] ? rewards[task.id].amount : 0]));
  const prayerBonus = prayerBonusReached(day, rewards) ? rewards.prayer.bonusAmount : 0;
  return { ...earned, prayer: day.prayers.length * rewards.prayer.amount + prayerBonus };
}

/* Ödül kazanan sınavlar: [{ date, amount }]. */
export const examRewards = (exams, rewards) =>
  exams.map((exam) => ({ date: exam.date, amount: examReward(exam, rewards.exam) })).filter((r) => r.amount > 0);

/* Bir görev haftanın her günü yapıldıysa ve ödülünde `fullWeek` varsa, günlük toplam yerine o tutar sayılır.
   `totals.exam` o hafta kaydedilen sınavların ödülüdür; gün satırlarına dahil değildir. */
export function weekSummary(startISO, { days, exams }, rewards) {
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
  const dailyTotal = sumValues(totals);
  const endISO = addDays(startISO, DAYS_IN_WEEK - 1);
  totals.exam = examRewards(exams, rewards)
    .filter((r) => r.date >= startISO && r.date <= endISO)
    .reduce((sum, r) => sum + r.amount, 0);
  const byPayer = {};
  for (const [key, amount] of Object.entries(totals)) {
    const { payer } = rewards[key];
    byPayer[payer] = (byPayer[payer] ?? 0) + amount;
  }
  return { rows, daysDone, fullWeekTasks, totals, dailyTotal, byPayer, total: sumValues(totals) };
}

export function allTimeTotal(data, rewards) {
  const dates = [...Object.keys(data.days), ...examRewards(data.exams, rewards).map((r) => r.date)];
  const starts = new Set(dates.map(weekStart));
  return [...starts].reduce((sum, start) => sum + weekSummary(start, data, rewards).total, 0);
}
