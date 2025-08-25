const TelegramBot = require("node-telegram-bot-api");
const { botToken, ownerId, channelId, apis, group } = require("../config/config");
const { formatUsername, escapeMarkdown } = require("../utils/helpers");
const { log, error } = require("../utils/logger");
const { fetchAPI, downloadMedia } = require("../utils/api");
const fs = require("fs");
const path = require("path");

// Initialize bot with polling
const bot = new TelegramBot(botToken, { polling: true });

// Temp folder for downloads
const tempDir = path.resolve(__dirname, "../../data/temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// Check if user is a member of the Telegram channel
const checkChannelMembership = async (userId) => {
  try {
    const member = await bot.getChatMember(channelId, userId);
    return ["creator", "administrator", "member"].includes(member.status);
  } catch (err) {
    return false;
  }
};

// Send the main menu banner
const sendMainMenu = async (chatId, username) => {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Owner", url: `https://t.me/${ownerId}` }],
      ],
    },
  };
  
  await bot.sendPhoto(
    chatId,
    "https://files.catbox.moe/7qcclf.jpg",
    {
      caption: `𝐇𝐞𝐥𝐥𝐨 ${escapeMarkdown(formatUsername({ username }))}, welcome to nexoratech-bot!\n\n«••••••| 𝐍𝐄𝐗𝐎𝐑𝐀 |••••••»\nUse /menu to see all commands.`,
      parse_mode: "MarkdownV2",
    },
    opts
  );
};

// /start command handler
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;
  
  try {
    const isMember = await checkChannelMembership(chatId);
    if (!isMember) {
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Join Telegram Channel", url: "https://t.me/nexoratechn" }],
            [{ text: "Join WhatsApp Channel", url: "https://chat.whatsapp.com/0029Vb6K4nw96H4LOMaOLF22" }],
          ],
        },
      };
      
      await bot.sendMessage(
        chatId,
        `Hello ${formatUsername(msg.from)}, you cannot use the bot yet.\nPlease join our Telegram channel first and then press /start again.`,
        opts
      );
      return;
    }
    
    await sendMainMenu(chatId, username);
    log(`User ${username} accessed the bot.`);
  } catch (err) {
    error(`Failed on /start: ${err.message}`);
  }
});

module.exports = bot;