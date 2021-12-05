
const lobby = ({
  lobbyId = '',
  lobbyName = '',
  users = [],
} = {}) => ({
  lobbyId,
  lobbyName,
  users,
  addUser(user) {
    user.setLobbyId(this.lobbyId);
    this.users.push(user);
    return this;
  },
});

module.exports = lobby;
