const { findGameById } = require("../utils/game.js");

const handleRematch = function (isAccepted, socket, io) {
  const game = findGameById(socket.id);

  if (!game) return;

  if (isAccepted === false) {
    game.rematch = false;
    socket.to(game.room).emit("rematchDeclined");
  } else if (isAccepted || game.rematch) {
    io.in(game.room).emit("setTime", game.resetTime);
    let temp = game.player1.side;
    game.player1.side = game.player2.side;
    game.player2.side = temp;
    io.in(game.room).emit("playRematch");
    game.rematch = false;
  } else {
    game.rematch = true;
    socket.to(game.room).emit("rematch");
  }
};

module.exports = handleRematch;
