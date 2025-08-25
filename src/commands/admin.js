const { adminOnly, ownerOnly } = require("../middlewares/permissions");
const { getAdmins, saveAdmins } = require("../services/database");

/**
 * Register admin commands
 * @param {TelegramBot} bot
 */
function registerAdminCommands(bot) {
  // Broadcast message to all users
  bot.onText(/\/broadcast (.+)/, adminOnly(bot, async (msg) => {
    const text = msg.text.replace("/broadcast ", "");
    const users = require("../services/database").getUsers();
    let count = 0;
    
    for (const userId of Object.keys(users)) {
      try {
        await bot.sendMessage(userId, text);
        count++;
      } catch (err) {
        console.error(`Failed to send to ${userId}: ${err.message}`);
      }
    }
    
    bot.sendMessage(msg.chat.id, `✅ Broadcast sent to ${count} users.`);
  }));
  
  // Add new admin (owner only)
  bot.onText(/\/new-admin (\d+)/, ownerOnly(bot, (msg) => {
    const newAdminId = msg.text.split(" ")[1];
    const admins = getAdmins();
    admins[newAdminId] = true;
    saveAdmins(admins);
    bot.sendMessage(msg.chat.id, `✅ User ${newAdminId} is now an admin.`);
  }));
  
  // Remove admin (owner only)
  bot.onText(/\/remove-admin (\d+)/, ownerOnly(bot, (msg) => {
    const removeId = msg.text.split(" ")[1];
    const admins = getAdmins();
    if (admins[removeId]) {
      delete admins[removeId];
      saveAdmins(admins);
      bot.sendMessage(msg.chat.id, `✅ User ${removeId} removed from admins.`);
    } else {
      bot.sendMessage(msg.chat.id, `⚠️ User ${removeId} is not an admin.`);
    }
  }));
  
  // List admins (owner only)
  bot.onText(/\/list-admins/, ownerOnly(bot, (msg) => {
    const admins = getAdmins();
    const adminList = Object.keys(admins).join("\n") || "No admins found.";
    bot.sendMessage(msg.chat.id, `🛡️ Admins:\n${adminList}`);
  }));
}

module.exports = { registerAdminCommands };