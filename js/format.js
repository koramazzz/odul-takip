import { CURRENCY, LOCALE } from "./config.js";
import { fromISO } from "./dates.js";

const longDate = new Intl.DateTimeFormat(LOCALE, { weekday: "long", day: "numeric", month: "long" });
const shortDate = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short" });
const rowDate = new Intl.DateTimeFormat(LOCALE, { weekday: "short", day: "numeric" });
const weekday = new Intl.DateTimeFormat(LOCALE, { weekday: "short" });
const number = new Intl.NumberFormat(LOCALE);

export const formatLongDate = (iso) => longDate.format(fromISO(iso));
export const formatShortDate = (iso) => shortDate.format(fromISO(iso));
export const formatRowDate = (iso) => rowDate.format(fromISO(iso));
export const formatWeekday = (iso) => weekday.format(fromISO(iso));
export const formatNumber = (n) => number.format(n);
export const money = (n) => `${formatNumber(n)} ${CURRENCY}`;
export const percent = (n) => `%${Math.round(n)}`;

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (value) => String(value).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
