const { setTime, findGame } = require("../utils/game.js");

const handleMove = function ({ updatedBoard, ...data }, socket, io) {
  let game = findGame(data.room);

  if (!game) return;

  let fromPlayer;
  let toPlayer;

  if (socket.id === game.player1.id) {
    fromPlayer = game.player1;
    toPlayer = game.player2;
    game.sideOnMove = game.player2.side;
  }
  if (socket.id === game.player2.id) {
    fromPlayer = game.player2;
    toPlayer = game.player1;
    game.sideOnMove = game.player1.side;
  }

  if (!fromPlayer || !toPlayer) return;

  const time = setTime(io, socket.id, data.room);
  io.in(data.room).emit("setTime", time);

  let flippedBoard;
  let boardCopy = updatedBoard.map((row) =>
    row.map((column) => ({ ...column }))
  );
  flippedBoard = boardCopy.reverse().map((row) => row.reverse());

  if (fromPlayer.flipped !== toPlayer.flipped) {
    io.to(toPlayer.id).emit("move", { ...data, updatedBoard: flippedBoard });
  } else {
    io.to(toPlayer.id).emit("move", { ...data, updatedBoard });
  }

  if (!game.isAllowedSpectators) return;

  if (
    (fromPlayer.side === "white" && !fromPlayer.flipped) ||
    (fromPlayer.side === "black" && !fromPlayer.flipped)
  ) {
    game.board = updatedBoard;
    socket.to(data.room).emit("moveForSpectators", {
      ...data,
      updatedBoard,
    });
  } else if (
    (fromPlayer.side === "white" && fromPlayer.flipped) ||
    (fromPlayer.side === "black" && fromPlayer.flipped)
  ) {
    game.board = flippedBoard;
    socket.to(data.room).emit("moveForSpectators", {
      ...data,
      updatedBoard: flippedBoard,
    });
  }
};

module.exports = handleMove;
