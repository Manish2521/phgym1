# Powerhouse Gym & Spa — Website Package

## Files Included

```
powerhouse-gym/
├── index.html          ← Complete website (open in browser — works standalone)
├── backend/
│   ├── server.js       ← Node.js backend (MongoDB + Email)
│   ├── package.json    ← Backend dependencies
│   └── .env            ← Your credentials (fill this in)
└── SETUP.md            ← This file
```

---

## Option A — Just open index.html (No setup needed)
Double-click `index.html` → opens in Chrome → full website works.
Contact form will show success but won't save to database (no backend).

---

## Option B — Full backend (MongoDB + Email notifications)

### Step 1 — Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2 — Set up MongoDB (Free)
1. Go to https://cloud.mongodb.com
2. Create free account → Create free M0 cluster
3. Database Access → Add User (save username/password)
4. Network Access → Add IP → Allow from anywhere (0.0.0.0/0)
5. Connect → Drivers → Copy connection string

### Step 3 — Set up Gmail App Password
1. Go to myaccount.google.com
2. Security → 2-Step Verification → Turn ON
3. Security → App passwords → Create for "Mail"
4. Copy the 16-character password shown

### Step 4 — Fill in .env file
Open `backend/.env` and fill in:
```
MONGODB_URI=mongodb+srv://your_user:your_pass@cluster0.xxxxx.mongodb.net/powerhousegym
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_TO=team@powerhousegymandspa.in
PORT=5000
```

### Step 5 — Run the backend
```
cd backend
npm install
npm start
```
Backend runs at http://localhost:5000

### Step 6 — Connect website to backend
Open `index.html` in a text editor, find this line near the bottom:
```javascript
BACKEND_URL: '',
```
Change it to:
```javascript
BACKEND_URL: 'http://localhost:5000',
```
Save and refresh.

### Step 7 — Test
Fill in the contact form on the website.
You should receive an email notification AND the user gets an auto-reply.

---

## Deploy Online (Free — Vercel/Render)

### Deploy backend to Render (free)
1. Push `backend/` folder to GitHub
2. Go to render.com → New Web Service → Connect repo
3. Add environment variables (same as .env)
4. Deploy — get URL like `https://powerhouse-backend.onrender.com`
5. Update `BACKEND_URL` in index.html with your Render URL

### Deploy website to Vercel/Netlify (free)
1. Go to vercel.com or netlify.com
2. Drag and drop `index.html` → Deploy
3. Get live URL like `https://powerhouse-gym.vercel.app`

---

## Configuration (index.html)

Near the bottom of index.html, find `window.__PH_CONFIG`:

```javascript
window.__PH_CONFIG = {
  BACKEND_URL: '',           // Your backend URL
  PHONE: '+918800134969',
  WHATSAPP: '918800134969',
  GYM_NAME: 'Powerhouse Gym and Spa',
  ADDRESS: 'Spain House, C92...',
  EMAIL: 'team@powerhousegymandspa.in',
  INSTAGRAM: 'powerhousegymandspa',
  HOURS_WEEKDAY: 'Mon–Sat 6AM–10:30PM',
  HOURS_SUNDAY: 'Sun 12PM–4PM',
  MAP_URL: 'https://maps.google.com/...'
};
```

Edit any value here to update the website without changing anything else.

---

## SEO — Google Search Ranking

The website is fully optimised for:
- "gym near me"
- "weight loss gym Delhi"
- "fat loss gym Madangir"
- "personal training Delhi"
- "HIIT classes near me"
- "gym in Madangir"
- "affordable gym Delhi"
- "best gym New Delhi"

**To rank faster:**
1. Submit sitemap to Google Search Console (search.google.com/search-console)
2. Create Google Business Profile (business.google.com) — most important for local search
3. Post regularly on Instagram (@powerhousegymandspa) with location tags
4. Ask members to leave Google Reviews

---

## Support
Instagram: @powerhousegymandspa
