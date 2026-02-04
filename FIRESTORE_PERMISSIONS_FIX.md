# Quick Fix for Permissions Error

## The Issue
You're getting "Missing or insufficient permissions" because Firestore security rules need to be updated.

## Solution - Update Firestore Rules

### Step 1: Go to Firestore Rules
1. Open: https://console.firebase.google.com/project/fisrtproject-71d3a/firestore/rules
2. You should see the Rules editor

### Step 2: Copy These Exact Rules

**DELETE EVERYTHING** in the rules editor and replace with:

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

### Step 3: Publish
1. Click the **"Publish"** button (top right)
2. Wait for confirmation message

### Step 4: Clear Cache & Test
1. **Hard refresh your browser**: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
2. **Or restart dev server**:
   - Stop the server (Ctrl+C)
   - Run: `npm run dev`
3. Try submitting again

## Verify Rules Are Active

After publishing, check:
1. Go to: https://console.firebase.google.com/project/fisrtproject-71d3a/firestore/rules
2. You should see the rules above
3. Check the "Published" timestamp - should be recent

## Still Not Working?

If you still get the error:
1. Take a screenshot of your Firestore Rules page
2. Check browser console for the exact error message
3. Verify the collection name in the error matches `valentine-submissions`

The rules should look EXACTLY like the code block above - no extra characters or modifications.
