/* Kısa melodileri tarayıcının ses üreteciyle çalar. İlk ses bir dokunuştan sonra çalınabilir. */
import { SOUND } from "../config.js";
import { isMuted } from "../preferences.js";

const FADE_FLOOR = 0.0001;
let context = null;

function audioContext() {
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextClass) return null;
  context ??= new AudioContextClass();
  if (context.state === "suspended") context.resume();
  return context;
}

function playNote(ctx, { freq, at, dur }) {
  const start = ctx.currentTime + at;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = SOUND.wave;
  oscillator.frequency.value = freq;
  gain.gain.setValueAtTime(SOUND.volume, start);
  gain.gain.exponentialRampToValueAtTime(FADE_FLOOR, start + dur);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + dur);
}

export function playSound(name) {
  if (isMuted()) return;
  const ctx = audioContext();
  if (!ctx) return;
  SOUND.tunes[name].forEach((note) => playNote(ctx, note));
}
