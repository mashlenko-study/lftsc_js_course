const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('ws');

function readBody(req) {
  return new Promise((resolve, reject) => {
    let dataRaw = '';

    req.on('data', (chunk) => (dataRaw += chunk));
    req.on('error', reject);
    req.on('end', () => resolve(JSON.parse(dataRaw)));
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (/\/photos\/.+\.png/.test(req.url)) {
      const [, imageName] = req.url.match(/\/photos\/(.+\.png)/) || [];
      const fallBackPath = path.resolve(__dirname, './img/default_avatar.png');
      const filePath = path.resolve(__dirname, './photos', imageName);

      if (fs.existsSync(filePath)) {
        return fs.createReadStream(filePath).pipe(res);
      } else {
        return fs.createReadStream(fallBackPath).pipe(res);
      }
    } else if (req.url.endsWith('/upload-photo')) {
      const body = await readBody(req);
      const name = body.name.replace(/\.\.\/|\//, '');
      const [, content] = body.image.match(/data:image\/.+?;base64,(.+)/) || [];
      const filePath = path.resolve(__dirname, './photos', `${name}.png`);

      if (name && content) {
        fs.writeFileSync(filePath, content, 'base64');

        broadcast(connections, { type: 'photo-changed', data: { name } });
      } else {
        return res.end('fail');
      }
    }

    res.end('ok');
  } catch (e) {
    console.error(e);
    res.end('fail');
  }
});
const wss = new Server({ server });
const connections = new Map();

wss.on('connection', (socket) => {
  connections.set(socket, {});

  socket.on('message', (messageData) => {
    const message = JSON.parse(messageData);
    let excludeItself = false;

    if (message.type === 'hello') {
      excludeItself = true;
      connections.get(socket).userName = message.data.name;
      sendMessageTo(
        {
          type: 'user-list',
          data: [...connections.values()].map((item) => item.userName).filter(Boolean),
        },
        socket
      );
    }

    sendMessageFrom(connections, message, socket, excludeItself);
  });

  socket.on('close', () => {
    sendMessageFrom(connections, { type: 'bye-bye' }, socket);
    connections.delete(socket);
  });
});

function sendMessageTo(message, to) {
  to.send(JSON.stringify(message));
}

function broadcast(connections, message) {
  for (const connection of connections.keys()) {
    connection.send(JSON.stringify(message));
  }
}

function sendMessageFrom(connections, message, from, excludeSelf) {
  const socketData = connections.get(from);

  if (!socketData) {
    return;
  }

  message.from = socketData.userName;

  for (const connection of connections.keys()) {
    if (connection === from && excludeSelf) {
      continue;
    }

    connection.send(JSON.stringify(message));
  }
}

server.listen(8080);

// const fs = require('fs');
// const http = require('http');
// const WebSocket = require('ws');

// const clients = new Map();

// function readBody(req) {
//   return new Promise((resolve, reject) => {
//     let dataRaw = '';

//     req.on('data', (chunk) => (dataRaw += chunk));
//     req.on('error', reject);
//     req.on('end', () => resolve(JSON.parse(dataRaw)));
//   });
// }

// const server = http.createServer(async (req, res) => {
//   try {
//     if (/\/photos\/.+\.png/.test(req.url)) {
//       const [, imageName] = req.url.match(/\/photos\/(.+\.png)/) || [];
//       const fallBackPath = path.resolve(__dirname, '../img/default_avatar.png');
//       const filePath = path.resolve(__dirname, '../photos', imageName);

//       if (fs.existsSync(filePath)) {
//         return fs.createReadStream(filePath).pipe(res);
//       } else {
//         return fs.createReadStream(fallBackPath).pipe(res);
//       }
//     } else if (req.url.endsWith('/upload-photo')) {
//       const body = await readBody(req);
//       const name = body.name.replace(/\.\.\/|\//, '');
//       const [, content] = body.image.match(/data:image\/.+?;base64,(.+)/) || [];
//       const filePath = path.resolve(__dirname, '../photos', `${name}.png`);

//       if (name && content) {
//         fs.writeFileSync(filePath, content, 'base64');

//         broadcast(clients, { type: 'photo-changed', data: { name } });
//       } else {
//         return res.end('fail');
//       }
//     }

//     res.end('ok');
//   } catch (e) {
//     console.error(e);
//     res.end('fail');
//   }
// });

// const wss = new WebSocket.Server({ server });

// wss.on('connection', ws => {
//   clients.set(ws, {});

//   ws.on('message', messageData => {
//     console.log(JSON.parse(messageData))
//     //let excludeItself = false;
//     const message = JSON.parse(messageData);

//     if(message.type === 'hello') {
//       console.log('yes');
//       excludeItself = true;
//       clients.get(ws).username = message.data.name;
//       sendMessageTo(
//         {
//           type: 'user-list',
//           data: [...clients.values()].map((item) => item.username).filter(Boolean)
//         },
//         ws
//       );
//     }

//     sendMessageFrom(clients, message, ws, excludeItself);

//     console.log(`Received message => ${message}`);
//   });
//   //ws.send('hello! message from server');
//   ws.on('close', () => {
//     sendMessageFrom(clients, { type: 'bye-bye' }, ws);
//     clients.delete(ws);
//   });
// });

// function broadcast(clients, message) {
//   for (const client of clients.keys()) {
//     client.send(JSON.stringify(message));
//   }
// }

// function sendMessageTo(message, to) {
//   const data = message.data;
//   // const socketData = clients.get(to);
//   // if(excludeSelf) {
//   //   let res = data.filter(el => el !== socketData.username)
//   //   if(res.length>0) {
//   //     message.data = res;
//   //   } else {
//   //     return;
//   //   }
//   // }
//    to.send(JSON.stringify(message));}

// function sendMessageFrom(clients, message, from, excludeSelf) {
//   const socketData = clients.get(from);

//   if (!socketData) {
//     return;
//   }

//   message.from = socketData.username;

//   for (const client of clients.keys()) {
//     if (client === from && excludeSelf) {
//       continue;
//     }

//     client.send(JSON.stringify(message));
//   }
// }

// server.listen(8080);
