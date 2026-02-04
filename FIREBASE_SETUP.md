# Firebase Security Rules Setup

## Step 1: Enable Firebase Storage

⚠️ **IMPORTANT**: You must enable Storage first!

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `fisrtproject-71d3a`
3. Click **Storage** in the left sidebar
4. Click **Get Started**
5. Choose **Start in production mode** (we'll add rules next)
6. Click **Next** and **Done**

## Step 2: Enable Firestore Database

1. In Firebase Console, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode**
4. Select your preferred location
5. Click **Enable**

## Step 3: Configure Storage Rules

Go to Firebase Console → Storage → Rules tab and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read and write photos
    match /valentine-photos/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

Click **Publish** to save the rules.

## Step 4: Configure Firestore Rules

Go to Firebase Console → Firestore Database → Rules tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read and write to valentine-submissions
    match /valentine-submissions/{document=**} {
      allow read, write: if true;
    }
  }
}
```

Click **Publish** to save the rules.

## Troubleshooting CORS Errors

If you see CORS errors:

1. **Verify Storage is enabled** - Check Firebase Console → Storage
2. **Check the bucket name** - Should be `fisrtproject-71d3a.firebasestorage.app`
3. **Restart your dev server** - Stop and run `npm run dev` again
4. **Clear browser cache** - Hard refresh (Cmd+Shift+R on Mac)

### If CORS persists, configure CORS manually:

1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Run these commands:

```bash
# Create cors.json file
echo '[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]' > cors.json

# Apply CORS configuration
gsutil cors set cors.json gs://fisrtproject-71d3a.firebasestorage.app
```

> **Note**: These rules allow public read/write access. For production, you should add authentication and validation rules.

