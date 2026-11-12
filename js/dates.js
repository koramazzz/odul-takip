import { DAYS_IN_WEEK, WEEK_STARTS_ON } from "./config.js";

const pad2 = (n) => String(n).padStart(2, "0");

export const toISO = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const fromISO = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const todayISO = () => toISO(new Date());

export const addDays = (iso, n) => {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

export const weekStart = (iso) =>
  addDays(iso, -((fromISO(iso).getDay() - WEEK_STARTS_ON + DAYS_IN_WEEK) % DAYS_IN_WEEK));

export const weekDates = (startISO) => Array.from({ length: DAYS_IN_WEEK }, (_, i) => addDays(startISO, i));
