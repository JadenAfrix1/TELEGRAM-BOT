const { ownerId } = require("../config/config");
const { formatUsername, getRuntime, getUptime } = require("../utils/helpers");
const { log } = require("../utils/logger");
const { getUsers } = require("../services/database");

const registerOtherCommands = (bot) => {
  // /owner - contact the main owner
  bot.onText(/^\/owner/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;
    
    bot.sendMessage(
      chatId,
      `Hello ${formatUsername(msg.from)}, you can contact the bot owner here:\n👉 https://t.me/${ownerId}`
    );
    log(`/owner used by ${username}`);
  });
  
  // /buybot - info about buying the bot
  bot.onText(/^\/buybot/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;
    
    bot.sendMessage(
      chatId,
      `Hello ${formatUsername(msg.from)},\n\nTo purchase or inquire about the bot, please contact the owner:\n👉 https://t.me/${ownerId}`
    );
    log(`/buybot used by ${username}`);
  });
  
  // /menu - shows main menu commands
  bot.onText(/^\/menu/, (msg) => {
    const chatId = msg.chat.id;
    const users = getUsers();
    const totalUsers = Object.keys(users).length;
    
    const botInfo = `
╔═❖ BOT INFO ❖═╗
🔹 Bot Name   :  NEXORATECH-BOT
🔹 Prefix     :  /
🔹 Uptime     :  ${getUptime()}
🔹 Runtime    :  ${getRuntime()}
🔹 Users      :  ${totalUsers}
╚═════════════╝
`;
    
    const menuMessage = `
${botInfo}

«••••••| 𝐍𝐄𝐗𝐎𝐑𝐀 |••••••»
Hello ${formatUsername(msg.from)}, welcome to *NEXORATECH-BOT* menu 🚀

╔═【𝐀𝐈 𝐌𝐄𝐍𝐔】═╗
/chatgpt
/deepseek
/qwen-ai
╚═════════════╝

╔═【𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃】═╗
/apk <query>
/play <query/link>
/video <query/link>
/gitclone <query/link>
/ytmp4 <query/link>
╚═════════════╝

╔═【𝐆𝐂 𝐌𝐄𝐍𝐔】═╗
/antilink <on/off>
/adminonly <on/off>
/antibadword <on/off>
/boost <on/off>
╚═════════════╝

╔═【𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔】═╗
/owner
/buybot
/menu
╚═════════════╝

╔═【𝐀𝐃𝐌𝐈𝐍 𝐂𝐌𝐃𝐒】═╗
/new-admin <user id>
/broadcast <message>
╚═════════════╝
`;
    
    bot.sendMessage(chatId, menuMessage, { parse_mode: "Markdown" });
    log(`/menu used by ${formatUsername(msg.from)}`);
  });
};

module.exports = {
  registerOtherCommands,
};