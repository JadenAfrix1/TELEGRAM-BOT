const { getGroups, saveGroups, warnUser, banUser, getUsers, saveUsers } = require("../services/database");

/**
 * Middleware to enforce group rules on messages
 * @param {TelegramBot} bot
 * @param {Object} msg - Telegram message object
 */
const enforceGroupRules = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text || "";
  
  const groups = getGroups();
  const settings = groups[chatId] || {};
  
  try {
    const member = await bot.getChatMember(chatId, userId);
    if (["administrator", "creator"].includes(member.status)) return;
    
    // Anti-link
    if (settings.antiLink && /(https?:\/\/\S+)/i.test(text)) {
      bot.deleteMessage(chatId, msg.message_id).catch(() => {});
      banUser(userId, 20); // 20 minutes ban
      return;
    }
    
    // Admin-only
    if (settings.adminOnly) {
      bot.deleteMessage(chatId, msg.message_id).catch(() => {});
      return;
    }
    
    // Anti-badword
    if (settings.antiBadWord) {
      const badWords = ["ass", "pussy","blowjob","racist","sex","nexora😂", "fuck"]; // customize your bad words
      if (badWords.some((w) => text.toLowerCase().includes(w))) {
        bot.deleteMessage(chatId, msg.message_id).catch(() => {});
        const warnings = warnUser(userId);
        if (warnings >= 3) banUser(userId, 24 * 60); // 24 hours
        return;
      }
    }
    
    // Boost: restrict user until adding members
    if (settings.boost) {
      const users = getUsers();
      if (!users[userId]) return;
      if (users[userId].boosts >= 3) return;
      
      bot.restrictChatMember(chatId, userId, { can_send_messages: false }).catch(() => {});
      users[userId].boosts += 1;
      saveUsers(users);
      
      bot.sendMessage(chatId, `User ${msg.from.first_name} must add 2 members to unlock messaging.`);
    }
  } catch (err) {
    console.error("Error enforcing group rules:", err.message);
  }
};

/**
 * Attach middleware to bot
 * @param {TelegramBot} bot
 */
const registerGroupMiddleware = (bot) => {
  bot.on("message", (msg) => enforceGroupRules(bot, msg));
};

module.exports = {
  enforceGroupRules,
  registerGroupMiddleware,
};