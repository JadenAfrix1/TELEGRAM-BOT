const fs = require("fs");
const path = require("path");

const adminsFile = path.join(__dirname, "../../data/admins.json");
const usersFile = path.join(__dirname, "../../data/users.json");
const groupsFile = path.join(__dirname, "../../data/groups.json");

// ===== Admins =====
const getAdmins = () => {
  try {
    return JSON.parse(fs.readFileSync(adminsFile, "utf8") || "{}");
  } catch {
    return {};
  }
};

const saveAdmins = (data) => {
  fs.writeFileSync(adminsFile, JSON.stringify(data, null, 2));
};

// ===== Users =====
const getUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersFile, "utf8") || "{}");
  } catch {
    return {};
  }
};

const saveUsers = (data) => {
  fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
};

const warnUser = (userId) => {
  const users = getUsers();
  if (!users[userId]) users[userId] = { warnings: 0, boosts: 0 };
  users[userId].warnings += 1;
  saveUsers(users);
  return users[userId].warnings;
};

const banUser = (userId, minutes) => {
  const users = getUsers();
  if (!users[userId]) users[userId] = { warnings: 0, boosts: 0 };
  users[userId].bannedUntil = Date.now() + minutes * 60 * 1000;
  saveUsers(users);
};

// ===== Groups =====
const getGroups = () => {
  try {
    return JSON.parse(fs.readFileSync(groupsFile, "utf8") || "{}");
  } catch {
    return {};
  }
};

const saveGroups = (data) => {
  fs.writeFileSync(groupsFile, JSON.stringify(data, null, 2));
};

module.exports = {
  getAdmins,
  saveAdmins,
  getUsers,
  saveUsers,
  warnUser,
  banUser,
  getGroups,
  saveGroups,
};