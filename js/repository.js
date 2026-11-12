/* Supabase ile konuşan tek katman: oturum, tablolar ve canlı değişiklikler. */
import { REALTIME_CHANNEL, SETTINGS_ROW_ID, SUPABASE, TABLES } from "./config.js";

const client = window.supabase.createClient(SUPABASE.url, SUPABASE.publishableKey);

function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

export async function getSession() {
  return unwrap(await client.auth.getSession()).session;
}

export async function signIn(email, password) {
  return unwrap(await client.auth.signInWithPassword({ email, password })).session;
}

export async function signOut() {
  unwrap(await client.auth.signOut());
}

export async function fetchDays() {
  return unwrap(await client.from(TABLES.days).select("date, homework, reading, prayers"));
}

export async function saveDay(row) {
  unwrap(await client.from(TABLES.days).upsert(row));
}

export async function fetchExams() {
  return unwrap(await client.from(TABLES.exams).select("id, date, kind, name, results"));
}

export async function saveExam(row) {
  unwrap(await client.from(TABLES.exams).upsert(row));
}

export async function deleteExam(id) {
  unwrap(await client.from(TABLES.exams).delete().eq("id", id));
}

export async function fetchSettings() {
  const row = unwrap(await client.from(TABLES.settings).select("value").eq("id", SETTINGS_ROW_ID).maybeSingle());
  return row?.value ?? null;
}

export async function saveSettings(value) {
  unwrap(await client.from(TABLES.settings).upsert({ id: SETTINGS_ROW_ID, value }));
}

/* Başka cihazdan gelen her değişiklikte, değişen tablonun adıyla haber verir. */
export function subscribeToChanges(onTableChange) {
  client
    .channel(REALTIME_CHANNEL)
    .on("postgres_changes", { event: "*", schema: "public" }, (payload) => onTableChange(payload.table))
    .subscribe();
}
