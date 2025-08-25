const { fetchAPI } = require("../utils/api");
const { log, error } = require("../utils/logger");
const { apis } = require("../config/config");

const handleAICommand = async (bot, msg, command) => {
  const chatId = msg.chat.id;
  const query = msg.text.split(" ").slice(1).join(" ");
  
  if (!query) {
    bot.sendMessage(chatId, `Please provide a query. Example:\n${command} hello`);
    return;
  }
  
  let apiUrl;
  switch (command) {
    case "/chatgpt":
      apiUrl = `${apis.chatgpt}${encodeURIComponent(query)}`;
      break;
    case "/deepseek":
      apiUrl = `${apis.deepseek}${encodeURIComponent(query)}`;
      break;
    case "/qwen-ai":
      apiUrl = `${apis.qwen}${encodeURIComponent(query)}`;
      break;
    default:
      bot.sendMessage(chatId, "Unknown AI command.");
      return;
  }
  
  try {
    bot.sendMessage(chatId, "Processing your request... ⏳");
    const result = await fetchAPI(apiUrl);
    
    let responseText = "";
    if (command === "/chatgpt" || command === "/deepseek") {
      responseText = result.answer || JSON.stringify(result);
    } else if (command === "/qwen-ai") {
      responseText = result.text || JSON.stringify(result);
    }
    
    bot.sendMessage(chatId, responseText || "No response from API.");
    log(`AI command ${command} used by ${msg.from.username || msg.from.first_name}`);
  } catch (err) {
    error(`Failed AI command ${command}: ${err.message}`);
    bot.sendMessage(chatId, `Error processing your request: ${err.message}`);
  }
};

// Export function to attach commands to bot
const registerAICommands = (bot) => {
  ["/chatgpt", "/deepseek", "/qwen-ai"].forEach((cmd) => {
    bot.onText(new RegExp(`^\\${cmd}`), (msg) => handleAICommand(bot, msg, cmd));
  });
};

module.exports = {
  registerAICommands,
};