
const user = ({
  socket = null,
  userId = '', 
  lobbyId = '',
  userName = '',
} = {}) => ({
  socket,
  userId,
  lobbyId,
  userName,
  setSocket(socket) {
    this.socket = socket;
    return this;
  },
  setUserName(name) {
    this.userName = name;
    return this;
  },
  setLobbyId(id) {
    this.lobbyId = id;
    return this;
  }
});

module.exports = user;
