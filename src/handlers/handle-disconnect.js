const { removeUserFromGame, getGamesArr } = require("../utils/game.js");

const handleDisconnect = function () {
  const socket = this;

  let game = removeUserFromGame(socket.id);
  socket.broadcast.emit("activeGames", getGamesArr());

  if (game)
    socket.broadcast.emit("roomIsFull", { room: game.room, isFull: false });
};

module.exports = handleDisconnect;
