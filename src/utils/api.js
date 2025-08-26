const axios = require("axios");

/**
 * ============= GLOBAL SETTINGS ============
 */
const API_KEY = "prince"; // your public API key
const BASE_PRINCE = "https://api.princetechn.com/api";
const BASE_KEITH = "https://apis-keith.vercel.app/ai";
const BASE_NEXORA = "https://api.nexoracle.com/ai";

/**
 * ============= HELPER FUNCTIONS ============
 */

/**
 * Generic function to fetch JSON data.
 * Returns null if it fails.
 */
async function fetchJson(url, headers = {}) {
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error("❌ fetchJson error:", error.message);
    return null;
  }
}

/**
 * Fetches binary file (buffer).
 */
async function fetchBuffer(url, headers = {}) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer", headers });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("❌ fetchBuffer error:", error.message);
    return null;
  }
}

/**
 * ============= AI APIs ============
 */

// GPT (Keith API)
async function chatGPT(query) {
  const url = `${BASE_KEITH}/gpt?q=${encodeURIComponent(query)}`;
  const result = await fetchJson(url);
  return result?.response || "⚠️ ChatGPT returned no response.";
}

// Deepseek V3
async function deepSeek(query) {
  const url = `${BASE_KEITH}/deepseekV3?q=${encodeURIComponent(query)}`;
  const result = await fetchJson(url);
  return result?.response || "⚠️ DeepSeek returned no response.";
}

// Qwen AI (Nexora API)
async function qwenAI(query) {
  const url = `${BASE_NEXORA}/qwen-ai?apikey=${API_KEY}&prompt=${encodeURIComponent(query)}`;
  const result = await fetchJson(url);
  return result?.response || "⚠️ Qwen AI returned no response.";
}

/**
 * ============= DOWNLOAD APIs ============
 */

// APK Downloader (Prince API)
async function apkDownload(appName) {
  const url = `${BASE_PRINCE}/download/apkdl?apikey=${API_KEY}&appName=${encodeURIComponent(appName)}`;
  return await fetchBuffer(url);
}

// Play / YT video downloader (MP4)
async function playVideo(urlLink) {
  const url = `${BASE_PRINCE}/download/mp4?apikey=${API_KEY}&url=${encodeURIComponent(urlLink)}`;
  return await fetchBuffer(url);
}

// Git clone downloader
async function gitClone(repoUrl) {
  const url = `${BASE_PRINCE}/download/gitclone?apikey=${API_KEY}&url=${encodeURIComponent(repoUrl)}`;
  return await fetchBuffer(url);
}

// YT MP4 downloader
async function ytMp4(link) {
  const url = `${BASE_PRINCE}/download/mp4?apikey=${API_KEY}&url=${encodeURIComponent(link)}`;
  return await fetchBuffer(url);
}

module.exports = {
  chatGPT,
  deepSeek,
  qwenAI,
  apkDownload,
  playVideo,
  gitClone,
  ytMp4,
  fetchJson,
  fetchBuffer,
};