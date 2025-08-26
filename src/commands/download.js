const { apkDownload, playVideo, gitClone, ytMp4 } = require("../utils/api");

/**
 * Register all download commands with retry logic.
 */
function registerDownloadCommands(bot) {
  // Helper function for retries
  async function withRetry(task, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await task();
      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        if (attempt === retries) throw error;
      }
    }
  }
  
  /**
   * /apk <app name>
   */
  bot.onText(/\/apk (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const appName = match[1];
    
    bot.sendMessage(chatId, `⏳ Downloading APK for *${appName}*...`, { parse_mode: "Markdown" });
    
    try {
      const buffer = await withRetry(() => apkDownload(appName));
      if (!buffer) return bot.sendMessage(chatId, "❌ Failed to fetch APK.");
      
      await bot.sendDocument(chatId, buffer, {}, { filename: `${appName}.apk` });
    } catch (err) {
      bot.sendMessage(chatId, "⚠️ APK download failed after retries.");
    }
  });
  
  /**
   * /play <yt url>
   */
  bot.onText(/\/play (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const ytUrl = match[1];
    
    bot.sendMessage(chatId, `🎬 Fetching video from: ${ytUrl}`);
    
    try {
      const buffer = await withRetry(() => playVideo(ytUrl));
      if (!buffer) return bot.sendMessage(chatId, "❌ Failed to fetch video.");
      
      await bot.sendVideo(chatId, buffer, { caption: `🎥 Here’s your video: ${ytUrl}` });
    } catch (err) {
      bot.sendMessage(chatId, "⚠️ Video fetch failed after retries.");
    }
  });
  
  /**
   * /gitclone <repo url>
   */
  bot.onText(/\/gitclone (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const repoUrl = match[1];
    
    bot.sendMessage(chatId, `📦 Cloning repository: ${repoUrl}`);
    
    try {
      const buffer = await withRetry(() => gitClone(repoUrl));
      if (!buffer) return bot.sendMessage(chatId, "❌ Git clone failed.");
      
      await bot.sendDocument(chatId, buffer, {}, { filename: "repository.zip" });
    } catch (err) {
      bot.sendMessage(chatId, "⚠️ Git clone failed after retries.");
    }
  });
  
  /**
   * /ytmp4 <yt url>
   */
  bot.onText(/\/ytmp4 (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const ytUrl = match[1];
    
    bot.sendMessage(chatId, `🎥 Downloading YouTube MP4: ${ytUrl}`);
    
    try {
      const buffer = await withRetry(() => ytMp4(ytUrl));
      if (!buffer) return bot.sendMessage(chatId, "❌ Failed to fetch video.");
      
      await bot.sendVideo(chatId, buffer, { caption: `📥 YouTube video downloaded successfully.` });
    } catch (err) {
      bot.sendMessage(chatId, "⚠️ YT MP4 failed after retries.");
    }
  });
}

module.exports = { registerDownloadCommands };