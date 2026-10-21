# Setup Guide - Website Link Saver

Follow these steps to set up your Website Link Saver app with Firebase.

## Step 1: Firebase Project Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "website-link-saver")
4. Accept terms and click "Continue"
5. (Optional) Enable Google Analytics
6. Click "Create project"

### Enable Firestore Database

1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose closest to you)
5. Click "Enable"

### Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>` to add a web app
5. Enter app nickname (e.g., "Website Link Saver Web")
6. Click "Register app"
7. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123...",
};
```

## Step 2: Configure Environment Variables

1. In the `WebsiteLinkSaver` folder, create a new file named `.env`
2. Copy the contents from `.env.template`
3. Fill in your Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
```

⚠️ **Important**: Never commit the `.env` file to version control!

## Step 3: Install Dependencies

If not already done, install the project dependencies:

```bash
pnpm install
```

Or with npm:

```bash
npm install
```

## Step 4: Start Development Server

```bash
pnpm dev
```

Or with npm:

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`

## Step 5: Test the Application

1. Open `http://localhost:5173` in your browser
2. Click "Add Link" to create your first website link
3. Fill in the form and click "Save Website"
4. You should see your link appear on the home page!

## Firestore Security Rules (Optional)

For development, Firebase Test Mode allows all reads/writes. For production, update your security rules:

1. Go to Firestore Database in Firebase Console
2. Click "Rules" tab
3. Update the rules:

### Development Rules (Current - Test Mode)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Production Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /websites/{websiteId} {
      // Allow anyone to read
      allow read: if true;
      // Only authenticated users can write
      allow write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### "Failed to load websites" Error

**Problem**: Can't connect to Firebase

**Solutions**:

- Check that `.env` file exists and has correct values
- Verify Firebase project is created
- Ensure Firestore is enabled
- Check browser console for detailed error messages
- Make sure you restarted the dev server after creating `.env`

### Module Not Found Errors

**Problem**: Missing dependencies

**Solution**:

```bash
pnpm install
# or
npm install
```

### Port Already in Use

**Problem**: Port 5173 is occupied

**Solution**:

- Stop other Vite/dev servers
- Or change port in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // or any other available port
  },
});
```

### TypeScript Errors

**Problem**: Type errors in IDE

**Solution**:

- Restart your IDE/editor
- Check that `tsconfig.json` is properly configured
- Run `pnpm dev` to see actual errors

## Next Steps

Once your app is working:

1. ✅ Add some website links
2. ✅ Try searching and filtering
3. ✅ Mark favorites
4. ✅ Test on mobile devices
5. 📚 Read the main `README.md` for deployment instructions

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Need Help?

If you're stuck:

1. Check the browser console for errors
2. Check Firebase Console for database activity
3. Verify all environment variables are set correctly
4. Make sure Firestore is enabled in Firebase Console
5. Try creating a new test document directly in Firebase Console

---

Happy coding! 🚀
