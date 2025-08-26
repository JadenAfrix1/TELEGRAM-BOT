// File: src/menus/mainMenu.js

const { getUsers } = require("../services/database");
const {
  BOT_NAME,
  PREFIX,
  BANNER_URL: CFG_BANNER,
  OWNER_ID,
  CHANNEL_ID,
} = require("../config/config");

/* -------------------- constants / theming -------------------- */
const FALLBACK_BANNER = "https://files.catbox.moe/7qcclf.jpg";
const BANNER_URL = CFG_BANNER || FALLBACK_BANNER;

const TELEGRAM_CHANNEL_URL = (() => {
  if (process.env.TELEGRAM_CHANNEL_URL) return process.env.TELEGRAM_CHANNEL_URL;
  const handle = (CHANNEL_ID || "@nexoratechn").replace(/^@/, "");
  return `https://t.me/${handle}`;
})();

const WHATSAPP_CHANNEL_URL =
  process.env.WHATSAPP_CHANNEL_URL ||
  "https://whatsapp.com/channel/0029Vb6K4nw96H4LOMaOLF22";

const OWNER_URL =
  process.env.OWNER_URL ||
  (OWNER_ID ? `tg://user?id=${OWNER_ID}` : TELEGRAM_CHANNEL_URL);

const SEP_TOP = "«••••••| 𝐍𝐄𝐗𝐎𝐑𝐀 |••••••»";
const LINE = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

/* -------------------- helpers -------------------- */
function fmtUptime(total) {
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

function botStats() {
  const name = BOT_NAME || "nexoratech-bot";
  const prefix = (PREFIX || "/").trim();
  const uptime = fmtUptime(process.uptime());
  const runtime = `Node.js ${process.version}`;
  const usersCount = Object.keys(getUsers() || {}).length;
  
  const lines = [
    `🤖 *Bot:* ${name}`,
    `🔑 *Prefix:* \`${prefix}\``,
    `⏳ *Uptime:* ${uptime}`,
    `⚡ *Runtime:* ${runtime}`,
    `🧑‍🤝‍🧑 *Users:* ${usersCount}`,
  ];
  return lines.join("\n");
}

function aiMenu(prefix) {
  return [
    "     【𝐀𝐈 𝐌𝐄𝐍𝐔】",
    "",
    `${prefix}chatgpt`,
    `${prefix}deepseek`,
    `${prefix}qwen-ai`,
  ].join("\n");
}

function downloadMenu(prefix) {
  return [
    "     【𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃】",
    "",
    `${prefix}apk <query>`,
    `${prefix}play <query/link>`,
    `${prefix}video <query/link>`,
    `${prefix}gitclone <query/link>`,
    `${prefix}ytmp4 <query/link>`,
  ].join("\n");
}

function groupMenu(prefix) {
  return [
    "     【𝐆𝐂 𝐌𝐄𝐍𝐔】",
    "",
    `${prefix}antilink <on/off>`,
    `${prefix}adminonly <on/off>`,
    `${prefix}antibadword <on/off>`,
    `${prefix}boost <on/off>`,
  ].join("\n");
}

function otherMenu(prefix) {
  return [
    "     【𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔】",
    "",
    `${prefix}owner`,
    `${prefix}buybot`,
    `${prefix}menu`,
  ].join("\n");
}

function adminMenu(prefix) {
  return [
    "     【𝐀𝐃𝐌𝐈𝐍 𝐂𝐌𝐃𝐒】",
    "",
    `${prefix}new-admin <user id>`,
    `${prefix}broadcast <message>`,
  ].join("\n");
}

function buildCaption(prefix, username) {
  const header = [
    `𝐇𝐞𝐥𝐥𝐨 ${username ? `@${username}` : ""} 𝐰𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 𝐧𝐞𝐱𝐨𝐫𝐚𝐭𝐞𝐜𝐡-𝐛𝐨𝐭`,
    "",
    SEP_TOP,
    botStats(),
    LINE,
  ].join("\n");
  
  const sections = [
    aiMenu(prefix),
    "",
    downloadMenu(prefix),
    "",
    groupMenu(prefix),
    "",
    otherMenu(prefix),
    "",
    adminMenu(prefix),
  ].join("\n");
  
  return `${header}\n\n${sections}`;
}

function buttons() {
  return {
    inline_keyboard: [
      [{ text: "💬 WhatsApp Channel", url: WHATSAPP_CHANNEL_URL }],
      [{ text: "📢 Telegram Channel", url: TELEGRAM_CHANNEL_URL }],
      [{ text: "👑 Contact Owner", url: OWNER_URL }],
    ],
  };
}

/* -------------------- public api -------------------- */
function sendMainMenu(bot, chatId, user = {}) {
  const prefix = (PREFIX || "/").trim();
  const username = user.username || user.first_name || "user";
  
  const caption = buildCaption(prefix, username);
  
  // Always send banner with caption and stacked buttons (WhatsApp first)
  bot
    .sendPhoto(chatId, BANNER_URL, {
      caption,
      parse_mode: "Markdown",
      reply_markup: buttons(),
    })
    .catch((err) => {
      // Fallback to text if image fails for any reason
      bot.sendMessage(chatId, caption, {
        parse_mode: "Markdown",
        reply_markup: buttons(),
      });
      console.error("menu banner send failed:", err?.message || err);
    });
}

function sendWelcome(bot, chatId) {
  const prefix = (PREFIX || "/").trim();
  const caption = [
    "👋 𝐖𝐞𝐥𝐜𝐨𝐦𝐞!",
    "",
    "You cannot use the bot, first join our channel.",
    "",
    `When you've followed our channel, use \`${prefix}start\` to restart the bot.`,
  ].join("\n");
  
  bot
    .sendPhoto(chatId, BANNER_URL, {
      caption,
      parse_mode: "Markdown",
      reply_markup: buttons(), // WhatsApp first, then Telegram, then Owner
    })
    .catch((err) => {
      bot.sendMessage(chatId, caption, {
        parse_mode: "Markdown",
        reply_markup: buttons(),
      });
      console.error("welcome banner send failed:", err?.message || err);
    });
}

module.exports = { sendMainMenu, sendWelcome };