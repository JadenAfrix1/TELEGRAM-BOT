// src/commands/admin.js
const { adminOnly, ownerOnly } = require("../middlewares/permissions");
const { getAdmins, saveAdmins, getUsers } = require("../services/database");
const { getBanner } = require("../utils/banner");
const { log, error } = require("../utils/logger");

/**
 * registerAdminCommands(bot)
 */
function registerAdminCommands(bot) {
  // /broadcast <message> - admins & owner can use
  bot.onText(/^\/broadcast (.+)/, adminOnly(bot, async (msg, match) => {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;
    const text = match && match[1] ? match[1].trim() : "";
    
    if (!text) {
      bot.sendMessage(chatId, "⚠️ Please provide a message to broadcast.").catch(() => {});
      return;
    }
    
    const users = getUsers();
    const banner = getBanner();
    const options = {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 Join Channel", url: process.env.TELEGRAM_CHANNEL_URL || `https://t.me/${(process.env.CHANNEL_ID||"nexoratechn").toString().replace(/^@/,'')}` }],
          [{ text: "💬 WhatsApp Channel", url: process.env.WHATSAPP_CHANNEL_URL || "https://chat.whatsapp.com/0029Vb6K4nw96H4LOMaOLF22" }]
        ]
      }
    };
    
    let sent = 0;
    for (const uid of Object.keys(users || {})) {
      try {
        // try sending banner + message as photo caption for better appearance
        await bot.sendPhoto(uid, banner.photo, { caption: `📢 *Broadcast*\n\n${text}`, ...options }).catch(async () => {
          // fallback to text if photo fails
          await bot.sendMessage(uid, `📢 *Broadcast*\n\n${text}`, options).catch(() => {});
        });
        sent++;
      } catch (err) {
        error(`broadcast to ${uid} failed: ${err.message || err}`);
      }
    }
    
    bot.sendMessage(chatId, `✅ Broadcast delivered to ${sent} users.`, { parse_mode: "Markdown" }).catch(() => {});
    log(`Broadcast by ${fromId} -> ${sent} users`);
  }));
  
  // /new-admin <userId> - owner only
  bot.onText(/^\/new-admin (\d+)/, ownerOnly(bot, (msg, match) => {
    const chatId = msg.chat.id;
    const newAdminId = match[1];
    const admins = getAdmins();
    admins[newAdminId] = true;
    saveAdmins(admins);
    bot.sendMessage(chatId, `✅ User \`${newAdminId}\` added as admin.`, { parse_mode: "Markdown" }).catch(() => {});
    log(`Owner ${msg.from.id} added admin ${newAdminId}`);
  }));
  
  // /remove-admin <userId> - owner only
  bot.onText(/^\/remove-admin (\d+)/, ownerOnly(bot, (msg, match) => {
    const chatId = msg.chat.id;
    const removeId = match[1];
    const admins = getAdmins();
    if (admins[removeId]) {
      delete admins[removeId];
      saveAdmins(admins);
      bot.sendMessage(chatId, `❌ Admin \`${removeId}\` removed.`, { parse_mode: "Markdown" }).catch(() => {});
      log(`Owner ${msg.from.id} removed admin ${removeId}`);
    } else {
      bot.sendMessage(chatId, `⚠️ User \`${removeId}\` is not an admin.`, { parse_mode: "Markdown" }).catch(() => {});
    }
  }));
  
  // /list-admins - owner only
  bot.onText(/^\/list-admins/, ownerOnly(bot, (msg) => {
    const chatId = msg.chat.id;
    const admins = getAdmins();
    const list = Object.keys(admins || {}).map((id, idx) => `${idx + 1}. \`${id}\``).join("\n") || "No admins.";
    bot.sendMessage(chatId, `🛡️ *Admin List*\n\n${list}`, { parse_mode: "Markdown" }).catch(() => {});
  }));
}

module.exports = { registerAdminCommands };