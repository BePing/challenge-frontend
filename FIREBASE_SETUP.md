# Firebase Setup Guide

This application uses Firebase Firestore for data storage. Follow these steps to set up Firebase.

## Prerequisites

- A Firebase project (create one at https://console.firebase.google.com/)
- Firebase Firestore database enabled in your project

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database:
   - Go to Firestore Database in the Firebase Console
   - Click "Create database"
   - Start in production mode (or test mode for development)
   - Choose a location for your database

### 2. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app and copy the configuration values

### 3. Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration values in `.env`:
   ```env
   FIREBASE_API_KEY=your-api-key-here
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789012
   FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

### 4. Configure Firestore Security Rules

In Firebase Console, go to Firestore Database → Rules and set up rules that allow read access to your championship collections.

**Option 1: Copy from firestore.rules file**

We've included a `firestore.rules` file in the project root with the exact rules needed. Copy the contents of this file into your Firebase Console.

**Option 2: Use these rules directly**

Go to Firebase Console → Firestore Database → Rules tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Computation Metadata - Allow public read access (both document reads and queries)
    match /computation-metadata/{document} {
      allow read: if true;
      allow write: if false;
    }
    match /computation-metadata {
      allow list: if true; // Allow collection queries
    }
    
    // Region Summaries - Allow public read access (both document reads and queries)
    match /region-summaries/{document} {
      allow read: if true;
      allow write: if false;
    }
    match /region-summaries {
      allow list: if true; // Allow collection queries
    }
    
    // Rankings - Allow public read access (both document reads and queries)
    match /rankings/{document} {
      allow read: if true;
      allow write: if false;
    }
    match /rankings {
      allow list: if true; // Allow collection queries
    }
    
    // Player Points Details - Allow public read access (both document reads and queries)
    match /players-points-details/{document} {
      allow read: if true;
      allow write: if false;
    }
    match /players-points-details {
      allow list: if true; // Allow collection queries
    }
    
    // Tops (Legacy hierarchical structure) - Allow public read access
    match /tops/{document} {
      allow read: if true;
      allow write: if false;
    }
    match /tops {
      allow list: if true; // Allow collection queries
    }
    
    // Deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Important Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`top-6-653f6`)
3. Go to **Firestore Database** → **Rules** tab
4. Paste the rules above
5. Click **Publish**

**Note**: 
- These rules allow **public read access** to championship data collections
- **Write access is disabled** - all writes should be done server-side using Firebase Admin SDK
- For production, you may want to add rate limiting or other restrictions

### 5. Create Firestore Indexes

The application requires composite indexes for efficient queries. Firestore will prompt you to create indexes when you first run queries.

**Required Index for Rankings Queries:**

When you first run a rankings query, Firestore will automatically detect the missing index and show a link in the browser console. **Click that link** to create the index automatically.

Alternatively, create it manually in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project
2. Navigate to **Firestore Database** → **Indexes** tab
3. Click **Create Index**
4. Configure the index:
   - **Collection ID**: `rankings`
   - **Fields to index** (add in this exact order):
     1. `level` (Ascending)
     2. `region` (Ascending)
     3. `weekName` (Ascending)
     4. `position` (Ascending)
5. Click **Create**

**Note**: Index creation can take a few minutes. You'll see a "Building" status, and you'll get an email when it's ready.

**Optional Indexes:**
- `computation-metadata` collection with `timestamp` field (descending) for latest metadata queries

### 6. Data Structure

The application expects the following Firestore collections:

1. **`computation-metadata`** - System metadata
   - Document ID: `week-{weekNumber}`
   
2. **`region-summaries`** - Region overview data
   - Document ID: `{region}-week-{weekNumber}`
   
3. **`rankings`** - Player rankings
   - Document ID: `{weekName}-{region}-{level}-{uniqueIndex}` (sanitized)
   
4. **`players-points-details`** - Detailed player statistics
   - Document ID: `{uniqueIndex}`
   
5. **`tops`** - Legacy hierarchical structure (optional)

See `NUXT_DATA_STRUCTURE_GUIDE.md` for detailed data structure documentation.

## Testing the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for any Firebase errors

3. Verify Firestore connection by:
   - Opening the application
   - Navigating to a region page
   - Checking if data loads (or if you see appropriate error messages)

## Troubleshooting

### Firebase Not Initialized Error
- Check that `.env` file exists and contains all required values
- Verify environment variables are correctly named (no typos)
- Restart the dev server after changing `.env` file

### Index Missing Error
- Click the link provided in the browser console to create the index
- Or manually create the index in Firebase Console → Firestore → Indexes

### Permission Denied Error
- Check Firestore security rules
- Ensure read access is allowed for the collections being queried

### No Data Showing
- Verify data exists in Firestore collections
- Check browser console for specific error messages
- Verify collection and document ID patterns match the expected format

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Update Firestore security rules for production security
3. Monitor Firebase usage and costs in Firebase Console
4. Enable Firestore offline persistence is already configured in the plugin

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Nuxt Firebase Integration](https://nuxt.com/modules)
- See `NUXT_DATA_STRUCTURE_GUIDE.md` for detailed data structure and query patterns

