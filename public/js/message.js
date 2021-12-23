
const message = {
  send(data, socket) {
    if (
      data &&
      "type" in data &&
      socket &&
      socket.readyState !== socket.CLOSED
    ) {
      socket.send(JSON.stringify(data));
    }
  },
  read(app, event, socket) {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      console.error(`Bad data parse`);
      return null;
    }
    if (data && "type" in data && socket) {
      switch (data.type) {
        case "newPlayer":
          this.connect(app, data, socket);
          break;
        case "listLobby":
          this.listLobby(app, data, socket);
          break;
        case "makeLobby":
          this.madeLobby(app, data, socket);
          break;
        case "joinLobby":
          this.joinLobby(app, data, socket);
          break;
        case "leftLobby":
          this.leftLobby(app, data, socket);
          break;
        case "startLobby":
          this.startLobby(app, data, socket);
          break;
        case "playerMove":
          this.playerMove(app, data, socket);
          break;
        default:
          console.log(`Unknown message: ${data.type}`);
          console.log(data);
      }
    }
  },
  // User received successful connection response from server
  connect(app, data, socket) {
    sessionStorage.setItem("userId", data.userId);
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
    app.lobbyDetails = [{ userId: app.userId, userName: app.userName }];
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
  async startLobby(app, data, socket) {
    app.showState = {
      ...app.showState,
      lobbyDetails: false,
      gameOverlays: true,
    };
    setupGraphics();
    registerEventListener();
    animate();
    console.log(`Start Lobby, current user id ${app.userId}`);
    for (let player of app.lobbyDetails) {
      console.log(`Adding user with id ${player.userId}`);
      if (player.userId === app.userId) {
        // setup player with control
        let mesh = await addPlayerObjectWithCtrl(player.userId);
        console.log(mesh);
      } else {
        addPlayerObject(player.userId);
      }
    }
  },
  playerMove(app, data, socket) {
    console.log(data);
  },
};
