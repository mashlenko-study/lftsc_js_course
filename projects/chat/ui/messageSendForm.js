export default class MessageSendForm {
  constructor(el, onSend) {
    this.el = el;
    this.onSend = onSend;
    this.messageBox = document.querySelector('[data-role=message-box]');
    this.el.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log(e);
      const message = this.messageBox.value.trim();
      console.log(message);
      if (message) {
        this.onSend(message);
      }
    });
  }

  clear() {
    this.messageBox.value = '';
  }
}
