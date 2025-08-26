// src/middlewares/auth.js
const { CHANNEL_ID } = process.env;
const { getBanner } = require("../utils/banner");
const { log } = require("../utils/logger");

/**
 * Verify whether a user is a member of the required Telegram channel.
 */
const verifyChannelMembership = async (bot, msg) => {
  const userId = msg.from.id;
  const chatId = CHANNEL_ID || process.env.CHANNEL_ID || "@nexoratechn";

  try {
    const member = await bot.getChatMember(chatId, userId);
    if (!member) return false;
    if (["left", "kicked"].includes(member.status)) return false;
    return true;
  } catch (err) {
    log(`Membership check failed for ${userId}: ${err.message || err}`);
    return false;
  }
};

/**
 * Wrapper that ensures the user is a channel member before running the handler.
 * Sends banner image first (blocked users will get banner + join links).
 * Preserves original args and passes them to the handler.
 */
const requireChannelMembership = (bot, callback) => async (...args) => {
  const msg = args[0];

  try {
    const isMember = await verifyChannelMembership(bot, msg);

    const banner = getBanner();

    if (!isMember) {
      await bot.sendPhoto(msg.chat.id, banner.photo, {
        caption:
          "🚫 You cannot use the bot yet. Please join our channels below and then press /start.",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "💬 WhatsApp Channel", url: "https://chat.whatsapp.com/0029Vb6K4nw96H4LOMaOLF22" },
            ],
            [
              { text: "📢 Telegram Channel", url: (process.env.TELEGRAM_CHANNEL_URL || `https://t.me/${(CHANNEL_ID||"nexoratechn").toString().replace(/^@/,'')}`) },
            ],
          ],
        },
      });
      return;
    }

    // Verified user -> send banner (informational) then run handler
    await bot.sendPhoto(msg.chat.id, banner.photo, { caption: banner.caption }).catch(()=>{});
    callback(...args);
  } catch (err) {
    log(`requireChannelMembership error: ${err.message || err}`);
    // fallback message
    bot.sendMessage(msg.chat.id, "⚠️ An internal error occurred. Try again later.").catch(()=>{});
  }
};

module.exports = {
  verifyChannelMembership,
  requireChannelMembership,
};