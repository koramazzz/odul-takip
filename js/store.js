/* Durumu hemen günceller, yazmayı arkada Supabase'e gönderir, uzaktan gelen değişiklikleri alır. */
import { SYNC, TABLES } from "./config.js";
import * as repository from "./repository.js";
import { mergeSettings, state } from "./state.js";

const loaders = {
  [TABLES.days]: async () => {
    const rows = await repository.fetchDays();
    state.days = Object.fromEntries(rows.map(({ date, ...day }) => [date, day]));
  },
  [TABLES.exams]: async () => { state.exams = await repository.fetchExams(); },
  [TABLES.settings]: async () => { state.settings = mergeSettings(await repository.fetchSettings()); },
};

let listeners = { onChange() {}, onStatus() {} };
let pendingWrites = 0;
const staleTables = new Set();
const writeChains = new Map();

function setSync(value) {
  state.sync = value;
  listeners.onStatus();
}

async function reload(tables) {
  try {
    await Promise.all(tables.map((table) => loaders[table]()));
    if (state.sync !== SYNC.writeFailed) state.sync = SYNC.ready;
    listeners.onChange();
  } catch {
    setSync(SYNC.failed);
  }
}

/* Kendi yazmalarımız sürerken gelen haberler, yazmalar bitince tek seferde işlenir. */
function onRemoteChange(table) {
  if (!loaders[table]) return;
  if (pendingWrites) staleTables.add(table);
  else reload([table]);
}

function flushStaleTables() {
  if (pendingWrites || !staleTables.size) return;
  const tables = [...staleTables];
  staleTables.clear();
  reload(tables);
}

/* Aynı kayda yazmalar sırayla gider. */
function write(key, operation) {
  pendingWrites += 1;
  const previous = writeChains.get(key) ?? Promise.resolve();
  const next = previous
    .then(operation)
    .then(() => { if (state.sync === SYNC.writeFailed) setSync(SYNC.ready); })
    .catch(() => setSync(SYNC.writeFailed))
    .finally(() => { pendingWrites -= 1; flushStaleTables(); });
  writeChains.set(key, next);
}

export const store = {
  start(newListeners) {
    listeners = newListeners;
    repository.subscribeToChanges(onRemoteChange);
    return this.refresh();
  },
  refresh() {
    return reload(Object.keys(loaders));
  },
  saveDay(iso, day) {
    state.days = { ...state.days, [iso]: day };
    write(`${TABLES.days}:${iso}`, () => repository.saveDay({ date: iso, ...day }));
  },
  saveExam(id, exam) {
    const row = { id: id ?? crypto.randomUUID(), ...exam };
    state.exams = [...state.exams.filter((e) => e.id !== row.id), row];
    write(`${TABLES.exams}:${row.id}`, () => repository.saveExam(row));
  },
  deleteExam(id) {
    state.exams = state.exams.filter((e) => e.id !== id);
    write(`${TABLES.exams}:${id}`, () => repository.deleteExam(id));
  },
  saveSettings(settings) {
    state.settings = settings;
    write(TABLES.settings, () => repository.saveSettings(settings));
  },
};
