require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Import middlewares
const { requireChannelMembership } = require("./src/middlewares/auth");
const { registerGroupMiddleware } = require("./src/middlewares/groupRules");

// Import commands
const { registerDownloadCommands } = require("./src/commands/download");
const { registerAICommands } = require("./src/commands/ai");
const { registerGroupCommands } = require("./src/commands/group");
const { registerOtherCommands } = require("./src/commands/other");
const { registerAdminCommands } = require("./src/commands/admin");

// Import menu and banner
const mainMenu = require("./src/menus/mainMenu");
const { getBanner } = require("./src/menus/banners");

// Initialize bot in polling mode
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ================== START COMMAND ==================
bot.onText(/\/start/, requireChannelMembership(bot, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;
  
  // Send banner
  const banner = getBanner();
  bot.sendPhoto(chatId, banner.photo, { caption: banner.caption }).catch(() => {});
  
  // Send main menu
  bot.sendMessage(chatId, mainMenu(username).text, { reply_markup: mainMenu(username).reply_markup });
}));

// ================== REGISTER MIDDLEWARES ==================
registerGroupMiddleware(bot);

// ================== REGISTER COMMANDS ==================
registerDownloadCommands(bot);
registerAICommands(bot);
registerGroupCommands(bot);
registerOtherCommands(bot);
registerAdminCommands(bot);

// ================== LOGGING ==================
bot.on("polling_error", (err) => {
  console.error("Polling error:", err.code, err.message);
});

bot.on("webhook_error", (err) => {
  console.error("Webhook error:", err.code, err.message);
});

console.log("✅ NexoraTech Bot is running...");