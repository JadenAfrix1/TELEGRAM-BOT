// src/commands/other.js
const { ownerId } = require("../config/config");
const { formatUsername } = require("../utils/helpers");
const { log } = require("../utils/logger");
const { getBanner } = require("../utils/banner");
const { sendMainMenu } = require("../menus/mainMenu");

const registerOtherCommands = (bot) => {
  bot.onText(/^\/owner/, async (msg) => {
    const chatId = msg.chat.id;
    const banner = getBanner();
    await bot.sendPhoto(chatId, banner.photo, {
      caption: `👑 Contact Owner\n\nHello ${formatUsername(msg.from)}\nContact the owner here: https://t.me/${ownerId}`
    }).catch(async () => {
      await bot.sendMessage(chatId, `👑 Contact Owner\n\nHello ${formatUsername(msg.from)}\nContact the owner here: https://t.me/${ownerId}`);
    });
    log(`/owner used by ${formatUsername(msg.from)}`);
  });
  
  bot.onText(/^\/buybot/, async (msg) => {
    const chatId = msg.chat.id;
    const banner = getBanner();
    await bot.sendPhoto(chatId, banner.photo, {
      caption: `🛒 Buy Bot\n\nHello ${formatUsername(msg.from)}\nTo purchase or inquire, contact: https://t.me/${ownerId}`
    }).catch(async () => {
      await bot.sendMessage(chatId, `🛒 Buy Bot\n\nHello ${formatUsername(msg.from)}\nTo purchase or inquire, contact: https://t.me/${ownerId}`);
    });
    log(`/buybot used by ${formatUsername(msg.from)}`);
  });
  
  bot.onText(/^\/menu/, async (msg) => {
    // keep menu concise and use main menu sender (banner + menu)
    try {
      await sendMainMenu(bot, msg.chat.id, msg.from);
      log(`/menu used by ${formatUsername(msg.from)}`);
    } catch (err) {
      log(`menu error: ${err.message}`);
      await bot.sendMessage(msg.chat.id, "⚠️ Failed to show the menu. Try again later.").catch(() => {});
    }
  });
};

module.exports = { registerOtherCommands };