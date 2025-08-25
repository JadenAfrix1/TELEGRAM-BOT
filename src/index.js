require("dotenv").config();
const server = require("../server");
const { ownerId } = require("./config/config");

console.log("✅ NexoraTech Bot is starting...");
console.log(`Bot Owner ID: ${ownerId}`);
console.log("Bot is running in polling mode.");
