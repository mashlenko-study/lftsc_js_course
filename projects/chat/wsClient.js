export default class wsClient {
  constructor(url, onMessage) {
    this.url = url;
    this.onMessage = onMessage;
  }

  connect() {
    return new Promise((resolve) => {
      this.connection = new WebSocket(this.url);
      this.connection.addEventListener('open', resolve);
      this.connection.addEventListener('message', (e) => {
        console.log(e.data);
        this.onMessage(JSON.parse(e.data));
      });
    });
  }

  sendHello(name) {
    this.sendMessage('hello', { name });
  }

  sendText(message) {
    this.sendMessage('text-message', { message });
  }

  sendMessage(type, data) {
    this.connection.send(JSON.stringify({ type, data }));
  }
  //const WebSocket = require('ws');
  //const url = 'ws://localhost:8080';
}
