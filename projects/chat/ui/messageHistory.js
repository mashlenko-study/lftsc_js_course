import { sanitize } from '../utils';

export default class MessageHistory {
  constructor(el) {
    this.el = el;
    console.log(el);
  }

  addSystemMessage(message) {
    const item = document.createElement('div');

    item.classList.add('message-history__item', 'message', 'message--system');
    item.textContent = message;

    this.el.append(item);
    this.el.scrollTop = this.el.scrollHeight;
  }

  addMessage(from, message) {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, 0);
    const minutes = String(date.getMinutes()).padStart(2, 0);
    const time = `${hours}:${minutes}`;
    const li = document.createElement('li');
    li.classList.add('message-history__item', 'message');
    const img = document.createElement('div');
    img.setAttribute('data-role', 'userpic');
    img.setAttribute('data-user', from);
    img.classList.add('user__pic');
    img.style.backgroundImage = `url(/chat/photos/${from}.png?t=${Date.now()})`;
    const messageText = `<div class="message__body"><div class="message__author">${sanitize(
      from
    )}</div> <span class="message__time">${time}</span>
    <div class="message__body">${sanitize(message)}</div>
    </div>`;
    li.innerHTML = messageText;
    li.prepend(img);
    this.el.append(li);
  }
}
