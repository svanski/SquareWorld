# Firebase Deployment Setup

This guide will help you set up automatic deployment to Firebase using GitHub Actions.

## Prerequisites

1. **Firebase Project**: Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. **Firebase CLI**: Install the Firebase CLI globally
   ```bash
   npm install -g firebase-tools
   ```

## Setup Instructions

### 1. Initialize Firebase in your project

```bash
# Login to Firebase
firebase login

# Initialize Firebase (select Hosting)
firebase init hosting
```

When prompted:
- Select "Use an existing project" and choose your Firebase project
- Set the public directory to: `ui/dist`
- Configure as a single-page app: `Yes`
- Set up automatic builds: `No` (we'll use GitHub Actions)

### 2. Update Firebase Configuration

Update the `.firebaserc` file with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

### 3. Set up GitHub Secrets

In your GitHub repository, go to Settings → Secrets and variables → Actions, and add these secrets:

#### Required Secrets:

1. **FIREBASE_SERVICE_ACCOUNT_KEY**
   
   **Method A: Using Google Cloud Console (Recommended)**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your Firebase project
   - Navigate to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name: `github-actions-firebase`
   - Grant role: "Firebase Admin"
   - Click "Done"
   - Click on the created service account
   - Go to "Keys" tab → "Add Key" → "Create new key"
   - Choose "JSON" format and download
   - Copy the entire JSON file content and paste as the secret value

   **Method B: Using Firebase CLI (if available)**
   ```bash
   # Note: This command may not be available in newer Firebase CLI versions
   firebase service:ci
   ```

2. **FIREBASE_PROJECT_ID**
   Your Firebase project ID (same as in `.firebaserc`)

#### Alternative: Using Firebase Token (Legacy)
If you have an older Firebase CLI, you can try:
```bash
firebase login:ci
```
And use the generated token as `FIREBASE_TOKEN` secret instead.

### 4. Test Local Build

Before pushing to GitHub, test the build locally:

```bash
# Install dependencies
npm run install:all

# Build the project
npm run build:ui

# Test Firebase hosting locally
firebase serve
```

### 5. Deploy

Once everything is set up:

1. Push to the `master` or `main` branch to trigger automatic deployment
2. Create a pull request to get a preview deployment

## Workflow Details

The GitHub Actions workflow will:

1. **On Push to master/main**: Deploy to live Firebase hosting
2. **On Pull Request**: Deploy to a preview channel for testing

## Manual Deployment

You can also deploy manually:

```bash
# Build and deploy
npm run build:ui
firebase deploy --only hosting
```

## Troubleshooting

### Common Issues:

1. **Build fails**: Make sure all dependencies are installed and the build works locally
2. **Firebase authentication fails**: Verify your service account key is correct
3. **Project ID mismatch**: Ensure `.firebaserc` and the secret match your Firebase project

### Useful Commands:

```bash
# Check Firebase projects
firebase projects:list

# Check current project
firebase use

# Switch projects
firebase use your-project-id

# View deployment history
firebase hosting:releases
```

## Environment Variables

If your app needs environment variables for production:

1. Add them to GitHub Secrets
2. Update the workflow to inject them during build:

```yaml
- name: Build UI
  env:
    VITE_API_URL: ${{ secrets.API_URL }}
  run: |
    cd ui
    npm run build
```

## Support

For issues with Firebase deployment, check:
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Actions for Firebase](https://github.com/FirebaseExtended/action-hosting-deploy)
