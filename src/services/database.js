const fs = require("fs");
const path = require("path");

const dataDir = path.resolve(__dirname, "../../data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const readJSON = (file) => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    return {};
  }
};

const writeJSON = (file, data) => {
  const filePath = path.join(dataDir, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Users
const getUsers = () => readJSON("users.json");
const saveUsers = (data) => writeJSON("users.json", data);

// Admins
const getAdmins = () => readJSON("admins.json");
const saveAdmins = (data) => writeJSON("admins.json", data);

// Groups
const getGroups = () => readJSON("groups.json");
const saveGroups = (data) => writeJSON("groups.json", data);

// User management
const addUser = (userId) => {
  const users = getUsers();
  if (!users[userId]) users[userId] = { warnings: 0, boosts: 0, banned: false };
  saveUsers(users);
};

const warnUser = (userId) => {
  const users = getUsers();
  if (!users[userId]) addUser(userId);
  users[userId].warnings += 1;
  saveUsers(users);
  return users[userId].warnings;
};

const banUser = (userId, duration = 24 * 60) => {
  const users = getUsers();
  if (!users[userId]) addUser(userId);
  users[userId].banned = true;
  saveUsers(users);
  // Optional: implement auto-unban after duration
};

module.exports = {
  getUsers,
  saveUsers,
  getAdmins,
  saveAdmins,
  getGroups,
  saveGroups,
  addUser,
  warnUser,
  banUser,
};