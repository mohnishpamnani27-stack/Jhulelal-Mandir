# 🙏 झूलेलाल मंदिर — Progressive Web App

A devotional PWA for the Jhulelal Mandir: **Aarti, Varun Chalisa, Gujji Deh ki Vidhi, and Spiritual Notes** — in **Hindi and Sindhi**, installable on any phone, and readable **without internet** after the first visit.

## ▶️ Run it on your computer

```bash
npm install     # first time only
npm run dev     # then open http://localhost:3000
```

## 📱 What's inside

| Feature | Where |
|---|---|
| Home page with all 4 features one tap away | `app/page.js` |
| झूलेलाल आरती | opens at `/aarti` |
| वरुण चालीसा | opens at `/chalisa` |
| गुज्जी देह की विधि | opens at `/vidhi` |
| आध्यात्मिक नोट्स | opens at `/notes` |

Built for **all ages**: big buttons, **A− / A+** text-size controls, one-tap **हिंदी ⇄ सिंधी** toggle (your choice is remembered), and no menus to get lost in.

## ✍️ Editing the texts (most important!)

**All scriptures live in one file: `lib/content.js`.**
Open it, edit the Hindi (`hi`) or Sindhi (`sd`) lines, save — done. Each string in the `verses` array becomes one card on screen. Add a string to add a verse; the pages update automatically.

> 🙏 **Please have your Pujari ji verify every line.** The included Aarti/Chalisa are commonly sung versions and may differ slightly from your mandir's paath. The Sindhi text uses Devanagari script so everyone can read it.

To add a **whole new section** (e.g. पल्लव साहिब): copy one block in `lib/content.js` (like `notes`), give it a new key/id/icon/title/verses, and add its id to `featureOrder`. A new card and page appear automatically.

## 🖼️ Adding Bhagwan Jhulelal's photo

1. Save the mandir's photo as `public/jhulelal.jpg` (replacing the placeholder). A square-ish photo looks best in the golden circular frame.
2. Rebuild the app icons from the photo: `npm run icons -- --from-photo`

## 🚀 Deploying FREE on Vercel

1. Create a free account at [github.com](https://github.com) and [vercel.com](https://vercel.com) (sign in with GitHub).
2. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Jhulelal Mandir PWA"
   git branch -M main
   git remote add origin https://github.com/<your-username>/jhulelal-mandir.git
   git push -u origin main
   ```
3. On Vercel: **Add New → Project → Import** your repo → **Deploy**. No settings needed.
4. You get a free permanent URL like `jhulelal-mandir.vercel.app` (free HTTPS, no hosting cost). Share this link in the mandir WhatsApp group — devotees open it once and tap **"इंस्टॉल करें"** (the app shows the banner itself; on iPhone it explains Share → Add to Home Screen).

Every time you `git push`, Vercel redeploys automatically. After changing texts, also bump `CACHE_VERSION` in `public/sw.js` (v1 → v2) so installed phones fetch the new version.

## 🗂️ Project map

```
app/layout.js            App shell, fonts, PWA metadata
app/globals.css          All styling (saffron/gold theme, sizes)
app/page.js              Home page
app/[scripture]/page.js  One route for all scripture pages
components/              Header, Reader, InstallPrompt, SWRegister
lib/content.js           ⭐ ALL TEXTS — edit here
lib/LanguageContext.js   Hindi/Sindhi toggle + text-size memory
public/manifest.json     PWA install config
public/sw.js             Offline support (service worker)
scripts/generate-icons.mjs  npm run icons
scripts/crop-vidhi.mjs      npm run crop  (vidhi poster photos)
scripts/crop-posters.mjs    npm run crop:posters  (Hinglaj + samagri photos)
```

जय झूलेलाल! 🪔
