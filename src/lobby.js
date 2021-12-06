
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
  removeUser(userId) {
    const userIdx = this.users.findIndex(user => user.userId === userId);
    if (userIdx > -1) {
      this.users.splice(userIdx, 1);
    }
    return this;
  }
});

module.exports = lobby;
