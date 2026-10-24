# Website Link Saver - Personal Dashboard

A modern, interactive React web app to store, display, and manage website links with images, categories, and notes. Built with React, TypeScript, Tailwind CSS, and Firebase Firestore.

## Features

✨ **Core Features**

- 📝 Add website links with name, URL, image, category, and description
- 🖼️ Display saved links in beautiful card grid layout
- 🔗 Quick visit websites in new tabs
- 🔍 Search and filter by name, category, URL, or description
- ⭐ Mark websites as favorites for quick access
- ✏️ Edit existing website details
- 🗑️ Delete unwanted links
- 📱 Fully responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Database**: Firebase Firestore (Cloud Database)
- **State Management**: React Hooks

## Project Structure

```
WebsiteLinkSaver/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── LinkCard.tsx    # Website card component
│   │   ├── SearchBar.tsx   # Search input component
│   │   ├── LoadingSpinner.tsx
│   │   └── EditModal.tsx   # Edit website modal
│   ├── pages/              # Application pages
│   │   ├── Home.tsx        # Main dashboard
│   │   ├── AddLink.tsx     # Add new website form
│   │   └── Favorites.tsx   # Favorites page
│   ├── services/           # Business logic
│   │   ├── websiteService.ts  # Firebase CRUD and live updates
│   │   └── imageService.ts    # Image resize before save
│   ├── context/            # Shared app state
│   │   └── WebsiteContext.tsx # One Firestore listener for all pages
│   ├── config/             # Configuration
│   │   └── firebase.ts     # Firebase initialization
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Type definitions
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (or npm/yarn)
- Firebase account

### Installation

1. **Clone the repository**

   ```bash
   cd WebsiteLinkSaver
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up Firebase**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Go to Project Settings > Your apps
   - Create a web app and copy the configuration

4. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Firebase Setup Details

### Firestore Database Structure

```
websites (collection)
├── [document_id]
│   ├── name: string
│   ├── url: string
│   ├── imageUrl: string
│   ├── description: string
│   ├── category: string
│   ├── isFavorite: boolean
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

### Security Rules (recommended for development)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /websites/{document=**} {
      allow read, write: if true; // Change this for production!
    }
  }
}
```

**⚠️ Important**: For production, implement proper authentication and security rules!

## Usage

### Adding a Website

1. On Home, paste a link into **Paste a link** and click **Save link**. The page title and description are filled in for you, and the site icon is used when you do not add a photo. Pick a category chip, or open **Edit name, note, or image** for the optional fields.
2. For a photo upload or favorite mark, click **More options** on Home, or **Add Link** from any other page, and use the full form:
   - **Website Name** (required): filled from the page when the lookup succeeds
   - **Website URL** (required): `github.com` or `https://github.com`. `https://` is added on save if you leave it out
   - **Image** (optional): drag in a photo or paste an image URL. With no image, the site icon is saved
   - **Category** (optional): click an existing category or type a new one. The last category you used stays selected. A name that only differs by capital letters reuses the existing category
   - **Description** (optional): filled from the page when the lookup succeeds
   - **Add to Favorites**: Check to mark as favorite
3. Click "Save Website"

Pasting a link that is already saved shows the existing name instead of creating a second copy. Titles and descriptions come from [Microlink](https://microlink.io). If that lookup is unavailable, the site name is taken from the domain and the icon is still saved.

### Managing Websites

- **Visit**: Click the "Visit" button to open in a new tab
- **Edit**: On a wide screen, move the pointer over a card, then click the edit icon. On a phone, the icon is always visible
- **Delete**: Same as edit, using the trash icon
- **Favorite**: Click the heart icon on the image to toggle favorite status

### Search & Filter

- Use the search bar to find websites by name, URL, category, or description. Category chips sit on the same row and scroll sideways with the full name visible
- Search and category work together, and "All" clears only the category
- The saved count is a small pill beside the page title. A gray "Updating…" note appears beside it while the list refreshes
- Choose **2**, **3**, or **4** at the end of the search row to set how many cards appear on a wide screen. A phone always shows one column. The choice is remembered

## Performance

Saved links used to stay on the loading spinner because each photo was stored as a full Base64 string inside Firestore, and every page waited for a fresh download of the whole collection.

The app now avoids that wait:

- **Smaller images.** Uploaded photos are resized to a thumbnail (max 800×450 JPEG) before they are saved. A normal photo becomes tens of kilobytes instead of close to Firestore’s 1 MB document limit. Pasted image URLs are stored as the URL itself.
- **Existing photos shrink in the background.** Oversized images already in the database are compressed after they load. The first visit can still take a moment; the following visits use the smaller copy.
- **Local cache.** Firestore keeps a copy in the browser. Opening the app again shows the saved list immediately, then refreshes it from the server. A small gray “Updating…” note sits beside the saved-count pill while that refresh is in progress.
- **One shared list.** Home and Favorites listen to the same data. Opening Favorites does not download the collection a second time. The full-page spinner appears only when there is no list to show yet.

## Build for Production

```bash
pnpm build
```

The production-ready files will be in the `dist` directory.

## Deploy

You can deploy this app to:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **Firebase Hosting**: `firebase deploy`

Don't forget to set environment variables in your hosting platform!

## Future Enhancements

- 🔐 User authentication (sign up/login)
- 👥 User profiles and personal collections
- 🏷️ Tags system for better organization
- 📊 Analytics and statistics
- 🎨 Theme customization (dark mode)
- 📤 Import/Export functionality
- 🔄 Sync across devices
- 📱 Progressive Web App (PWA) support

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

If you encounter any issues with Firebase setup, make sure:

1. Firebase project is created
2. Firestore is enabled
3. Environment variables are correctly set
4. Firestore security rules allow read/write access

For more help, check the [Firebase Documentation](https://firebase.google.com/docs).

---

Made with ❤️ using React, TypeScript, and Firebase
