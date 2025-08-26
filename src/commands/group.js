const {
  getGroups,
  saveGroups,
  getUsers,
  saveUsers,
  warnUser,
  banUser
} = require("../services/database");
const { log, error } = require("../utils/logger");

// Toggle group setting
const toggleGroupSetting = (chatId, setting, value) => {
  const groups = getGroups();
  if (!groups[chatId]) groups[chatId] = {};
  groups[chatId][setting] = value;
  saveGroups(groups);
  log(`Group ${chatId} updated: ${setting} = ${value}`);
};

// Main middleware for rules
const enforceGroupRules = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text || "";
  
  try {
    const groups = getGroups();
    const settings = groups[chatId] || {};
    
    // Ignore admins/creators
    const member = await bot.getChatMember(chatId, userId);
    if (["administrator", "creator"].includes(member.status)) return;
    
    // 🚫 Anti-link
    if (settings.antiLink && /(https?:\/\/\S+|t\.me\/\S+)/i.test(text)) {
      await bot.deleteMessage(chatId, msg.message_id).catch(() => {});
      banUser(userId, 20); // 20 min ban
      bot.sendMessage(chatId, `🚫 Links are not allowed! ${msg.from.first_name} banned for 20 min.`);
      return;
    }
    
    // 👑 Admin-only mode
    if (settings.adminOnly) {
      await bot.deleteMessage(chatId, msg.message_id).catch(() => {});
      return;
    }
    
    // 🤬 Anti-badword filter
    if (settings.antiBadWord) {
      const badWords = [
        "fuck", "shit", "bitch", "asshole", "nigger", "pussy", "dick", "cock", "whore",
        "slut", "bastard", "cunt", "faggot", "racist", "blowjob", "sex", "suck",
        "nexora😂", "fucking", "retard", "hoe", "porn", "xxx", "motherfucker"
      ];
      if (badWords.some(w => text.toLowerCase().includes(w))) {
        await bot.deleteMessage(chatId, msg.message_id).catch(() => {});
        const warnings = warnUser(userId);
        if (warnings >= 3) {
          banUser(userId, 24 * 60); // 24h
          bot.sendMessage(chatId, `🚷 ${msg.from.first_name} banned for repeated bad words (24h).`);
        } else {
          bot.sendMessage(chatId, `⚠️ Warning ${warnings}/3 to ${msg.from.first_name} for bad words.`);
        }
        return;
      }
    }
    
    // 🚀 Boost system
    if (settings.boost) {
      const users = getUsers();
      if (!users[userId]) users[userId] = { boosts: 0 };
      if (users[userId].boosts < 3) {
        await bot.restrictChatMember(chatId, userId, {
          permissions: { can_send_messages: false }
        }).catch(() => {});
        users[userId].boosts += 1;
        saveUsers(users);
        bot.sendMessage(chatId, `⛔ ${msg.from.first_name} must add 2 members to unlock chatting. Boosts used: ${users[userId].boosts}/3`);
      }
    }
    
  } catch (err) {
    error(`Rule enforcement failed in group ${chatId}: ${err.message}`);
  }
};

// Register group commands
const registerGroupCommands = (bot) => {
  bot.onText(/^\/antilink (on|off)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1] === "on";
    toggleGroupSetting(chatId, "antiLink", value);
    bot.sendMessage(chatId, `🔗 Anti-link is now ${value ? "enabled ✅" : "disabled ❌"}`);
  });
  
  bot.onText(/^\/adminonly (on|off)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1] === "on";
    toggleGroupSetting(chatId, "adminOnly", value);
    bot.sendMessage(chatId, `👑 Admin-only mode ${value ? "enabled ✅" : "disabled ❌"}`);
  });
  
  bot.onText(/^\/antibadword (on|off)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1] === "on";
    toggleGroupSetting(chatId, "antiBadWord", value);
    bot.sendMessage(chatId, `🤬 Anti-badword filter ${value ? "enabled ✅" : "disabled ❌"}`);
  });
  
  bot.onText(/^\/boost (on|off)/, (msg, match) => {
    const chatId = msg.chat.id;
    const value = match[1] === "on";
    toggleGroupSetting(chatId, "boost", value);
    bot.sendMessage(chatId, `🚀 Boost mode ${value ? "enabled ✅" : "disabled ❌"}`);
  });
  
  // Always enforce
  bot.on("message", (msg) => enforceGroupRules(bot, msg));
};

module.exports = {
  registerGroupCommands,
  enforceGroupRules
};