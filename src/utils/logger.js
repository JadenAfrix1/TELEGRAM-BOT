const fs = require("fs");
const path = require("path");

const logDir = path.resolve(__dirname, "../../logs");

// Ensure logs folder exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const getTimeStamp = () => {
  return new Date().toISOString().replace("T", " ").split(".")[0];
};

const log = (message) => {
  const time = getTimeStamp();
  const logMessage = `[INFO] [${time}] ${message}`;
  console.log(logMessage);
  
  fs.appendFileSync(path.join(logDir, "bot.log"), logMessage + "\n", "utf8");
};

const error = (message) => {
  const time = getTimeStamp();
  const errorMessage = `[ERROR] [${time}] ${message}`;
  console.error(errorMessage);
  
  fs.appendFileSync(path.join(logDir, "error.log"), errorMessage + "\n", "utf8");
};

module.exports = {
  log,
  error,
};