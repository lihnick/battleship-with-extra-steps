
const message = {
  send(data, socket) {
    if (data && 'type' in data && socket) {
      socket.send(JSON.stringify(data));
    }
  },
  read(app, event, socket) {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      return null;
    }
    if (data && 'type' in data && socket) {
      switch (data.type) {
        case 'newPlayer':
          this.connect(app, data, socket);
          break;
        case 'listLobby':
          this.listLobby(app, data, socket);
          break;
        case 'makeLobby':
          this.madeLobby(app, data, socket);
          break;
        case 'joinLobby':
          this.joinLobby(app, data, socket);
          break;
        case 'leftLobby':
          this.leftLobby(app, data, socket);
          break;
        case 'startLobby':
          this.startLobby(app, data, socket);
          break;
      }
    }
  },
  // User received successful connection response from server
  connect(app, data, socket) {
    sessionStorage.setItem('userId', data.userId);
    app.userId = data.userId;
  },
  listLobby(app, data, socket) {
    const lobbyIds = data.lobbyIds;
    lobbyIds.sort();
    app.lobbyList = lobbyIds;
  },
  // User notified when lobby is created by server
  madeLobby(app, data, socket) {
    app.lobbyId = data.lobbyId;
    app.lobbyDetails = [{userId: app.userId, userName: app.userName}];
  },
  joinLobby(app, data, socket) {
    app.lobbyId = data.lobbyId;
    app.lobbyName = data.lobbyName;
    app.lobbyDetails = data.users;
  },
  leftLobby(app, data, socket) {
    app.lobbyId = data.lobbyId;
    app.lobbyName = data.lobbyName;
    app.lobbyDetails = data.users;
  },
  startLobby(app, data, socket) {
    
  }
};
