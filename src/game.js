const short = require('short-uuid');
const user = require('./user');
const lobby = require('./lobby');

const game = () => {
  const allUsers = {};
  const allLobbies = {}; // { test: lobby({lobbyId: 'test', users: []}) };
  const taskTracker = {};

  const api = {
    read(data, socket) {
      let message;
      if (!("userId" in socket)) {
        socket.send(JSON.stringify({ type: "err", err: "Missing userId" }));
        socket.close(1011, "Missing userId");
      }
      try {
        message = JSON.parse(data);
      } catch {
        socket.send(JSON.stringify({ type: "err", err: "Bad json parse" }));
        socket.close(1011, "Bad json parse");
      }
      if (message && "type" in message) {
        switch (message.type) {
          case "namePlayer":
            api.updateUserName(message, socket);
            break;
          case "listLobby":
            api.listLobby(message, socket);
            break;
          case "joinLobby":
            api.joinLobby(message, socket);
            break;
          case "makeLobby":
            api.makeLobby(message, socket);
            break;
          case "startLobby":
            api.startLobby(message, socket);
            break;
          case "playerMove":
            api.playerMove(message, socket);
            break;
          default:
            socket.send(
              JSON.stringify({ type: "err", err: `Unsupported data type: ${message.type}` })
            );
        }
      } else {
        socket.send(JSON.stringify({ type: "err", err: "Invalid dataObj" }));
      }
    },
    connect(socket) {
      const userId = short.generate();
      const newUser = user({ socket, userId });
      allUsers[userId] = newUser;
      socket.userId = userId;
      socket.send(JSON.stringify({ type: "newPlayer", userId: userId }));
    },
    disconnect(socket) {
      /* Format
        Socket disconnect (+15 sec) => Lobby Users { type: 'leftLobby', lobbyId: '123', lobbyName: 'Room', users: [{ userId: '123', usernName: 'Remaining User' }]}
      */
      const userId = socket.userId;
      console.log(`User disconnected: ${userId}`);
      if (userId in allUsers) {
        const user = allUsers[userId];
        user.setStatus("disconnected");

        const timeoutId = setTimeout(function() {
          if (user.lobbyId in allLobbies) {
            const lobby = allLobbies[user.lobbyId];
            const numUsers = lobby.users.length;
            lobby.removeUser(userId);
            if (numUsers !== lobby.users.length) {
              const currentLobby = lobby.users.map((current) => ({
                userId: current.userId,
                userName: current.userName,
              }));
              for (let lobbyUser of lobby.users) {
                lobbyUser.socket.send(
                  JSON.stringify({
                    type: "leftLobby",
                    lobbyId: lobby.lobbyId,
                    lobbyName: lobby.lobbyName,
                    users: currentLobby,
                  })
                );
              }
            }
            if (lobby.users.length === 0) {
              delete allLobbies[user.lobbyId];
            }
          }
          delete allUsers[userId];
          delete taskTracker[userId];
          console.log(`Cleaning up disconnected user ${userId}`);
        }, 15000);

        taskTracker[userId] = timeoutId;
      }
    },
    reconnect(message, socket) {
      /* Format
        Sender { type: 'reconnect', userId: 'prev userId' } => Sender { type: 'reconnect', userId: 'prev userId', userName }
                                                            => TBD
      */
      const prevUserId = message.userId;
      if (prevUserId in allUsers && prevUserId in taskTracker) {
        clearTimeout(taskTracker[prevUserId]);
      }
    },
    playerMove(message, socket) {
      /* Format
        Sender { type: 'playerMove', position: [1, 2, 3], angle: 12 } => Lobby User { type: 'playerMove', userId 123, position: [1, 2, 3], angle: 12 }
      */
      const userId = socket.userId;
      const lobbyId = allUsers[userId].lobbyId;
      const lobbyUsers = allLobbies[lobbyId].users;

      for (let user of lobbyUsers) {
        if (user.userId === socket.userId) {
          continue;
        }
        user.socket.send(JSON.stringify({ ...message, userId }));
      }
    },
    updateUserName(message, socket) {
      if (message && "userName" in message) {
        const user = allUsers[socket.userId];
        user.setUserName(message.userName);
      }
    },
    listLobby(message, socket) {
      /* Format
        Sender { type: 'listLobby' } => Sender { type: 'listLobby', lobbyIds: ['123', '555'] }
      */
      const lobbyIds = Object.values(allLobbies).map((lobby) => ({
        lobbyId: lobby.lobbyId,
        lobbyName: lobby.lobbyName,
      }));
      socket.send(JSON.stringify({ type: "listLobby", lobbyIds }));
    },
    joinLobby(message, socket) {
      /* Format
        Sender { type: 'joinLobby', lobbyId: '123' } =>
        Sender, Lobby Users { type: 'joinLobby', lobbyId: '123', lobbyName: 'Test', users: [{ userId: '123', usernName: 'Existing User' }, { userId: '123', usernName: 'New User' }] }
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
            JSON.stringify({
              type: "joinLobby",
              lobbyId: lobby.lobbyId,
              lobbyName: lobby.lobbyName,
              users: currentLobby,
            })
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
        Sender { type: 'makeLobby', lobbyName: 'Test' } => Sender { type: 'makeLobby', lobbyId: '123' }
                                     => Login User { type: 'listLobby', lobbyIds: ['123', '555'] }
      */
      const user = allUsers[socket.userId];
      const lobbyId = short.generate();
      const newLobby = lobby({
        lobbyId,
        lobbyName: message.lobbyName,
      });
      newLobby.addUser(user);
      allLobbies[lobbyId] = newLobby;
      socket.send(JSON.stringify({ type: "makeLobby", lobbyId }));

      const lobbyIds = Object.values(allLobbies).map((lobby) => ({
        lobbyId: lobby.lobbyId,
        lobbyName: lobby.lobbyName,
      }));
      const loginUsers = Object.values(allUsers).filter(
        (usersWithNoLobby) => !usersWithNoLobby.lobbyId
      );
      for (let loginUser of loginUsers) {
        loginUser.socket.send(JSON.stringify({ type: "listLobby", lobbyIds }));
      }
    },
    startLobby(message, socket) {
      /* Format
        Sender { type: 'startLobby', lobbyId: '123'} => Lobby Users { type: 'startLobby' }
      */
      const lobbyId = message.lobbyId;
      if (lobbyId in allLobbies) {
        const lobby = allLobbies[lobbyId];
        for (let user of lobby.users) {
          user.socket.send(JSON.stringify({ type: "startLobby" }));
        }
      }
    },
  };
  return api;
};

module.exports = game;