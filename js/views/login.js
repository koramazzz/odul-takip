import { state } from "../state.js";
import { formError } from "./shared.js";

export function renderLogin() {
  return `<form class="card login" data-form="login" novalidate>
    <h2>Giriş yap</h2>
    <p class="muted">Aile hesabıyla bir kez giriş yapman yeterli; bu cihaz seni hatırlar.</p>
    <div class="field"><label for="email">E-posta</label><input id="email" name="email" type="text" inputmode="email" autocomplete="username"></div>
    <div class="field"><label for="password">Şifre</label><input id="password" name="password" type="password" autocomplete="current-password"></div>
    ${formError(state.formError)}
    <div class="row"><button type="submit" class="btn primary">Giriş yap</button></div>
  </form>`;
}
