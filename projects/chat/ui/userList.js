export default class UserList {
  constructor(el) {
    this.el = el;
    this.items = new Set();
  }

  buildDOM() {
    this.el.innerHTML = '';

    for (const name of this.items) {
      const li = document.createElement('li');
      li.classList.add('user');
      li.innerHTML = `<div data-role="userpic" class="user__pic"></div>
    <div class="user__info">
      <div data-role="username" class="user__name">${name}
      </div>
      <div class="user__text">Ура</div>
    </div>`;
      this.el.append(li);
    }
  }

  add(name) {
    this.items.add(name);
    this.buildDOM();
  }

  remove(name) {
    this.items.delete(name);
    this.buildDOM();
  }
}
