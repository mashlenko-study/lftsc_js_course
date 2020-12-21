import WSClient from './wsClient';
import LoginWindow from './ui/loginWindow';
import ChatWindow from './ui/chatWindow';
import UserName from './ui/userName';
import UserList from './ui/userList';
import UserPhoto from './ui/userPhoto';
//import UserPic from './ui/userPic';
import MessageHistory from './ui/messageHistory';
import MessageSendForm from './ui/messageSendForm';

export default class Chat {
  constructor() {
    this.wsClient = new WSClient(
      `ws://${location.host}/chat/ws`,
      this.onMessage.bind(this)
    );
    this.ui = {
      loginWindow: new LoginWindow(
        document.querySelector('#login'),
        this.onLogin.bind(this)
      ),
      chatWindow: new ChatWindow(
        document.querySelector('#chatroom'),
        this.onLogin.bind(this)
      ),
      userName: new UserName(document.querySelector('[data-role=username]')),
      userList: new UserList(document.querySelector('[data-role=user-list]')),
      messageHistory: new MessageHistory(
        document.querySelector('[data-role=message-history__list]')
      ),
      messageSendForm: new MessageSendForm(
        document.querySelector('[data-role=message-send-form]'),
        this.onSend.bind(this)
      ),
      userPhoto: new UserPhoto(
        document.querySelector('[data-role=userpic]'),
        this.onUpload.bind(this)
      ),
    };

    this.ui.loginWindow.show();
  }

  onUpload(data) {
    this.ui.userPhoto.set(data);

    fetch('/chat/upload-photo', {
      method: 'post',
      body: JSON.stringify({
        name: this.ui.userName.get(),
        image: data,
      }),
    });
  }

  async onLogin(name) {
    await this.wsClient.connect();
    this.wsClient.sendHello(name);
    this.ui.loginWindow.hide();
    this.ui.chatWindow.show();
    this.ui.userName.set(name);
    this.ui.userPhoto.set(`/chat/photos/${name}.png?t=${Date.now()}`);
  }

  onSend(message) {
    this.wsClient.sendText(message);
    this.ui.messageSendForm.clear();
  }

  onMessage({ type, from, data }) {
    if (type === 'hello') {
      this.ui.userList.add(from);
      this.ui.messageHistory.addSystemMessage(`${from} вошел в чат`);
    } else if (type === 'user-list') {
      for (const name of data) {
        this.ui.userList.add(name);
      }
    } else if (type === 'text-message') {
      this.ui.messageHistory.addMessage(from, data['message']);
    } else if (type === 'bye-bye') {
      this.ui.userList.remove(from);
      this.ui.messageHistory.addSystemMessage(`${from} вышел из чата`);
    } else if (type === 'photo-changed') {
      const avatars = document.querySelectorAll(
        `[data-role=userpic][data-user=${data.name}]`
      );

      for (const avatar of avatars) {
        avatar.style.backgroundImage = `url(/chat/photos/${
          data.name
        }.png?t=${Date.now()})`;
      }
    }
  }
}
