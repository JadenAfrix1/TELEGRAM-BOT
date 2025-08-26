const {
  getGroups,
  saveGroups,
  warnUser,
  banUser,
  getUsers,
  saveUsers,
} = require("../services/database");

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
    
    // 🔗 Anti-link
    if (settings.antiLink && /(https?:\/\/\S+)/i.test(text)) {
      bot.deleteMessage(chatId, msg.message_id).catch(() => {});
      banUser(userId, 20); // 20 minutes ban
      return;
    }
    
    // 🔐 Admin-only
    if (settings.adminOnly) {
      bot.deleteMessage(chatId, msg.message_id).catch(() => {});
      return;
    }
    
    // 🚫 Anti-badword
    if (settings.antiBadWord) {
      // Expanded bad words list
      const badWords = [
        "fuck",
        "fuk",
        "f*ck",
        "f.u.c.k",
        "shit",
        "sh1t",
        "bitch",
        "b!tch",
        "slut",
        "whore",
        "hoe",
        "dick",
        "cock",
        "c0ck",
        "pussy",
        "pusy",
        "p*ssy",
        "asshole",
        "ass",
        "a$$",
        "nigger",
        "nigga",
        "racist",
        "sex",
        "s3x",
        "porn",
        "porno",
        "nude",
        "boobs",
        "tits",
        "cum",
        "cumming",
        "blowjob",
        "bj",
        "handjob",
        "hj",
        "rape",
        "rapist",
        "suck",
        "sucking",
        "anal",
        "gay",
        "lesbian",
        "fag",
        "faggot",
        "retard",
        "nexora😂" // keep your custom one
      ];
      
      // Build regex (word boundaries for better matching, case-insensitive)
      const badWordsRegex = new RegExp(`\\b(${badWords.join("|")})\\b`, "i");
      
      if (badWordsRegex.test(text.toLowerCase())) {
        bot.deleteMessage(chatId, msg.message_id).catch(() => {});
        const warnings = warnUser(userId);
        if (warnings >= 3) banUser(userId, 24 * 60); // 24 hours
        return;
      }
    }
    
    // 🚀 Boost: restrict user until adding members
    if (settings.boost) {
      const users = getUsers();
      if (!users[userId]) return;
      if (users[userId].boosts >= 3) return;
      
      bot
        .restrictChatMember(chatId, userId, { can_send_messages: false })
        .catch(() => {});
      users[userId].boosts += 1;
      saveUsers(users);
      
      bot.sendMessage(
        chatId,
        `🚨 User ${msg.from.first_name} must add 2 members to unlock messaging.`
      );
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