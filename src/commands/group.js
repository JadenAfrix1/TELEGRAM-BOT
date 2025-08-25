const { getGroups, saveGroups, getUsers, saveUsers, warnUser, banUser } = require("../services/database");
const { log, error } = require("../utils/logger");

const groupCommands = ["/antilink", "/adminonly", "/antibadword", "/boost"];

// Helper to toggle group settings
const toggleGroupSetting = (chatId, setting, value) => {
  const groups = getGroups();
  if (!groups[chatId]) groups[chatId] = {};
  groups[chatId][setting] = value;
  saveGroups(groups);
};

// Middleware to enforce rules
const enforceGroupRules = (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text || "";
  
  const groups = getGroups();
  const settings = groups[chatId] || {};
  
  // Skip admins
  bot.getChatMember(chatId, userId).then((member) => {
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
      const badWords = ["badword1", "badword2"]; // Add more
      if (badWords.some((w) => text.toLowerCase().includes(w))) {
        bot.deleteMessage(chatId, msg.message_id).catch(() => {});
        const warnings = warnUser(userId);
        if (warnings >= 3) banUser(userId, 24 * 60); // 24 hours
        return;
      }
    }
    
    // Boost (example: block user until adds 2 members)
    if (settings.boost) {
      const users = getUsers();
      if (!users[userId]) return;
      if (users[userId].boosts >= 3) return;
      
      // Example logic: restrict user
      bot.restrictChatMember(chatId, userId, { can_send_messages: false }).catch(() => {});
      users[userId].boosts += 1;
      saveUsers(users);
      bot.sendMessage(chatId, `User ${msg.from.first_name} must add 2 members to unlock messaging.`);
    }
  }).catch(() => {});
};

// Register commands
const registerGroupCommands = (bot) => {
  bot.onText(/^\/antilink (on|off)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1] === "on";
    toggleGroupSetting(chatId, "antiLink", value);
    bot.sendMessage(chatId, `Anti-link is now ${value ? "enabled" : "disabled"}`);
  });
  
  bot.onText(/^\/adminonly (on|off)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1] === "on";
    toggleGroupSetting(chatId, "adminOnly", value);
    bot.sendMessage(chatId, `Admin-only mode is now ${value ? "enabled" : "disabled"}`);
  });
  
  bot.onText(/^\/antibadword (on|off)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1] === "on";
    toggleGroupSetting(chatId, "antiBadWord", value);
    bot.sendMessage(chatId, `Anti-badword is now ${value ? "enabled" : "disabled"}`);
  });
  
  bot.onText(/^\/boost (on|off)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1] === "on";
    toggleGroupSetting(chatId, "boost", value);
    bot.sendMessage(chatId, `Boost is now ${value ? "enabled" : "disabled"}`);
  });
  
  // Enforce rules on every message
  bot.on("message", (msg) => {
    enforceGroupRules(bot, msg);
  });
};

module.exports = {
  registerGroupCommands,
};