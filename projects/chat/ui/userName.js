export default class UserName {
  constructor(el) {
    this.el = el;
  }

  set(name) {
    this.name = name;
    this.el.textContent = name;
  }

  get() {
    return this.name;
  }
}
