# Manual Firebase Setup (No CLI Required)

Since you're in a dev container, here's how to set up Firebase using the web console only.

## Step 1: Enable Authentication (2 minutes)

1. Go to: https://console.firebase.google.com/project/gymverse-fd8d7/authentication/providers
2. Click **"Email/Password"**
3. Toggle **"Enable"** to ON
4. Click **"Save"**

✅ Done!

## Step 2: Create Firestore Database (3 minutes)

1. Go to: https://console.firebase.google.com/project/gymverse-fd8d7/firestore
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose location: **"us-central1"** (or closest to you)
5. Click **"Enable"**

### Add Firestore Rules:

1. Click on **"Rules"** tab
2. Replace the content with this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User's workout history
      match /history/{historyId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **"Publish"**

✅ Done!

## Step 3: Create Storage Bucket (3 minutes)

1. Go to: https://console.firebase.google.com/project/gymverse-fd8d7/storage
2. Click **"Get started"**
3. Accept the default rules (we'll update them)
4. Choose location: **"us-central1"** (same as Firestore)
5. Click **"Done"**

### Add Storage Rules:

1. Click on **"Rules"** tab
2. Replace the content with this:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Master workout library - read-only for authenticated users
    match /master/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    
    // User uploaded content (future use)
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

✅ Done!

## Step 4: Upload Workout Library (2 minutes)

1. In Storage, click **"Upload file"**
2. First, create a folder called **"master"**
3. Open the **"master"** folder
4. Upload the file: `/workspaces/gymverse/assets/workouts.json`
5. Verify the path is: **`master/workouts.json`**

✅ Done!

## Step 5: Verify Everything Works

### Check Authentication:
- Go to Authentication → Users
- Should be empty (users will appear when they sign up)

### Check Firestore:
- Go to Firestore → Data
- Should be empty initially
- A `users` collection will appear after first signup

### Check Storage:
- Go to Storage → Files
- Should see: `master/workouts.json` (2.1 KB)

## 🎉 Firebase Setup Complete!

Now you can build and run the app:

### For Development (in dev container):

Since you don't have iOS/Android simulators in the dev container, you'll need to:

**Option 1: Build on your local machine**
1. Clone the repo to your Mac
2. Run: `cd ios && pod install && cd ..`
3. Run: `npx react-native run-ios`

**Option 2: Use Expo (if you want to test quickly)**
- Convert to Expo Go for testing
- Or use EAS Build for cloud builds

### For iOS (on macOS):
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

### For Android (anywhere):
```bash
npx react-native run-android
```

## 📊 Verify Firebase Project Info

- **Project ID**: `gymverse-fd8d7`
- **Bundle ID**: `com.rakeshbade.vyam`
- **Storage Bucket**: `gymverse-fd8d7.firebasestorage.app`

## 🔍 Testing Checklist

After launching the app:

- [ ] Splash screen appears
- [ ] Can navigate to Sign Up
- [ ] Can create account with email/password
- [ ] Can complete profile setup
- [ ] Home screen shows loading indicator
- [ ] Workouts appear on Home screen (loaded from Storage)
- [ ] Can tap a workout to see details
- [ ] Can start a workout
- [ ] Can view favorites and history tabs

## 🐛 If workouts don't load:

1. Check browser console in Firebase Storage
2. Verify `master/workouts.json` exists
3. Check Storage rules allow authenticated reads
4. Check app logs for errors
5. Verify user is authenticated before loading workouts

## 💡 Quick Links

- **Firebase Console**: https://console.firebase.google.com/project/gymverse-fd8d7
- **Authentication**: https://console.firebase.google.com/project/gymverse-fd8d7/authentication
- **Firestore**: https://console.firebase.google.com/project/gymverse-fd8d7/firestore
- **Storage**: https://console.firebase.google.com/project/gymverse-fd8d7/storage

---

✅ **No Firebase CLI required!** Everything can be done through the web console.
