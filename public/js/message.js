
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
        case 'new':
          this.connect(app, data, socket);
          break;
        case 'make':
          this.madeLobby(app, data, socket);
          break;
        case 'join':
          this.joinLobby(app, data, socket);
          break;
      }
    }
  },
  // User received successful connection response from server
  connect(app, data, socket) {
    sessionStorage.setItem('userId', data.userId);
    app.userId = data.userId;
  },
  // User notified when lobby is created by server
  madeLobby(app, data, socket) {
    console.log(data);
  },
  joinLobby(app, data, socket) {
    console.log(data);
  }
};
