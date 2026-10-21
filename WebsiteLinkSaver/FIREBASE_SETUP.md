# Firebase Setup Instructions

## Quick Start

### 1. Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., "website-link-saver")
4. Create project

### 2. Enable Firestore

1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location → Enable

### 3. Get Configuration

1. Project Settings (⚙️ icon)
2. Your apps → Web icon `</>`
3. Register app
4. Copy the config values

### 4. Create `.env` File

Create a file named `.env` in the WebsiteLinkSaver folder:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

Replace the placeholder values with your actual Firebase config values.

### 5. Start the App

```bash
cd WebsiteLinkSaver
pnpm dev
```

Open http://localhost:5173

## Important Notes

- ⚠️ Never commit `.env` file to git
- ✅ `.env` is already in `.gitignore`
- 🔥 Firestore Test Mode allows all access (good for development)
- 🔒 For production, update security rules

## Security Rules for Production

In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /websites/{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Add auth later
    }
  }
}
```

---

That's it! Your app should now work with Firebase. 🎉
