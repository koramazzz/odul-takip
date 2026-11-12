/* Uygulamanın tüm sabitleri. Publishable anahtar tarayıcıda görünmek üzere tasarlanmıştır;
   veriyi supabase/schema.sql içindeki erişim kuralları korur. */
export const SUPABASE = {
  url: "https://rbtzbzvdjlejyjaeuiwh.supabase.co",
  publishableKey: "sb_publishable_6HsQXNmzHZXinGVlqpYs-w_cIKIJpqL",
};

export const TABLES = { days: "days", exams: "exams", settings: "settings" };
export const SETTINGS_ROW_ID = "app";
export const REALTIME_CHANNEL = "family-data";

export const LOCALE = "tr-TR";
export const CURRENCY = "TL";
export const PERCENT = 100;
export const DAYS_IN_WEEK = 7;
export const WEEK_STARTS_ON = 1; // Pazartesi (Date.getDay değeri)

export const TASK_ICONS = { homework: "✏️", reading: "📚" };

export const PRAYERS = [
  { id: "sabah", label: "Sabah" },
  { id: "ogle", label: "Öğle" },
  { id: "ikindi", label: "İkindi" },
  { id: "aksam", label: "Akşam" },
  { id: "yatsi", label: "Yatsı" },
];

export const EXAM_KINDS = [
  { id: "deneme", label: "Deneme sınavı" },
  { id: "kitap", label: "Kitap sınavı" },
];
export const ALL_KINDS = "hepsi";

export const DEFAULT_SETTINGS = {
  rewards: {
    homework: { amount: 50, payer: "Baba" },
    reading: { amount: 50, fullWeek: 500, payer: "Abi" },
    prayer: { amount: 10, payer: "Abi" },
  },
  subjects: ["Türkçe", "Matematik", "Fen Bilimleri", "Sosyal Bilgiler", "İngilizce", "Din Kültürü"],
};

export const SYNC = { loading: "loading", ready: "ready", failed: "failed", writeFailed: "writeFailed" };
export const SYNC_MESSAGES = {
  [SYNC.loading]: "Veriler yükleniyor…",
  [SYNC.failed]: "Veriler alınamadı. İnternet bağlantını kontrol edip sayfayı yeniden aç.",
  [SYNC.writeFailed]: "Son değişiklik kaydedilemedi. İnternet bağlantını kontrol et.",
};

export const SPARK = { width: 300, height: 84, padX: 26, padY: 10, gridRates: [0, 50, 100], dotRadius: 4 };

/* ---------- Motivasyon ve efektler ---------- */
/* İlerleme oranı `from` değerine ulaşınca gösterilen söz; büyükten küçüğe sıralı. */
export const ENCOURAGEMENTS = [
  { from: 1, text: "Hepsi tamam! Bugün harikaydın!" },
  { from: 0.7, text: "Az kaldı, bitirmek üzeresin!" },
  { from: 0.4, text: "Çok güzel gidiyorsun!" },
  { from: 0.01, text: "Harika bir başlangıç!" },
  { from: 0, text: "Hadi başlayalım!" },
];

export const MILESTONES = {
  dayComplete: { title: "Günün tüm görevleri tamam!", sound: "fanfare" },
  fullWeek: { title: "7 gün kitap okudun!", sound: "fanfare" },
  allPrayers: { title: "5 vakit tamam!", sound: "fanfare" },
};
export const MIN_STREAK_TO_SHOW = 2;

export const STORAGE_KEYS = { muted: "yunulostakip.muted" };
export const TOAST_MS = 3200;
export const FLOAT_REWARD_MS = 1100;
export const COUNT_UP_MS = 600;

export const CONFETTI = {
  colors: ["#ffb703", "#4f6df5", "#f2762e", "#0fa293", "#14995a", "#ef476f"],
  smallBurst: 24,
  bigBurst: 160,
  gravity: 0.35,
  drag: 0.985,
  speed: { min: 4, max: 13 },
  size: { min: 6, max: 12 },
  lifeFrames: 110,
};

/* Sesler tarayıcıda üretilir (ses dosyası yok). Notalar: frekans Hz, başlangıç ve süre saniye. */
export const SOUND = {
  volume: 0.18,
  wave: "triangle",
  tunes: {
    done: [{ freq: 880, at: 0, dur: 0.09 }, { freq: 1320, at: 0.09, dur: 0.22 }],
    undo: [{ freq: 392, at: 0, dur: 0.1 }, { freq: 294, at: 0.1, dur: 0.14 }],
    fanfare: [
      { freq: 523, at: 0, dur: 0.12 }, { freq: 659, at: 0.12, dur: 0.12 },
      { freq: 784, at: 0.24, dur: 0.12 }, { freq: 1047, at: 0.36, dur: 0.4 },
    ],
  },
};
