const { removeUserFromGame, getGamesArr } = require("../utils/game.js");

const handleDisconnect = function (socket, io) {
  let game = removeUserFromGame(socket.id);
  io.emit("activeGames", getGamesArr());

  if (game)
    socket.broadcast.emit("roomIsFull", { room: game.room, isFull: false });
};

module.exports = handleDisconnect;
