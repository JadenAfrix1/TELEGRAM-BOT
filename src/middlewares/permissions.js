// src/middlewares/permissions.js
const { getAdmins } = require("../services/database");
const { ownerId } = require("../config/config");
const { log } = require("../utils/logger");

/**
 * Check if a user is the bot owner
 * @param {Number|String} userId
 * @returns {Boolean}
 */
const isOwner = (userId) => {
  if (!ownerId) return false;
  return userId.toString() === ownerId.toString();
};

/**
 * Check if a user is an admin (or owner)
 * @param {Number|String} userId
 * @returns {Boolean}
 */
const isAdmin = (userId) => {
  const admins = getAdmins();
  return isOwner(userId) || Boolean(admins && admins[userId]);
};

/**
 * Middleware wrapper to restrict a command to admins only
 * preserves original args (msg, match, ...)
 */
const adminOnly = (bot, callback) => (...args) => {
  const msg = args[0];
  const userId = msg?.from?.id;
  if (!isAdmin(userId)) {
    bot.sendMessage(msg.chat.id, "🚫 *Access Denied* — you are not an admin.", { parse_mode: "Markdown" }).catch(() => {});
    log(`Unauthorized admin attempt by ${userId}`);
    return;
  }
  try {
    callback(...args);
  } catch (err) {
    log(`adminOnly handler error: ${err.message}`);
  }
};

/**
 * Middleware wrapper to restrict a command to owner only
 */
const ownerOnly = (bot, callback) => (...args) => {
  const msg = args[0];
  const userId = msg?.from?.id;
  if (!isOwner(userId)) {
    bot.sendMessage(msg.chat.id, "🚫 *Restricted* — only the bot owner can use this.", { parse_mode: "Markdown" }).catch(() => {});
    log(`Unauthorized owner-only attempt by ${userId}`);
    return;
  }
  try {
    callback(...args);
  } catch (err) {
    log(`ownerOnly handler error: ${err.message}`);
  }
};

module.exports = {
  isOwner,
  isAdmin,
  adminOnly,
  ownerOnly,
};