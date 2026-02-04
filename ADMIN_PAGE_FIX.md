# Admin Page Not Showing Data - Quick Fix

## The Problem
You submitted data successfully, but the `/admin` page isn't showing it.

## Most Likely Cause
The Firestore security rules need to allow **read** access (not just write).

## Solution

### Update Firestore Rules (IMPORTANT)

1. Go to: https://console.firebase.google.com/project/fisrtproject-71d3a/firestore/rules

2. Make sure the rules look EXACTLY like this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /valentine-submissions/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Key point**: It must say `allow read, write` (not just `allow write`)

3. Click **Publish**

4. Wait 10-20 seconds for rules to propagate

### Test the Admin Page

1. Go to: http://localhost:3000/admin
2. Open browser console (F12 or Cmd+Option+I)
3. Look for:
   - "Fetching users from Firestore..."
   - "Fetched users: [...]"
4. If you see an error, copy it and share it

### Verify Data in Firebase Console

1. Go to: https://console.firebase.google.com/project/fisrtproject-71d3a/firestore/data
2. You should see a collection called `valentine-submissions`
3. Click on it to see your submitted data
4. If you see data there but not on `/admin`, it's definitely a rules issue

### Still Not Working?

Check browser console for errors and let me know what you see!
