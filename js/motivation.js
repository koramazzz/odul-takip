/* Günün ilerlemesi, cesaret sözleri, seri ve kutlanacak anlar. Saf hesap; ekrana dokunmaz. */
import { ENCOURAGEMENTS, MILESTONES, PRAYERS } from "./config.js";
import { addDays, weekStart } from "./dates.js";
import { dayEarnings, dayOf, sumValues, weekSummary } from "./earnings.js";
import { DAILY_TASKS, taskById } from "./tasks.js";

const DAILY_GOAL_COUNT = DAILY_TASKS.length + PRAYERS.length;
const FULL_WEEK = "fullWeek";

export function dayProgress(day) {
  const done = DAILY_TASKS.filter((task) => day[task.id]).length + day.prayers.length;
  return { done, total: DAILY_GOAL_COUNT, ratio: done / DAILY_GOAL_COUNT };
}

export const encouragement = (ratio) => ENCOURAGEMENTS.find((e) => ratio >= e.from).text;

/* Seçili günde biten, arka arkaya görevin yapıldığı gün sayısı. Seçili gün henüz yapılmadıysa dünden sayar. */
export function taskStreak(days, iso, taskId) {
  let cursor = dayOf(days, iso)[taskId] ? iso : addDays(iso, -1);
  let streak = 0;
  while (dayOf(days, cursor)[taskId]) {
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
  const fullWeeks = Object.fromEntries(
    DAILY_TASKS.map((task) => [`${FULL_WEEK}:${task.id}`, week.fullWeekTasks.includes(task.id)]),
  );
  return {
    iso,
    done: progress.done,
    dayTotal: sumValues(dayEarnings(day, rewards)),
    weekTotal: week.total,
    reached: {
      dayComplete: progress.done === progress.total,
      ...fullWeeks,
      allPrayers: day.prayers.length === PRAYERS.length,
    },
  };
}

/* Bu işaretlemeyle yeni ulaşılan anlar; en büyüğü önce. Gün tamamlandıysa "5 vakit" ayrıca sayılmaz. */
export function newMilestones(before, after) {
  const fresh = Object.keys(after.reached).filter((key) => after.reached[key] && !before.reached[key]);
  return fresh.includes("dayComplete") ? fresh.filter((key) => key !== "allPrayers") : fresh;
}

/* Anın başlığı, kapsamı ve sesi. Tam hafta anlarının başlığı görevden gelir ("fullWeek:reading"). */
export function describeMilestone(key) {
  const [name, taskId] = key.split(":");
  return taskId ? { ...MILESTONES[name], title: taskById(taskId).fullWeekTitle } : MILESTONES[name];
}
