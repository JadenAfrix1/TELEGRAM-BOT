// src/menus/mainMenu.js
const { getUsers } = require("../services/database");
const { getBanner } = require("../utils/banner");
const { ownerId } = require("../config/config");

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

function buildCaption(user) {
  const usersCount = Object.keys(getUsers() || {}).length;
  const uptime = formatUptime(process.uptime());
  const runtime = `Node ${process.version}`;
  const prefix = "/";
  
  const header = [
    `𝐇𝐞𝐥𝐥𝐨 ${user?.username ? `@${user.username}` : user?.first_name || "User"}`,
    "",
    `«••••••| 𝐍𝐄𝐗𝐎𝐑𝐀 |••••••»`,
    `🔑 Prefix: \`${prefix}\``,
    `⏳ Uptime: ${uptime}`,
    `⚡ Runtime: ${runtime}`,
    `👥 Users: ${usersCount}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ""
  ].join("\n");
  
  const body = [
    "     【𝐀𝐈 𝐌𝐄𝐍𝐔】",
    "/chatgpt",
    "/deepseek",
    "/qwen-ai",
    "",
    "     【𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃】",
    "/apk <query>",
    "/play <query/link>",
    "/video <query/link>",
    "/gitclone <query/link>",
    "/ytmp4 <query/link>",
    "",
    "     【𝐆𝐂 𝐌𝐄𝐍𝐔】",
    "/antilink <on/off>",
    "/adminonly <on/off>",
    "/antibadword <on/off>",
    "/boost <on/off>",
    "",
    "     【𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔】",
    "/owner",
    "/buybot",
    "/menu",
    "",
    "     【𝐀𝐃𝐌𝐈𝐍 𝐂𝐌𝐃𝐒】",
    "/new-admin <user id>",
    "/broadcast <message>"
  ].join("\n");
  
  return header + body;
}

async function sendMainMenu(bot, chatId, user) {
  try {
    const banner = getBanner();
    const caption = buildCaption(user || {});
    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "💬 WhatsApp Channel", url: process.env.WHATSAPP_CHANNEL_URL || "https://chat.whatsapp.com/0029Vb6K4nw96H4LOMaOLF22" }],
          [{ text: "📢 Telegram Channel", url: process.env.TELEGRAM_CHANNEL_URL || `https://t.me/${(process.env.CHANNEL_ID||"nexoratechn").toString().replace(/^@/,'')}` }],
          [{ text: "👑 Contact Owner", url: process.env.OWNER_URL || `https://t.me/${ownerId}` }]
        ]
      },
      parse_mode: "Markdown"
    };
    
    await bot.sendPhoto(chatId, banner.photo, {
      caption,
      parse_mode: "Markdown",
      reply_markup: buttons.reply_markup
    }).catch(async (err) => {
      // If photo fails, send plain text menu as fallback
      await bot.sendMessage(chatId, caption, buttons).catch(() => {});
    });
  } catch (err) {
    // final fallback
    await bot.sendMessage(chatId, "⚠️ Failed to display menu.").catch(() => {});
  }
}

module.exports = { sendMainMenu };