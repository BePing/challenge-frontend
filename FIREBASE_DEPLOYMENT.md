# Firebase Hosting Deployment Guide

This guide will help you deploy your Nuxt.js application to Firebase Hosting.

## Prerequisites

1. **Firebase CLI**: Install Firebase CLI globally if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Verify Firebase Project**:
   - Make sure `.firebaserc` is configured with your project ID: `top-6-653f6`
   - Verify you have access to this project

## Deployment Options

### Option 1: Static Site Generation (Recommended for better performance)

If you want to generate a static site:

1. **Update `nuxt.config.ts`** to use static generation:
   ```typescript
   export default defineNuxtConfig({
     ssr: false, // Disable SSR for static generation
     nitro: {
       prerender: {
         routes: ['/'] // Add routes you want to prerender
       }
     }
   })
   ```

2. **Update `firebase.json`** for static hosting:
   ```json
   {
     "hosting": {
       "public": ".output/public",
       "ignore": [...],
       "rewrites": [...]
     }
   }
   ```

3. **Build and deploy**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Option 2: Server-Side Rendering (SSR) with Firebase Functions

For SSR deployment:

1. **Install Firebase Functions dependencies** (if not already installed):
   ```bash
   firebase init functions
   ```

2. **Update `firebase.json`** to include functions:
   ```json
   {
     "hosting": {
       "public": ".output/public",
       "rewrites": [
         {
           "source": "**",
           "function": "ssr"
         }
       ]
     },
     "functions": {
       "source": ".output/server",
       "runtime": "nodejs20"
     }
   }
   ```

3. **Build and deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

## Current Configuration

The project is currently configured for **SSR deployment** with:
- `ssr: true` in `nuxt.config.ts`
- `nitro.preset: 'node-server'` for server-side rendering
- Firebase Hosting configured to serve from `.output/public`

## Deployment Steps

### 1. Build the Application

```bash
npm run build
```

This will create the `.output` directory with:
- `.output/public/` - Static assets
- `.output/server/` - Server-side code (if SSR is enabled)

### 2. Test Locally (Optional)

Test the production build locally:
```bash
npm run preview
```

### 3. Deploy to Firebase Hosting

Deploy your application:
```bash
firebase deploy --only hosting
```

Or deploy everything (hosting + functions if configured):
```bash
firebase deploy
```

### 4. Verify Deployment

After deployment, Firebase will provide you with a URL like:
```
https://top-6-653f6.web.app
```

Visit the URL to verify your deployment.

## Environment Variables

Make sure your environment variables are set in Firebase Hosting:

1. **For Static Sites**: Environment variables need to be set at build time. Create a `.env.production` file:
   ```env
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=top-6-653f6.firebaseapp.com
   FIREBASE_PROJECT_ID=top-6-653f6
   FIREBASE_STORAGE_BUCKET=top-6-653f6.appspot.com
   FIREBASE_MESSaging_SENDER_ID=153442619556
   FIREBASE_APP_ID=1:153442619556:web:1104ef01b6126a3a899631
   ```

2. **For SSR with Functions**: Set environment variables in Firebase Functions:
   ```bash
   firebase functions:config:set firebase.api_key="your-api-key"
   firebase functions:config:set firebase.project_id="top-6-653f6"
   # ... etc
   ```

## CI/CD Setup (Optional)

You can automate deployments using GitHub Actions:

1. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to Firebase
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '20'
         - run: npm ci
         - run: npm run build
         - uses: FirebaseExtended/action-hosting-deploy@v0
           with:
             repoToken: '${{ secrets.GITHUB_TOKEN }}'
             firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
             channelId: live
             projectId: top-6-653f6
   ```

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm ci`
- Verify Node.js version matches (should be 18+)
- Check for TypeScript errors: `npm run typecheck`

### Deployment Fails
- Verify Firebase CLI is logged in: `firebase login`
- Check project ID in `.firebaserc` matches your Firebase project
- Ensure you have proper permissions for the Firebase project

### Environment Variables Not Working
- For static sites, ensure `.env.production` exists and is loaded during build
- For SSR, set environment variables in Firebase Functions config
- Verify `runtimeConfig` in `nuxt.config.ts` is correctly configured

### Site Shows 404 Errors
- Check that `firebase.json` rewrites are correctly configured
- Verify the build output directory matches the `public` field in `firebase.json`
- For dynamic routes, ensure they're either prerendered or handled by SSR

## Quick Deploy Commands

```bash
# Build and deploy
npm run build && firebase deploy --only hosting

# Deploy with message
firebase deploy --only hosting -m "Deploy version X.Y.Z"

# Preview deployment without deploying
firebase hosting:channel:deploy preview
```

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Nuxt.js Deployment Guide](https://nuxt.com/docs/getting-started/deployment)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
