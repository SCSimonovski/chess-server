const { joinGame, findGame } = require("../utils/game.js");

const handleJoinGame = function (data, acknowledgement, socket, io) {
  let game = findGame(data.room);

  if (game?.code !== data.code) {
    acknowledgement({ error: "Invalid code" });
    return;
  }

  if (!!game?.player2.id) {
    acknowledgement({ error: "The room is full." });
    return;
  }

  if (game) {
    let { player, opponent } = joinGame(game, socket.id, data);
    socket.join(game.room);
    socket.to(game.room).emit("joinOpponent", { opponent: player });
    socket.broadcast.emit("roomIsFull", { room: data.room, isFull: true });

    acknowledgement({
      data: { player, opponent, time: game.time },
      error: null,
    });
  }
};

module.exports = handleJoinGame;
