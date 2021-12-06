
const user = ({
  socket = null,
  userId = '', 
  lobbyId = '',
  userName = '',
  status = 'active',
} = {}) => ({
  socket,
  userId,
  lobbyId,
  userName,
  status,
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
  },
  setStatus(status) {
    this.status = status;
    return this;
  },
});

module.exports = user;
