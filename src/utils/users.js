const users = [];

const addUser = ({ id, username, room, side }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.username === username && user.room === room
  );

  if (!username || !room) {
    return {
      error: "Username and Room are required!",
    };
  }

  if (existingUser) {
    return {
      error: "Username is already taken",
    };
  }

  const user = { id, username, room, side };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return;
  }

  return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
