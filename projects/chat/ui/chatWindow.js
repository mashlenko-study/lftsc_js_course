export default class ChatWindow {
  constructor(el, onLogin) {
    this.el = el;
    this.onLogin = onLogin;
  }

  show() {
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }
}
