const { ownerId } = require("../config/config");

const mainMenu = (username) => {
  return {
    text: `𝐇𝐞𝐥𝐥𝐨 ${username}, welcome to nexoratech-bot menu!\n\n«••••••| 𝐍𝐄𝐗𝐎𝐑𝐀 |••••••»\n𝐥𝐢𝐬𝐭 𝐦𝐞𝐧𝐮 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬 🫠

【𝐀𝐈 𝐌𝐄𝐍𝐔】
/chatgpt
/deepseek
/qwen-ai

【𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃】
/apk <query>
/play <query/link>
/video <query/link>
/gitclone <query/link>
/ytmp4 <query/link>

【𝐆𝐂 𝐌𝐄𝐍𝐔】
/antilink <on/off>
/adminonly <on/off>
/antibadword <on/off>
/boost <on/off>

【𝐎𝐓𝐇𝐄𝐑 𝐌𝐄𝐍𝐔】
/owner
/buybot
/menu

【𝐀𝐃𝐌𝐈𝐍 𝐂𝐌𝐃𝐒】
/new-admin <user id>
/broadcast <message>`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Owner", url: `https://t.me/${ownerId}` }],
      ],
    },
  };
};

module.exports = mainMenu;