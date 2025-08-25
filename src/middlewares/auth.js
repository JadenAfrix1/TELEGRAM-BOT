const { CHANNEL_ID } = process.env;

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
    // If error occurs (e.g., user not found), consider not verified
    return false;
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
    bot.sendMessage(
      msg.chat.id,
      "🚫 You cannot use the bot yet. Please join our Telegram channel first.",
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Join Telegram Channel", url: `https://t.me/nexoratechn` },
              { text: "Join WhatsApp Channel", url: `https://chat.whatsapp.com/0029Vb6K4nw96H4LOMaOLF22` },
            ],
          ],
        },
      }
    );
    return;
  }
  
  // If verified, proceed to the original command
  callback(msg);
};

module.exports = {
  verifyChannelMembership,
  requireChannelMembership,
};