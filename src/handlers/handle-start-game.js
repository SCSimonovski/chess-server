const { setTime, findGame } = require("../utils/game.js");

const handleStartGame = function (room, socket, io) {
  let game = findGame(room);
  if (!game) return;

  const time = setTime(io, undefined, room, true);

  io.in(room).emit("setTime", time);
  socket.to(room).emit("startGame");
  socket.broadcast.emit("gameIsStarting", room);
  game.isPlaying = true;
};

module.exports = handleStartGame;
