const short = require('short-uuid');
const user = require('./user');
const lobby = require('./lobby');

const game = () => {
  const allUsers = {};
  const allLobbies = {};

  const api = {
    read(data, socket) {
      let message;
      if (!('userId' in socket)) {
        socket.send(JSON.stringify({ type: 'err', err: 'Missing userId' }));
      }
      try {
        message = JSON.parse(data);
      } catch {
        socket.send(JSON.stringify({ type: 'err', err: 'Bad parse' }));
      }
      if (message && 'type' in message) {
        switch(message.type) {
          case 'name':
            api.updateUserName(message, socket);
          case 'join':
            api.joinLobby(message, socket);
            break;
          case 'make':
            api.makeLobby(message, socket);
            break;
        }
      }
      socket.send(JSON.stringify({ type: 'err', err: 'Invalid dataObj' }));
    },
    connect(socket) {
      const userId = short.generate();
      const newUser = user({ socket, userId });
      allUsers[userId] = newUser;
      socket.userId = userId;
      socket.send(JSON.stringify({ type: 'new', userId: userId }));
    },
    updateUserName(message, socket) {
      if (message && 'userName' in message) {
        const user = allUsers[socket.userId];
        user.setUserName(message.userName);
      }
    },
    joinLobby(message, socket) {
      if (message && 'lobbyId' in message && message.lobbyId in allLobbies) {
        const user = allUsers[socket.userId];
        const lobby = allLobbies[message.lobbyId];
        lobby.addUser(user);

        const currentLobby = lobby.users.map(current => ({
          userId: current.userId,
          userName: current.userName,
        }));
        lobby.users.forEach(lobbyUser => {
          lobbyUser.socket.send(
            JSON.stringify({ type: "join", users: currentLobby })
          );
        });
      } else {
        socket.send(JSON.stringify({ type: 'err', msg: `Lobby id ${message.code} does not exists` }));
      }
    },
    makeLobby(message, socket) {
      const lobbyId = short.generate();
      const user = allUsers[socket.userId];
      const newLobby = lobby({ lobbyId, users: [user] });
      allLobbies[lobbyId] = newLobby;
      socket.send(JSON.stringify({ type: 'make', lobbyId }));
    }
  };
  return api;
};

module.exports = game;