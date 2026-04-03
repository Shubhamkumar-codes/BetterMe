# 🔥 TRANSFORM — Daily Streak Tracker

A Duolingo-style streak tracker for complete lifestyle transformation — covering **workout**, **diet**, and **mind** growth in one app.

Built for consistency, not perfection. Check off your daily tasks, maintain streaks, and watch yourself transform.

![Made with React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-FF6B35)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **🔥 Streak System** — Duolingo-style daily streaks for 3 categories (Workout, Diet, Mind). Miss a day and the streak resets.
- **📋 Daily Missions** — 4 checkable tasks per category. Complete all 4 to earn that day's streak.
- **👑 Perfect Days** — Complete all 3 categories in one day to earn a Perfect Day badge.
- **🏋️ Full Workout Plan** — 7-day Push/Pull/Legs split with core stability focus (designed for lumbar lordosis correction).
- **🥗 Budget Diet Plan** — High protein, Indian non-veg meals with per-meal cost breakdown (~₹7,300/month).
- **🧠 Mind Expansion Plan** — Daily 1-hour routine: Reading → Brain Training → Journaling → Meditation.
- **📅 Weekly Calendar** — Visual overview of your week with fire/cloud/empty indicators.
- **🎊 Confetti Celebration** — Animated confetti when you complete a Perfect Day.
- **📱 PWA Support** — Install on your phone's home screen like a native app.
- **💾 Persistent Data** — Streaks and history saved in localStorage. Survives browser restarts.
- **🌙 Dark Theme** — Easy on the eyes, designed for daily use.

---

## 📸 App Sections

| Home Dashboard | Workout Plan | Diet Plan | Mind Plan |
|:-:|:-:|:-:|:-:|
| Streak cards + daily missions | 7-day PPL split with exercises | 6 meals with budget breakdown | Reading, chess, journaling, meditation |

---

## 🚀 Quick Start

### Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/transform-tracker.git
cd transform-tracker

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

---

## 📱 Install as Phone App (PWA)

Once deployed (or running locally), open the URL on your phone:

**Android (Chrome):**
Three dots menu ⋮ → "Add to Home screen" → Name it "TRANSFORM"

**iPhone (Safari):**
Share button → "Add to Home Screen" → Name it "TRANSFORM"

It opens full-screen without a browser bar — looks and feels like a real app.

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI components and state management |
| **Vite 5** | Fast build tool and dev server |
| **localStorage** | Persistent streak and history data |
| **PWA Manifest** | Home screen installation support |
| **CSS-in-JS** | Inline styles for zero-dependency styling |

No external UI libraries. No state management libraries. No CSS frameworks. Pure React — lightweight and fast.

---

## 📁 Project Structure

```
transform-tracker/
├── index.html              # Entry HTML with PWA meta tags
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── icon-192.png        # App icon (192x192)
│   └── icon-512.png        # App icon (512x512)
└── src/
    ├── main.jsx            # React entry point
    └── App.jsx             # Entire app (single component)
```

---

## 🏋️ Workout Plan Overview

A 7-day **Push/Pull/Legs** split designed for intermediate lifters with special attention to **core stability** and **lumbar health**.

| Day | Focus | Highlight |
|---|---|---|
| Day 1 | Push + Core | Bench, OHP, Dead Bugs, Pallof Press |
| Day 2 | Pull + Core | Rows, Pulldowns, Bird Dogs, Side Planks |
| Day 3 | Legs + Flexibility | Squats, RDL, Hip Thrusts, Deep Stretches |
| Day 4 | Push + Core (Variation) | DB Press, Flyes, Ab Wheel, Hollow Hold |
| Day 5 | Pull + Core (Variation) | Pull-ups, T-Bar Row, Hanging Knee Raise |
| Day 6 | Legs + Mobility | Front Squats, Bulgarian Split Squats, Full Mobility Flow |
| Day 7 | Active Recovery | Walk, Foam Roll, Yoga, Breathwork |

⭐ exercises specifically target lumbar lordosis correction through anti-extension and pelvic stability work.

---

## 🥗 Diet Plan Overview

High-protein, budget-friendly Indian non-veg diet optimized for fat loss and muscle gain.

- **Target:** ~2100 kcal | 170g protein | 200g carbs | 60g fat
- **Monthly Cost:** ~₹7,300
- **Key Foods:** Eggs, chicken, fish, sattu, dal, peanuts, milk
- **Secret Weapon:** Sattu shake as a whey protein alternative (~₹80-100/kg)

---

## 🧠 Mind Plan Overview

1-hour daily routine split into 4 blocks:

| Block | Duration | Activity |
|---|---|---|
| 📖 Reading | 20 min | Rotating: Knowledge → EQ → IQ → Free choice |
| 🧩 Brain Training | 15 min | Chess (Lichess), Sudoku, mental math |
| 📝 Journaling | 15 min | 3 daily prompts + weekly reflection |
| 🧘 Meditation | 10 min | Guided (Medito app) → silent sitting |

---

## 🎯 How Streaks Work

1. Each category (Workout, Diet, Mind) has **4 daily tasks**
2. Complete all 4 tasks → **streak increments by 1**
3. Miss a day → **streak resets to 0**
4. Complete all 3 categories in one day → **Perfect Day earned**
5. Your **Best Streak** is always tracked so you have a record to beat

---

## 🛠️ Customization

Everything lives in a single file (`src/App.jsx`). To customize:

- **Change exercises** → Edit the `WORKOUT_PLAN` object
- **Modify meals** → Edit the `DIET_PLAN` object
- **Update mind activities** → Edit the `MIND_PLAN` object
- **Change daily tasks** → Edit the `DAILY_TASKS` object
- **Adjust colors** → Edit the `COLORS` object

---

## 🌐 Deployment

This app is deployed on **Vercel** with automatic CI/CD from GitHub.

Every push to `main` branch triggers an automatic redeployment.

### Deploy Your Own

1. Fork this repository
2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
3. Import the forked repo → Click Deploy
4. Done — you get a free `.vercel.app` URL

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Acknowledgments

- Plan generated with the help of **Claude AI** by Anthropic
- Inspired by Duolingo's streak psychology
- Diet plan optimized for Bihar/Eastern India food availability and pricing

---

<p align="center">
  <b>The best time to start was yesterday. The second best time is now. 🔥</b>
</p>
