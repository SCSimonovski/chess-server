const { spectators, findGame } = require("../utils/game.js");

const handleSpectator = function (data, acknowledgement) {
  const socket = this;

  const game = findGame(data.room);

  if (!game) return acknowledgement({ error: "Something went wrong" });
  if (!game.isAllowedSpectators)
    return acknowledgement({ error: "Spectators are not allowed" });

  socket.join(data.room);
  socket.emit("setBoardForSpectators", game.board);

  acknowledgement({
    player: {
      username: game.player1.username,
      side: game.player1.side,
    },
    opponent: {
      username: game.player2.username,
      side: game.player2.side,
    },
    time: game.time,
    isPlaying: game.isPlaying,
    room: game.room,
  });
};

module.exports = handleSpectator;
