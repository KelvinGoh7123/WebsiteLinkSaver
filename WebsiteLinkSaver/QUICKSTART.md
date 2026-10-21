# 🚀 Quick Start Guide

## Prerequisites

- Node.js installed (v16+)
- pnpm installed (or npm/yarn)
- Firebase account (free)

## Setup in 5 Minutes

### Step 1️⃣: Firebase Setup (2 min)

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Firestore Database (Start in test mode)
4. Get your web app config (Project Settings → Your apps)

### Step 2️⃣: Configure Environment (1 min)

Create `.env` file in the `WebsiteLinkSaver` folder:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3️⃣: Start the App (2 min)

```bash
cd WebsiteLinkSaver
pnpm install    # Already done!
pnpm dev        # Start server
```

Open http://localhost:5173 🎉

## What You Get

✨ **Features:**

- Add/Edit/Delete website links
- Search & filter by category
- Favorites system
- Beautiful responsive UI
- Cloud sync with Firebase

📁 **Well-Organized Structure:**

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages
├── services/      # Firebase integration
├── config/        # Firebase config
├── types/         # TypeScript types
└── App.tsx        # Main app with routing
```

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build
```

## Troubleshooting

**Can't connect to Firebase?**

- Check `.env` file exists and has correct values
- Restart dev server after creating `.env`
- Verify Firestore is enabled in Firebase Console

**Need detailed help?**

- See `SETUP.md` for complete setup guide
- See `FIREBASE_SETUP.md` for Firebase instructions
- See `README.md` for full documentation

---

Happy coding! 💻✨
