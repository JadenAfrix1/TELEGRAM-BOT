require("dotenv").config();

module.exports = {
  botToken: process.env.BOT_TOKEN,
  ownerId: process.env.OWNER_ID,
  channelId: process.env.CHANNEL_ID,
  
  // APIs
  apis: {
    chatgpt: "https://apis-keith.vercel.app/ai/gpt?q=",
    deepseek: "https://apis-keith.vercel.app/ai/deepseekV3?q=",
    qwen: `https://api.nexoracle.com/ai/qwen-ai?apikey=${process.env.QWEN_API_KEY}&prompt=`,
    apk: `https://api.princetechn.com/api/download/apkdl?apikey=${process.env.PRINCE_API_KEY}&appName=`,
    play: `https://api.princetechn.com/api/download/mp4?apikey=${process.env.PRINCE_API_KEY}&url=`,
    video: `https://api.princetechn.com/api/download/mp4?apikey=${process.env.PRINCE_API_KEY}&url=`,
    gitclone: `https://api.princetechn.com/api/download/gitclone?apikey=${process.env.PRINCE_API_KEY}&url=`,
    ytmp4: `https://api.princetechn.com/api/download/mp4?apikey=${process.env.PRINCE_API_KEY}&url=`,
  },
  
  // Group moderation settings
  group: {
    antiLink: true,
    adminOnly: false,
    antiBadWord: true,
    boost: true,
    boostLimitPerUser: 3,
  },
  
  // Bot defaults
  defaultLanguage: "en",
  maxWarnings: 3,
};