const { fetchAPI } = require("../utils/api");
const { log, error } = require("../utils/logger");
const { apis } = require("../config/config");

/**
 * Sanitize & refine AI response text
 * - removes unwanted signatures/credits
 * - trims excessive whitespace
 * - makes sure text looks clean
 */
const refineResponse = (text) => {
  if (!text) return "⚠️ No response from AI.";

  // Remove any unwanted branding/creator mentions
  const blacklist = [
    "powered by",
    "created by",
    "OpenAI",
    "ChatGPT",
    "Qwen",
    "DeepSeek",
    "Anthropic",
    "AI model",
  ];

  let clean = text;
  blacklist.forEach((word) => {
    const regex = new RegExp(word, "ig");
    clean = clean.replace(regex, "");
  });

  // Remove bot-like prefixes
  clean = clean
    .replace(/^(AI|Bot|Assistant)[:\-]/i, "")
    .replace(/\s+/g, " ") // normalize spaces
    .trim();

  // Make it a bit cooler looking
  return `✨ ${clean}`;
};

/**
 * Handle AI commands
 */
const handleAICommand = async (bot, msg, command) => {
  const chatId = msg.chat.id;
  const query = msg.text.split(" ").slice(1).join(" ");

  if (!query) {
    bot.sendMessage(
      chatId,
      `❓ Please provide a query.\nExample:\n\`${command} hello\``,
      { parse_mode: "Markdown" }
    );
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
      bot.sendMessage(chatId, "❌ Unknown AI command.");
      return;
  }

  try {
    bot.sendMessage(chatId, "⚡ Thinking...");

    const result = await fetchAPI(apiUrl);
    let responseText = "";

    if (command === "/chatgpt" || command === "/deepseek") {
      responseText = result.answer || result.output || result.response || JSON.stringify(result);
    } else if (command === "/qwen-ai") {
      responseText = result.text || result.result || JSON.stringify(result);
    }

    const finalResponse = refineResponse(responseText);

    bot.sendMessage(chatId, finalResponse, {
      parse_mode: "Markdown",
    });

    log(`AI command ${command} used by ${msg.from.username || msg.from.first_name}`);
  } catch (err) {
    error(`Failed AI command ${command}: ${err.message}`);
    bot.sendMessage(chatId, `❌ Error: ${err.message}`);
  }
};

/**
 * Export function to attach commands to bot
 */
const registerAICommands = (bot) => {
  ["/chatgpt", "/deepseek", "/qwen-ai"].forEach((cmd) => {
    bot.onText(new RegExp(`^\\${cmd}`), (msg) =>
      handleAICommand(bot, msg, cmd)
    );
  });
};

module.exports = {
  registerAICommands,
};