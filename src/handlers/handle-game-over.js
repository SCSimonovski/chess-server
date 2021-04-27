const { findGameById } = require("../utils/game.js");

const handleGameOver = function (message) {
  const socket = this;
  const game = findGameById(socket.id);

  if (!game) return;

  clearInterval(game.timer);
  game.time = { ...game.resetTime };
  game.isPlaying = false;
  game.sideOnMove = "white";
  game.board = null;

  socket.to(game.room).emit("gameOver", message);
};

module.exports = handleGameOver;
