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

/* `bySubject`: sonuçlar ders ders mi girilir, yoksa sınavın tamamı için tek satır mı. */
export const EXAM_KINDS = [
  { id: "deneme", label: "Deneme sınavı", bySubject: true, hint: "Yalnızca sınavda olan dersleri doldur. Hata yapılan konuları virgülle ayır." },
  { id: "kitap", label: "Kitap sınavı", bySubject: false, hint: "Sınavın toplam doğru, yanlış ve boş sayısını gir. Hata yapılan yerleri virgülle ayır." },
];
export const ALL_KINDS = "hepsi";

export const DEFAULT_SETTINGS = {
  rewards: {
    homework: { amount: 50, payer: "Baba" },
    reading: { amount: 50, fullWeek: 500, payer: "Abi" },
    test: { amount: 30, fullWeek: 280, questions: 10, payer: "Abi" }, // her dersten `questions` soru; tam hafta 7×30 + 70 bonus
    prayer: { amount: 10, bonusMinCount: 4, bonusAmount: 20, payer: "Abi" }, // günde en az `bonusMinCount` vakit kılınca bonus
    exam: { amount: 100, minRate: 92, kind: "deneme", payer: "Abi" }, // başarısı `minRate` yüzdesini geçen sınava ödül
  },
  subjects: ["Türkçe", "Matematik", "Fen Bilimleri", "Sosyal Bilgiler", "İngilizce", "Din Kültürü"],
  goal: { name: "", amount: 0 }, // tutar 0 ise hedef belirlenmemiştir
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
  dayComplete: { title: "Günün her şeyini yaptın!", scope: "day" },
  fullWeek: { scope: "week" }, // başlığı görevden gelir (tasks.js)
  allPrayers: { title: "5 vakit tamam!", scope: "day" },
  prayerBonus: { title: "Namaz bonusunu kazandın!", scope: "day" },
};
/* Kutlama bildiriminin ikinci satırı: anın kapsadığı süreye göre. */
export const MILESTONE_SUMMARIES = {
  day: (totals) => `Günün kazancı ${totals.day}.`,
  week: (totals) => `Bu hafta toplam ${totals.week} kazandın.`,
};
export const CELEBRATION_SOUND = "fanfare";

/* Rozetler: `stat` badges.js içindeki computeStats alanıdır; değer `target`a ulaşınca rozet kazanılır. */
export const BADGES = [
  { id: "first-task", icon: "🌱", title: "İlk adım", description: "İlk görevini tamamla", stat: "tasksDone", target: 1, unit: "count" },
  { id: "perfect-1", icon: "⭐", title: "Tam gün", description: "Bir günün tüm görevlerini bitir", stat: "perfectDays", target: 1, unit: "count" },
  { id: "perfect-10", icon: "🌟", title: "On tam gün", description: "10 günün tüm görevlerini bitir", stat: "perfectDays", target: 10, unit: "count" },
  { id: "reading-3", icon: "📖", title: "Okur", description: "3 gün üst üste kitap oku", stat: "bestReadingStreak", target: 3, unit: "count" },
  { id: "reading-7", icon: "📚", title: "Kitap kurdu", description: "7 gün üst üste kitap oku", stat: "bestReadingStreak", target: 7, unit: "count" },
  { id: "reading-30", icon: "🏆", title: "Kitap şampiyonu", description: "30 gün üst üste kitap oku", stat: "bestReadingStreak", target: 30, unit: "count" },
  { id: "homework-10", icon: "✏️", title: "Çalışkan", description: "10 gün ödevlerini yap", stat: "homeworkDays", target: 10, unit: "count" },
  { id: "homework-30", icon: "🎓", title: "Ödev ustası", description: "30 gün ödevlerini yap", stat: "homeworkDays", target: 30, unit: "count" },
  { id: "prayer-1", icon: "🌙", title: "Beş vakit", description: "Bir günde beş vakti tamamla", stat: "fullPrayerDays", target: 1, unit: "count" },
  { id: "prayer-7", icon: "🕌", title: "Yedi gün beş vakit", description: "7 gün beş vakti tamamla", stat: "fullPrayerDays", target: 7, unit: "count" },
  { id: "earn-1000", icon: "💰", title: "İlk bin", description: "Toplam 1.000 TL kazan", stat: "totalEarned", target: 1000, unit: "money" },
  { id: "earn-5000", icon: "💎", title: "Hazine", description: "Toplam 5.000 TL kazan", stat: "totalEarned", target: 5000, unit: "money" },
  { id: "exam-1", icon: "📝", title: "İlk sınav", description: "İlk sınavını kaydet", stat: "examCount", target: 1, unit: "count" },
  { id: "exam-90", icon: "🎯", title: "Tam isabet", description: "Bir sınavda %90 başarıya ulaş", stat: "bestExamRate", target: 90, unit: "percent" },
];

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
