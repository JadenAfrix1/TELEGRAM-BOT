const axios = require("axios");
const fs = require("fs");
const path = require("path");

const downloadMedia = async (url, filename) => {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    
    const filePath = path.resolve(__dirname, "../../data/temp", filename);
    
    // Ensure temp folder exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(filePath));
      writer.on("error", reject);
    });
  } catch (err) {
    throw new Error(`Failed to download media: ${err.message}`);
  }
};

const fetchAPI = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw new Error(`API request failed: ${err.message}`);
  }
};

module.exports = {
  downloadMedia,
  fetchAPI,
};