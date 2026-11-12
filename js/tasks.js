/* Günde bir kez işaretlenen görevler. `id` hem days tablosundaki sütun hem ödül ayarındaki anahtardır.
   Ödülünde `fullWeek` olan görev, haftanın her günü yapılırsa günlük toplam yerine o tutarı kazandırır. */
import { DAYS_IN_WEEK } from "./config.js";

export const DAILY_TASKS = [
  {
    id: "homework",
    icon: "✏️",
    short: "Ödev",
    title: () => "Ödevlerimi yaptım",
    weekLabel: "Bu hafta ödev yapılan günler",
    weekLine: (count) => `Bu hafta ${count}/${DAYS_IN_WEEK} gün ödev yapıldı`,
  },
  {
    id: "reading",
    icon: "📚",
    short: "Kitap",
    title: () => "Kitap okudum",
    weekLabel: "Bu hafta okunan günler",
    weekLine: (count) => `Bu hafta ${count}/${DAYS_IN_WEEK} gün kitap okundu`,
    bonusHint: (remaining, amount) => `${remaining} gün daha okursan bu haftanın kitap ödülü ${amount} olur.`,
    bonusDone: (amount) => `Haftanın her günü okudun. Ödül ${amount} oldu!`,
    fullWeekTitle: `${DAYS_IN_WEEK} gün kitap okudun!`,
    showStreak: true,
  },
  {
    id: "test",
    icon: "💯",
    short: "Test",
    title: (reward) => `Her dersten ${reward.questions} soru çözdüm`,
    weekLabel: "Bu hafta test çözülen günler",
    weekLine: (count) => `Bu hafta ${count}/${DAYS_IN_WEEK} gün test çözüldü`,
    bonusHint: (remaining, amount) => `${remaining} gün daha çözersen bu haftanın test ödülü ${amount} olur.`,
    bonusDone: (amount) => `Haftanın her günü test çözdün. Ödül ${amount} oldu!`,
    fullWeekTitle: `${DAYS_IN_WEEK} gün test çözdün!`,
  },
];

export const taskById = (id) => DAILY_TASKS.find((task) => task.id === id);
