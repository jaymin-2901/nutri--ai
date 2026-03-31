# 🥗 NutriSense AI — Intelligent Food Decision Engine

> Not a food tracker. An AI-powered decision engine that helps you make better daily eating choices.

![NutriSense AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- **🤖 AI Meal Analyzer** — Analyze meals via text or photo using Gemini 1.5 Flash
- **⚡ Decision Engine** — Every meal scored 0–100 based on your personal goal
- **🧬 Smart Profile** — BMR/TDEE/protein targets auto-calculated with Mifflin-St Jeor
- **💬 AI Chat Assistant** — Context-aware nutrition coach powered by Gemini
- **📊 Dashboard** — Weekly charts, macro tracking, meal history
- **🔥 Streak System** — Daily usage tracking with animated badges
- **📍 Food Finder** — Google Maps integration + healthy Indian food guide
- **🎬 Demo Mode** — One-click full demo with sample data

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/nutrisense-ai
cd nutrisense-ai
npm install
```

### 2. Get a Free Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

In the app, click **"Set API Key"** and paste your Gemini key.

### 4. Build for Production

```bash
npm run build
npm run preview  # preview production build
```

---

## 🌐 Deploy to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B: GitHub → Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Click **Deploy** — zero configuration needed

> **Note**: No `.env` needed. Users enter their own Gemini API key in the app UI, stored in localStorage.

---

## 🏗 Project Structure

```
nutrisense-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   ├── ApiKeyModal.jsx     # API key setup modal
│   │   │   ├── DecisionCard.jsx    # AI Decision Engine UI
│   │   │   └── MealCard.jsx        # Meal list item
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx         # Desktop navigation
│   │   │   ├── BottomNav.jsx       # Mobile navigation
│   │   │   └── Header.jsx          # Top header
│   │   └── ui/
│   │       ├── Badge.jsx
│   │       ├── CircularProgress.jsx
│   │       ├── MacroBar.jsx
│   │       └── Skeleton.jsx
│   ├── lib/
│   │   ├── gemini.js               # Gemini API integration
│   │   └── utils.js                # Calculations & helpers
│   ├── pages/
│   │   ├── ChatAssistant.jsx       # AI chat interface
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── FoodFinder.jsx          # Food discovery
│   │   ├── HowAIWorks.jsx          # AI explanation page
│   │   ├── MealAnalyzer.jsx        # Core analyzer page
│   │   └── Profile.jsx             # User profile
│   ├── store/
│   │   └── useAppStore.js          # Zustand global store
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🧠 AI Architecture

```
User Input (text/image)
        ↓
Gemini 1.5 Flash API
        ↓
Nutritional Data Extraction
  • Calories, Protein, Carbs, Fat
  • Food item identification
        ↓
User Profile Context
  • BMR → TDEE → Target Calories (Mifflin-St Jeor)
  • Protein needs (1.6–2.2g/kg based on goal)
        ↓
Decision Engine
  • Score 0-100 (goal alignment)
  • Great/Okay/Not Ideal classification
  • AI reason + actionable suggestion
        ↓
Personalized Decision Card
```

---

## 🎨 Design System

- **Fonts**: Syne (display) + DM Sans (body) + JetBrains Mono (data)
- **Colors**: Slate/Zinc palette + Soft green accent (#22c55e)
- **Style**: Glassmorphism cards, 8px grid, soft shadows
- **Motion**: Framer Motion — fade-in, card lift, progress animations
- **Layout**: Sidebar (desktop) + Bottom nav (mobile)

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | Frontend framework |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| Zustand | State management |
| Recharts | Data visualization |
| Gemini 1.5 Flash | AI engine (multimodal) |

---

## 📄 License

MIT © 2024 — Free to use and modify
