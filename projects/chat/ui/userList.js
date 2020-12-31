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
      const img = document.createElement('div');
      img.setAttribute('data-role', 'userpic');
      img.setAttribute('data-user', name);
      img.classList.add('user__pic');
      img.style.backgroundImage = `url(/chat/photos/${name}.png?t=${Date.now()})`;
      li.innerHTML = `
    <div class="user__info">
      <div data-role="username" class="user__name">${name}
      </div>
      <div class="user__text">Ура</div>
    </div>`;
      li.prepend(img);
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
