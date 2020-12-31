export default class LoginWindow {
  constructor(el, onLogin) {
    this.onLogin = onLogin;
    this.el = el;

    const loginName = document.querySelector('[data-role=username-input]');
    const loginForm = document.querySelector('[data-role=login-form]');
    //const loginError = document.querySelector('data-role=login-error');

    loginForm.addEventListener('submit', (e) => {
      console.log(e);
      e.preventDefault();
      const name = loginName.value.trim();

      if (name) {
        this.onLogin(name);
      } else {
        //loginError.textContent = "Введите имя пользователя";
      }
    });
  }

  show() {
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }
}
