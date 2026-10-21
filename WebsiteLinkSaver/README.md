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
│   │   └── websiteService.ts  # Firebase CRUD operations
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

1. Click "Add Link" in the navigation
2. Fill in the form:
   - **Website Name** (required): e.g., "GitHub"
   - **Website URL** (required): e.g., "https://github.com"
   - **Image URL** (optional): URL to website logo/image
   - **Category** (optional): e.g., "Development"
   - **Description** (optional): Notes about the website
   - **Add to Favorites**: Check to mark as favorite
3. Click "Save Website"

### Managing Websites

- **Visit**: Click the "Visit" button to open in a new tab
- **Edit**: Click the edit icon to modify details
- **Delete**: Click the trash icon to remove
- **Favorite**: Click the heart icon to toggle favorite status

### Search & Filter

- Use the search bar to find websites by name, URL, category, or description
- Click category tags to filter by specific categories
- Click "All" to clear filters

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
