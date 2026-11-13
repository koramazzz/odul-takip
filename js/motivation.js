/* Günün ilerlemesi, cesaret sözleri, seri ve kutlanacak anlar. Saf hesap; ekrana dokunmaz. */
import { ENCOURAGEMENTS, MILESTONES, PRAYERS } from "./config.js";
import { weekStart } from "./dates.js";
import { dayEarnings, dayOf, examRewards, prayerBonusReached, sumValues, weekSummary } from "./earnings.js";
import { DAILY_TASKS, taskById } from "./tasks.js";

const DAILY_GOAL_COUNT = DAILY_TASKS.length + PRAYERS.length;
const FULL_WEEK = "fullWeek";

export function dayProgress(day) {
  const done = DAILY_TASKS.filter((task) => day[task.id]).length + day.prayers.length;
  return { done, total: DAILY_GOAL_COUNT, ratio: done / DAILY_GOAL_COUNT };
}

export const encouragement = (ratio) => ENCOURAGEMENTS.find((e) => ratio >= e.from).text;

/* Bir işaretlemeden önce ve sonra karşılaştırılacak durum. */
export function progressSnapshot(data, iso, rewards) {
  const { days } = data;
  const day = dayOf(days, iso);
  const week = weekSummary(weekStart(iso), data, rewards);
  const rewardedExams = examRewards(data.exams, rewards);
  const progress = dayProgress(day);
  const fullWeeks = Object.fromEntries(
    DAILY_TASKS.map((task) => [`${FULL_WEEK}:${task.id}`, week.fullWeekTasks.includes(task.id)]),
  );
  return {
    iso,
    done: progress.done,
    dayTotal: sumValues(dayEarnings(day, rewards)),
    weekTotal: week.total,
    examRewardCount: rewardedExams.length,
    examRewardTotal: rewardedExams.reduce((sum, r) => sum + r.amount, 0),
    reached: {
      dayComplete: progress.done === progress.total,
      ...fullWeeks,
      allPrayers: day.prayers.length === PRAYERS.length,
      prayerBonus: prayerBonusReached(day, rewards),
    },
  };
}

/* Bu işaretlemeyle yeni ulaşılan anlar; `reached` sırasıyla, en büyüğü önce. */
export function newMilestones(before, after) {
  return Object.keys(after.reached).filter((key) => after.reached[key] && !before.reached[key]);
}

/* Anın başlığı ve kapsamı. Tam hafta anlarının başlığı görevden gelir ("fullWeek:reading"). */
export function describeMilestone(key) {
  const [name, taskId] = key.split(":");
  return taskId ? { ...MILESTONES[name], title: taskById(taskId).fullWeekTitle } : MILESTONES[name];
}
