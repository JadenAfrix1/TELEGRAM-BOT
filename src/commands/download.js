const { downloadMedia } = require("../utils/api");
const { log, error } = require("../utils/logger");
const { apis } = require("../config/config");
const path = require("path");
const fs = require("fs");

const handleDownloadCommand = async (bot, msg, command) => {
  const chatId = msg.chat.id;
  const query = msg.text.split(" ").slice(1).join(" ");
  
  if (!query) {
    bot.sendMessage(chatId, `Please provide a query or link. Example:\n${command} <query/link>`);
    return;
  }
  
  let apiUrl;
  switch (command) {
    case "/apk":
      apiUrl = `${apis.apk}${encodeURIComponent(query)}`;
      break;
    case "/play":
      apiUrl = `${apis.play}${encodeURIComponent(query)}`;
      break;
    case "/video":
      apiUrl = `${apis.video}${encodeURIComponent(query)}`;
      break;
    case "/gitclone":
      apiUrl = `${apis.gitclone}${encodeURIComponent(query)}`;
      break;
    case "/ytmp4":
      apiUrl = `${apis.ytmp4}${encodeURIComponent(query)}`;
      break;
    default:
      bot.sendMessage(chatId, "Unknown download command.");
      return;
  }
  
  try {
    bot.sendMessage(chatId, "Downloading your file... ⏳");
    
    // Generate temp filename
    const filename = `${command.replace("/", "")}_${Date.now()}.mp4`;
    const filePath = await downloadMedia(apiUrl, filename);
    
    // Send file as media
    await bot.sendDocument(chatId, fs.createReadStream(filePath));
    
    // Cleanup
    fs.unlinkSync(filePath);
    
    log(`Download command ${command} used by ${msg.from.username || msg.from.first_name}`);
  } catch (err) {
    error(`Failed download command ${command}: ${err.message}`);
    bot.sendMessage(chatId, `Error downloading file: ${err.message}`);
  }
};

// Export function to attach download commands
const registerDownloadCommands = (bot) => {
  ["/apk", "/play", "/video", "/gitclone", "/ytmp4"].forEach((cmd) => {
    bot.onText(new RegExp(`^\\${cmd}`), (msg) => handleDownloadCommand(bot, msg, cmd));
  });
};

module.exports = {
  registerDownloadCommands,
};