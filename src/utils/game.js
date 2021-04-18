let games = {};
let users = [];

const createGame = (id, { username, room, code, time, allowSpectators }) => {
  time = time.split("/");
  let timeInSeconds = parseInt(time[0]) * 60;
  let incrementor = time[1] ? parseInt(time[1]) : 0;

  username = generateUniqueUsername(username);
  users.push(username);

  games[room] = {
    room,
    code,
    isAllowedSpectators: allowSpectators,
    rematch: false,
    isPlaying: false,
    isFull: false,
    flip: true,
    board: null,

    player1: {
      id,
      username: username,
      side: "white",
      flipped: false,
    },
    player2: {
      id: null,
      username: "",
      side: "black",
      flipped: true,
    },

    timer: null,

    time: {
      white: timeInSeconds,
      black: timeInSeconds,
      incrementor,
    },

    resetTime: {
      white: timeInSeconds,
      black: timeInSeconds,
      incrementor,
    },
  };

  return games[room];
};

const joinGame = (game, id, { username }) => {
  username = generateUniqueUsername(username);
  users.push(username);

  game.isFull = true;
  game.player2 = {
    ...game.player2,
    id,
    username,
    side: "black",
  };

  return {
    player: { username: game.player2.username, side: game.player2.side },
    opponent: { username: game.player1.username, side: game.player1.side },
  };
};

const generateUniqueUsername = (username) => {
  let uniqueUsername = username + "#" + Math.floor(1000 + Math.random() * 9000);

  if (users.find((name) => uniqueUsername === name)) {
    uniqueUsername = generateUniqueUsername(username);
  }

  return uniqueUsername;
};

const findGame = (room) => games[room];

const findGameById = (id) => {
  let game;
  for (room in games) {
    if (games[room].player1?.id === id || games[room].player2?.id === id)
      game = games[room];
  }
  return game;
};

const reconnect = (id, { room, username, code, time }) => {
  const game = findGame(room);
  if (game) {
    if (game.player1.username === username) {
      game.player1.id = id;
    } else {
      game.player2.id = id;
    }
    return game;
  } else {
    return createGame(id, { username, room, code, time });
  }
};

const removeUserFromGame = (id) => {
  let game = findGameById(id);

  if (game) {
    let username = "";

    if (game.player1.id === id) {
      username = game.player2.username;

      game.player1 = {
        ...game.player1,
        id: null,
      };
    } else if (game.player2.id === id) {
      username = game.player2.username;

      game.player2 = {
        ...game.player2,
        id: null,
      };
    }

    users = users.filter((name) => name !== username);

    if (!game.player1.id && !game.player2.id) {
      clearInterval(game.timer);
      delete games[game.room];
      return null;
    }
    return game;
  }

  return null;
};

const getGames = () => games;

const getGamesArr = () => {
  const gamesArr = [];
  let game;
  for (room in games) {
    game = games[room];
    gamesArr.push({
      room: game.room,
      isPlaying: game.isPlaying,
      isFull: game.isFull,
      isAllowedSpectators: game.isAllowedSpectators,
      host: game.player1.username,
      code: !!game.code,
    });
  }

  return gamesArr;
};

const toggleFlip = (id) => {
  const { room } = findGameById(id);

  if (games[room].player1.id === id) {
    games[room].player1.flipped = !games[room].player1.flipped;
  } else if (games[room].player2.id === id) {
    games[room].player2.flipped = !games[room].player2.flipped;
  }
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const setTime = (io, id, room, firstMove) => {
  let game = games[room];
  let { player1, player2, time } = game;

  clearInterval(game.timer);

  if (firstMove) {
    game.timer = setInterval(() => {
      if (time.white <= 0) {
        clearInterval(game.timer);
        game.time = { ...game.resetTime };
        io.in(room).emit("gameOver", `Black won on time`);
      }

      time.white = time.white - 1;
    }, 1000);

    return time;
  }

  if (player1.id === id) {
    time[player1.side] += time.incrementor;
    let side = [player2.side];

    game.timer = setInterval(() => {
      if (time[side] <= 0) {
        clearInterval(game.timer);
        game.time = { ...game.resetTime };
        io.in(room).emit("gameOver", `${capitalize(player1.side)} won on time`);
      }
      time[side] = time[side] - 1;
    }, 1000);
  } else if (player2.id === id) {
    time[player2.side] += time.incrementor;
    let side = [player1.side];

    game.timer = setInterval(() => {
      if (time[side] <= 0) {
        clearInterval(game.timer);
        game.time = { ...game.resetTime };
        io.in(room).emit("gameOver", `${capitalize(player2.side)} won on time`);
      }
      time[side] = time[side] - 1;
    }, 1000);
  }

  return time;
};

module.exports = {
  getGames,
  getGamesArr,
  createGame,
  joinGame,
  findGame,
  findGameById,
  removeUserFromGame,
  reconnect,
  setTime,
  toggleFlip,
};
