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
