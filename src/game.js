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
        socket.send(JSON.stringify({ type: 'err', err: 'Bad json parse' }));
      }
      if (message && 'type' in message) {
        switch(message.type) {
          case 'namePlayer':
            api.updateUserName(message, socket);
            break;
          case 'listLobby':
            api.listLobby(message, socket);
            break;
          case 'joinLobby':
            api.joinLobby(message, socket);
            break;
          case 'makeLobby':
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
      socket.send(JSON.stringify({ type: 'newPlayer', userId: userId }));
    },
    updateUserName(message, socket) {
      if (message && 'userName' in message) {
        const user = allUsers[socket.userId];
        user.setUserName(message.userName);
      }
    },
    listLobby(message, socket) {
      /*  Format
       Sender { type: 'listLobby' } => Sender { type: 'listLobby', lobbyIds: ['123', '555'] }
      */
      const lobbyIds = Object.keys(allLobbies);
      socket.send({ type: 'listLobby', lobbyIds });
    },
    joinLobby(message, socket) {
      /* Format
        Sender { type: 'joinLobby', lobbyId: '123' } =>
        Sender, Lobby Users { type: 'joinLobby', users: [{ userId: '123', usernName: 'Existing User' }, { userId: '123', usernName: 'New User' }] }
       */
      if (message && "lobbyId" in message && message.lobbyId in allLobbies) {
        const user = allUsers[socket.userId];
        const lobby = allLobbies[message.lobbyId];
        lobby.addUser(user);

        const currentLobby = lobby.users.map((current) => ({
          userId: current.userId,
          userName: current.userName,
        }));
        for (let lobbyUser of lobby.users) {
          lobbyUser.socket.send(
            JSON.stringify({ type: "joinLobby", users: currentLobby })
          );
        }
      } else {
        socket.send(
          JSON.stringify({
            type: "err",
            msg: `Lobby id ${message.code} does not exists`,
          })
        );
      }
    },
    makeLobby(message, socket) {
      /* Format
        Sender { type: 'makeLobby' } => Sender { type: 'makeLobby', lobbyId: '123' }
                                     => Login User { type: 'listLobby', lobbyId: '123' }
      */
      const lobbyId = short.generate();
      const user = allUsers[socket.userId];
      const newLobby = lobby({ lobbyId, users: [user] });
      allLobbies[lobbyId] = newLobby;
      socket.send(JSON.stringify({ type: 'makeLobby', lobbyId }));
      
      const loginUsers = Object.values(allUsers).filter(
        usersWithNoLobby => !usersWithNoLobby.lobbyId
      );
      for (let loginUser of loginUsers) {
        loginUser.socket.send(
          JSON.stringify({ type: 'listLobby', lobbyId: lobbyId })
        );
      }
    }
  };
  return api;
};

module.exports = game;