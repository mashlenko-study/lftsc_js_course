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
    const li = document.createElement('li');
    li.classList.add('message-history__item', 'message');
    const messageText = `<div class="message__author">${from}</div>
    <div class="message__body">${message}</div>
    <div class="message__time">17:59</div>`;
    li.innerHTML = messageText;
    this.el.append(li);
  }
}
