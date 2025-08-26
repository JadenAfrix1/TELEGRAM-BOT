const { getAdmins } = require("../services/database");
const { ownerId } = require("../config/config");
const { log } = require("../utils/logger");

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
  return isOwner(userId) || Boolean(admins[userId]);
};

/**
 * Middleware wrapper to restrict a command to admins only
 * @param {TelegramBot} bot
 * @param {Function} callback - Command handler
 */
const adminOnly = (bot, callback) => (msg) => {
  const userId = msg.from.id;
  if (!isAdmin(userId)) {
    bot.sendMessage(msg.chat.id, "🚫 *Access Denied*: You are not an admin.", {
      parse_mode: "Markdown",
    });
    log(`❌ Non-admin (${userId}) tried to use an admin-only command.`);
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
  const userId = msg.from.id;
  if (!isOwner(userId)) {
    bot.sendMessage(msg.chat.id, "🚫 *Restricted*: Only the bot owner can use this command.", {
      parse_mode: "Markdown",
    });
    log(`❌ Non-owner (${userId}) tried to use an owner-only command.`);
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