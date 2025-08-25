const { getAdmins } = require("../services/database");
const { ownerId } = require("../config/config");

/**
 * Check if a user is the bot owner
 * @param {Number} userId
 * @returns {Boolean}
 */
const isOwner = (userId) => {
  return userId.toString() === ownerId;
};

/**
 * Check if a user is an admin (or owner)
 * @param {Number} userId
 * @returns {Boolean}
 */
const isAdmin = (userId) => {
  const admins = getAdmins();
  return isOwner(userId) || admins[userId];
};

/**
 * Middleware wrapper to restrict a command to admins only
 * @param {TelegramBot} bot
 * @param {Function} callback - Command handler
 */
const adminOnly = (bot, callback) => (msg) => {
  if (!isAdmin(msg.from.id)) {
    bot.sendMessage(msg.chat.id, "🚫 You do not have permission to use this command.");
    return;
  }
  callback(msg);
};

/**
 * Middleware wrapper to restrict a command to owner only
 * @param {TelegramBot} bot
 * @param {Function} callback - Command handler
 */
const ownerOnly = (bot, callback) => (msg) => {
  if (!isOwner(msg.from.id)) {
    bot.sendMessage(msg.chat.id, "🚫 Only the bot owner can use this command.");
    return;
  }
  callback(msg);
};

module.exports = {
  isOwner,
  isAdmin,
  adminOnly,
  ownerOnly,
};