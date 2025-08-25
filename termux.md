<!--
  NexoraTech Telegram Bot | Termux Deployment
  ===========================================
  The most beautiful, unique, and interactive guide for running your bot on Android with Termux.
  - Colorful, emoji-rich layout
  - Banner, live SVG headings, dynamic badges
  - Step-by-step, copy-friendly commands
  - No placeholders—repo URL is real!
  - Social media buttons
  - Navigation to README.md
  - Fun, motivational, and easy to use!
-->

<p align="center">
  <img src="https://files.catbox.moe/m0c8n9.jpg" alt="NexoraTech Banner" width="100%" style="border-radius:25px; box-shadow:0 10px 40px #E91E6380;"/>
</p>

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&pause=1500&color=E91E63&center=true&vCenter=true&width=680&lines=Deploy+Your+Bot+on+Android+–+No+Limits!;Mobile+Automation+for+Pros!;Termux+is+Your+Superpower!+%F0%9F%A4%A9"
    alt="Animated Heading"/>
</div>

---

<div align="center">
  <a href="README.md">
    <img src="https://img.shields.io/badge/%E2%AC%85%20Back%20to%20Main%20Guide-4F8EF7?style=for-the-badge&logo=github" alt="Back to Main Guide" />
  </a>
</div>

---

## 🦾 Why Termux?  
Deploy your NexoraTech Telegram Bot **directly on your Android phone**—no computer, no server, just pure mobile power.  
Perfect for creators, admins, and techies who want freedom, control, and zero hosting bills.  
**Let’s make your bot run anywhere, anytime.**

---

<div align="center">
  <a href="https://t.me/nexoratechn" target="_blank"><img src="https://img.shields.io/badge/Telegram-4F8EF7?style=for-the-badge&logo=telegram" alt="Telegram" /></a>
  <a href="https://whatsapp.com/channel/0029VaGCZ8D5pU1Y5uXc4I2p" target="_blank"><img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp" alt="WhatsApp" /></a>
  <a href="https://www.youtube.com/@nexoratech" target="_blank"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube" alt="YouTube" /></a>
</div>

---

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=26&pause=1400&color=00C853&center=true&vCenter=true&width=480&lines=Ready%3F+Let%27s+Deploy+in+10+Steps!+%F0%9F%9A%80" alt="Lets Get Started Typing SVG"/>
</div>

---

## 🌈 **Step-by-Step Termux Guide**

> All commands below are **real** and copyable.  
> There are no placeholders—your repo is used!  
> You’ll be running in minutes.  
> **Don’t skip any steps!**

---

### 1️⃣ **Update Termux to the Latest Packages**

```sh
pkg update -y
```
```sh
pkg upgrade -y
```

---

### 2️⃣ **Install All Essentials**

```sh
pkg install -y git nodejs nano wget
```

---

### 3️⃣ **Clone NexoraTech Telegram Bot**

```sh
cd ~
```
```sh
git clone https://github.com/JadenAfrix1/TELEGRAM-BOT.git
```
```sh
cd TELEGRAM-BOT
```

---

### 4️⃣ **Install Node.js Dependencies**

```sh
npm install
```

---

### 5️⃣ **Create Your .env File (with Nano)**

```sh
nano .env
```
Paste this and fill in your own keys!
```env
BOT_TOKEN=YOUR_BOT_TOKEN_HERE
OWNER_ID=YOUR_TELEGRAM_ID_HERE
CHANNEL_ID=@nexoratechn
QWEN_API_KEY=YOUR_QWEN_API_KEY_HERE
PRINCE_API_KEY=YOUR_PRINCE_API_KEY_HERE
```
> **Never share your .env file! Keep secrets safe.**

---

### 6️⃣ **Create Data Folder & JSON Files**

```sh
mkdir -p data
```
```sh
touch data/admins.json data/users.json data/groups.json
```

---

### 7️⃣ **Run Your Bot (Foreground Mode)**

```sh
node server.js
```

---

### 8️⃣ **Run Your Bot in the Background (Recommended)**

```sh
nohup node server.js > bot.log 2>&1 &
```
> Now your bot keeps running even if you close Termux!

---

### 9️⃣ **Prevent Android from Suspending Termux**

```sh
termux-wake-lock
```
> This keeps your bot alive when the screen is off or Termux is in the background.

---

### 🔟 **Monitor Bot Logs in Real Time**

```sh
tail -f bot.log
```
> Watch your bot's activity live!

---

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1500&color=4F8EF7&center=true&vCenter=true&width=600&lines=Your+Bot+is+Live+on+Android!+%F0%9F%9A%80;Welcome+to+the+Elite+Mobile+Club+%F0%9F%94%A5;Need+help%3F+Contact+us+on+Telegram%2C+WhatsApp%2C+YouTube" />
</div>

---

## 🧠 **Pro Tips**

- **Stop the bot:** `CTRL+C` (foreground) or `kill` (background)
- **Update the bot:**  
  ```sh
  git pull
  ```
  Then restart your bot!
- **Auto-restart:** Use [PM2](https://pm2.keymetrics.io/) for advanced uptime (optional).
- **Get support:** Telegram, WhatsApp & YouTube above.

---

## 🎉 **Why Termux Is Epic**

- No hosting bills—run it all for FREE
- Portable—your bot goes wherever you do
- Learn, test, and automate like a pro

---

<div align="center" style="margin-bottom:25px;">
  <a href="README.md">
    <img src="https://img.shields.io/badge/%E2%AC%85%20Back%20to%20Main%20Guide-4F8EF7?style=for-the-badge&logo=github" alt="Back to Main Guide" />
  </a>
</div>

---

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=26&pause=1200&color=E91E63&center=true&vCenter=true&width=520&lines=You+are+an+Android+Automation+Champion!+%F0%9F%92%A5;Happy+Deploying+from+NexoraTech+%F0%9F%91%8C" alt="Termux Pro SVG"/>
</p>