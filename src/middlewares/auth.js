const { CHANNEL_ID } = process.env;
const { log } = require("../utils/logger");

// Banner image (replace with your hosted image URL)
const BANNER_IMAGE_URL = "https://i.ibb.co/6NRV0fL/nexora-banner.jpg";

/**
 * Middleware to check if a user is a member of a specific channel
 * @param {TelegramBot} bot - Telegram Bot instance
 * @param {Object} msg - Telegram message object
 * @returns {Promise<Boolean>}
 */
const verifyChannelMembership = async (bot, msg) => {
  const userId = msg.from.id;
  const chatId = CHANNEL_ID;
  
  try {
    const member = await bot.getChatMember(chatId, userId);
    
    // If status is “left” or “kicked”, user is not a member
    if (["left", "kicked"].includes(member.status)) {
      return false;
    }
    return true;
  } catch (err) {
    log(`❌ Failed to verify membership for ${userId}: ${err.message}`);
    return false; // Treat errors as "not verified"
  }
};

/**
 * Helper function to enforce verification before executing a command
 * @param {TelegramBot} bot
 * @param {Function} callback - Function to execute if verified
 */
const requireChannelMembership = (bot, callback) => async (msg) => {
  const isMember = await verifyChannelMembership(bot, msg);
  
  if (!isMember) {
    // First send banner image
    await bot.sendPhoto(msg.chat.id, BANNER_IMAGE_URL, {
      caption: "🚫 You cannot use the bot yet. Please join our channels below 👇",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Join Telegram Channel", url: `https://t.me/nexoratechn` },
            { text: "Join WhatsApp Channel", url: `https://chat.whatsapp.com/0029Vb6K4nw96H4LOMaOLF22` },
          ],
        ],
      },
    });
    return;
  }
  
  // If verified → show banner then execute command
  await bot.sendPhoto(msg.chat.id, BANNER_IMAGE_URL);
  callback(msg);
};

module.exports = {
  verifyChannelMembership,
  requireChannelMembership,
};