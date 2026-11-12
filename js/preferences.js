/* Bu cihaza özel tercihler. Depolama kapalıysa tercih yalnızca sayfa açıkken geçerli olur. */
import { STORAGE_KEYS } from "./config.js";

let muted = read(STORAGE_KEYS.muted) === "1";

function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function write(key, value) {
  try { localStorage.setItem(key, value); } catch { /* depolama yoksa bellekte kalır */ }
}

export const isMuted = () => muted;

export function toggleMuted() {
  muted = !muted;
  write(STORAGE_KEYS.muted, muted ? "1" : "0");
  return muted;
}
