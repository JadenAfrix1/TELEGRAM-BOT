#!/bin/bash

# ==========================
# Termux Telegram Bot Setup
# ==========================

# Navigate to your bot folder
cd ~/nexoratech-bot || exit

# Install Node.js and npm if not installed
pkg install -y nodejs git

# Install dependencies
npm install

# Create .env file if not exists
if [ ! -f ".env" ]; then
  cat <<EOL > .env
BOT_TOKEN=YOUR_BOT_TOKEN
OWNER_ID=YOUR_OWNER_ID
CHANNEL_ID=YOUR_CHANNEL_ID
QWEN_API_KEY=YOUR_QWEN_API_KEY
PRINCE_API_KEY=YOUR_PRINCE_API_KEY
EOL
  echo ".env file created. Please edit it with your real keys."
fi

# Run the bot in the background using nohup
nohup node server.js > bot.log 2>&1 &

echo "Bot is running in the background. Logs: bot.log"