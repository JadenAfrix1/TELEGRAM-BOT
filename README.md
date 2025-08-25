<!--
  NexoraTech Telegram Bot Deployment Guide
  ========================================
  The most stunning, professional, and interactive deployment guide for your Telegram Bot.
  - Modern layout, interactive social badges
  - Carefully organized steps
  - Gorgeous SVG animations
  - Everything perfectly spaced and easy to follow
  - Social media buttons (Telegram, WhatsApp, YouTube)
-->

<p align="center">
  <img src="https://files.catbox.moe/m0c8n9.jpg" alt="NexoraTech Banner" width="100%" style="border-radius: 16px;"/>
</p>

<h1 align="center" style="font-size:2.8rem; margin-bottom:0; color:#4F8EF7;">🚀 NexoraTech Telegram Bot Deployment Guide</h1>
<h3 align="center" style="color:#16181a; font-weight:700; margin-top:0;">The Ultimate, Professional & Dazzling Deployment Experience</h3>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=25&pause=1200&color=4F8EF7&center=true&vCenter=true&width=520&lines=Deploy+in+Minutes%2C+Not+Hours!;Render+%7C+Vercel+%7C+Termux+Ready;Connect%2C+Automate%2C+Conquer+Telegram" alt="Typing SVG" />
</p>

---

<div align="center" style="margin-bottom:18px;">
  <a href="termux.md">
    <img src="https://img.shields.io/badge/Run%20on-Termux-27ae60?style=for-the-badge&logo=android" alt="Run on Termux" />
  </a>
  <img src="https://img.shields.io/badge/Platform-Node.js-green?style=for-the-badge&logo=node.js" alt="Node.js Platform"/>
  <img src="https://img.shields.io/badge/Deploy-Render-purple?style=for-the-badge&logo=render" alt="Render Deploy"/>
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel Deploy"/>
</div>

---

## 🌐 Connect With Us

<div align="center" style="margin-bottom:25px;">
  <a href="https://t.me/nexoratechn" target="_blank">
    <img src="https://img.shields.io/badge/Telegram-Channel-4F8EF7?style=for-the-badge&logo=telegram" alt="Telegram Channel" />
  </a>
  <a href="https://whatsapp.com/channel/0029VaGCZ8D5pU1Y5uXc4I2p" target="_blank">
    <img src="https://img.shields.io/badge/WhatsApp-Channel-25D366?style=for-the-badge&logo=whatsapp" alt="WhatsApp Channel" />
  </a>
  <a href="https://www.youtube.com/@nexoratech" target="_blank">
    <img src="https://img.shields.io/badge/YouTube-Subscribe-FF0000?style=for-the-badge&logo=youtube" alt="YouTube Subscribe" />
  </a>
</div>

---

## 🛡️ 1. Environment Variables & Setup

Before deploying, you **must** configure your bot’s secrets.  
Create a `.env` file in your project root:

```env
BOT_TOKEN=YOUR_BOT_TOKEN_HERE
OWNER_ID=YOUR_TELEGRAM_ID_HERE
CHANNEL_ID=@nexoratechn
QWEN_API_KEY=YOUR_QWEN_API_KEY_HERE
PRINCE_API_KEY=YOUR_PRINCE_API_KEY_HERE
```

> **Replace all placeholders with your real values.**  
> Never share your API keys or bot token publicly.

---

## ⚡ 2. Deploy on Render

<details>
  <summary><b>Step-by-Step Render Deployment</b></summary>

<br/>

1. **Go to [Render Dashboard](https://dashboard.render.com/) → New Web Service.**
2. **Set environment to Node and select the Free plan.**
3. **Use deployment config:**  
   &nbsp;&nbsp;`deployments/render.yaml`
4. **Add the environment variables from your `.env` file:**
    - `BOT_TOKEN`
    - `OWNER_ID`
    - `CHANNEL_ID`
    - `QWEN_API_KEY`
    - `PRINCE_API_KEY`
5. **Click Deploy.**  
   Render will automatically build & run your bot!

<p align="center">
  <img src="https://user-images.githubusercontent.com/58467437/215333959-b30cc0e7-2fdd-4e5c-b492-3d3b8ebd5a25.gif" alt="Render Deploy Animation" width="320"/>
</p>

</details>

---

## 🏁 3. Deploy on Vercel

<details>
  <summary><b>Vercel Deployment Steps</b></summary>

<br/>

1. **Install Vercel CLI (Optional, but recommended):**
   ```shell
   npm install -g vercel
   ```

2. **Add environment variables via CLI or Dashboard:**
   ```shell
   vercel env add BOT_TOKEN production
   vercel env add OWNER_ID production
   vercel env add CHANNEL_ID production
   vercel env add QWEN_API_KEY production
   vercel env add PRINCE_API_KEY production
   ```

3. **Deploy in production mode:**
   ```shell
   vercel --prod
   ```

4. **Check logs:**  
   Vercel Dashboard → Functions → `server.js`

<p align="center">
  <img src="https://media.giphy.com/media/KzJkzjggfGN5Py6zz6/giphy.gif" alt="Vercel Deploy Animation" width="320"/>
</p>

</details>

---

## 📱 Deploy on Termux

If you want to deploy on Termux (Android):

<p align="center">
  <a href="termux.md">
    <img src="https://img.shields.io/badge/Run-Termux-27ae60?style=for-the-badge&logo=android" alt="Run on Termux" />
  </a>
</p>

---

## 💡 Pro Tips

- **Keep your `.env` file secret.** Never commit it to Git or share it.
- **Use [dotenv](https://www.npmjs.com/package/dotenv) in your Node.js app** for loading environment variables.
- **Monitor logs** for errors or crashes after deployment.
- **Update your dependencies regularly** to stay secure.

---

## 🤝 Need Help?

- Check the [Issues](https://github.com/JadenAfrix1/TELEGRAM-BOT/issues) tab for help.
- Join the [NexoraTech Community](https://t.me/nexoratechn) on Telegram.
- Message us on [WhatsApp Channel](https://whatsapp.com/channel/0029VaGCZ8D5pU1Y5uXc4I2p)
- Subscribe to [YouTube Tutorials](https://www.youtube.com/@nexoratech)
- For advanced deployment, see [serverless docs](https://vercel.com/docs/concepts/functions/serverless-functions) or [Render docs](https://render.com/docs/deploy-nodejs).

---

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1500&color=4F8EF7&center=true&vCenter=true&width=400&lines=Happy+Deploying!+🎉;Follow+Us+for+More+Dope+Projects" alt="Happy Deploying Typing SVG" />
</p>

---