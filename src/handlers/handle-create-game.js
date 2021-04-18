const { getGames, createGame } = require("../utils/game.js");

const handleCreateGame = function (data, acknowledgement) {
  const socket = this;
  const games = getGames();

  if (games[data?.room])
    return acknowledgement({
      error: "The room already exist, please pick another name",
      code: "room",
    });

  if (data.username?.length >= 16)
    return acknowledgement({
      error: "Max 16 characters are allowed",
      code: "username",
    });

  let game = createGame(socket.id, data);
  socket.join(data.room);
  socket.emit("time", game.time);

  socket.broadcast.emit("createdGame", {
    room: game.room,
    isPlaying: game.isPlaying,
    isFull: false,
    isAllowedSpectators: data.allowSpectators,
    host: game.player1.username,
    code: !!game.code,
  });

  acknowledgement({ username: game.player1.username });
};

module.exports = handleCreateGame;
