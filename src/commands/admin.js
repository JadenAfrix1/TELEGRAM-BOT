const { adminOnly, ownerOnly } = require("../middlewares/permissions");
const { getAdmins, saveAdmins, getUsers } = require("../services/database");
const { log, error } = require("../utils/logger");

/**
 * Register admin commands
 * @param {TelegramBot} bot
 */
function registerAdminCommands(bot) {
  // Broadcast with banner + buttons
  bot.onText(/\/broadcast (.+)/, adminOnly(bot, async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.replace("/broadcast ", "").trim();
    
    if (!text) {
      bot.sendMessage(chatId, "⚠️ Please provide a broadcast message.");
      return;
    }
    
    const users = getUsers();
    let count = 0;
    
    const banner = `📢 *Broadcast Message*\n\n${text}\n\n━━━━━━━━━━━━━━`;
    
    const options = {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📌 Join Channel", url: "https://t.me/YourChannel" }],
          [{ text: "💬 Support Group", url: "https://t.me/YourSupport" }]
        ]
      }
    };
    
    for (const userId of Object.keys(users)) {
      try {
        await bot.sendMessage(userId, banner, options);
        count++;
      } catch (err) {
        error(`Failed broadcast to ${userId}: ${err.message}`);
      }
    }
    
    bot.sendMessage(chatId, `✅ Broadcast delivered to *${count}* users.`, { parse_mode: "Markdown" });
    log(`Broadcast sent by ${msg.from.id} to ${count} users.`);
  }));
  
  // Add new admin (owner only)
  bot.onText(/\/new-admin (\d+)/, ownerOnly(bot, (msg, match) => {
    const newAdminId = match[1];
    const admins = getAdmins();
    admins[newAdminId] = true;
    saveAdmins(admins);
    bot.sendMessage(msg.chat.id, `🛡️ User *${newAdminId}* is now an admin.`, { parse_mode: "Markdown" });
  }));
  
  // Remove admin (owner only)
  bot.onText(/\/remove-admin (\d+)/, ownerOnly(bot, (msg, match) => {
    const removeId = match[1];
    const admins = getAdmins();
    if (admins[removeId]) {
      delete admins[removeId];
      saveAdmins(admins);
      bot.sendMessage(msg.chat.id, `❌ User *${removeId}* removed from admins.`, { parse_mode: "Markdown" });
    } else {
      bot.sendMessage(msg.chat.id, `⚠️ User *${removeId}* is not an admin.`, { parse_mode: "Markdown" });
    }
  }));
  
  // List admins (owner only)
  bot.onText(/\/list-admins/, ownerOnly(bot, (msg) => {
    const admins = getAdmins();
    const adminList = Object.keys(admins).map((id, i) => `${i + 1}. \`${id}\``).join("\n") || "No admins found.";
    bot.sendMessage(msg.chat.id, `🛡️ *Admin List:*\n\n${adminList}`, { parse_mode: "Markdown" });
  }));
}

module.exports = { registerAdminCommands };