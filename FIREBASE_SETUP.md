# Firebase Setup Guide for VyaM

This guide will walk you through setting up Firebase for the VyaM application.

## Prerequisites

- A Google account
- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js >= 18

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `vyam-fitness` (or your preferred name)
4. Disable Google Analytics (optional for this app)
5. Click "Create project"

## Step 2: Add iOS App

1. In Firebase Console, click the iOS icon
2. Enter iOS bundle ID: `com.rakeshbade.vyam` (must match [app.json](app.json))
3. Download `GoogleService-Info.plist`
4. Move the file to `ios/` directory
5. Follow the Firebase SDK setup instructions

## Step 3: Add Android App

1. In Firebase Console, click the Android icon
2. Enter Android package name: `com.rakeshbade.vyam` (must match [app.json](app.json))
3. Download `google-services.json`
4. Move the file to `android/app/` directory
5. Follow the Firebase SDK setup instructions

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location (choose closest to your users)
5. Click "Enable"

## Step 6: Deploy Firestore Security Rules

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

The rules are defined in [firestore.rules](firestore.rules):
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /history/{logId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Step 7: Create Storage Bucket

1. In Firebase Console, go to **Storage**
2. Click "Get started"
3. Choose "Start in production mode"
4. Click "Done"

## Step 8: Deploy Storage Security Rules

```bash
# Deploy storage rules
firebase deploy --only storage
```

The rules are defined in [storage.rules](storage.rules):
```javascript
service firebase.storage {
  match /b/{bucket}/o {
    match /master/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    
    match /training/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

## Step 9: Upload Workout Library

1. In Firebase Console, go to **Storage**
2. Click "Upload file"
3. Create a folder named `master`
4. Upload [assets/workouts.json](assets/workouts.json) to `master/workouts.json`

**Important**: The path must be exactly `master/workouts.json`

## Step 10: Set Up Firebase Configuration (Optional)

If you want to use Firebase Emulators for local development:

```bash
# Install emulators
firebase init emulators

# Select:
# - Authentication Emulator
# - Firestore Emulator
# - Storage Emulator

# Start emulators
firebase emulators:start
```

## Step 11: Verify Setup

1. Run the app: `npx react-native run-ios` or `npx react-native run-android`
2. Try to sign up with a test email
3. Check Firebase Console:
   - **Authentication** should show the new user
   - **Firestore** should show a document in `users/{uid}`
4. Complete profile setup
5. Browse workouts to verify Storage is working

## Firestore Data Structure

```
users/
  {userId}/
    email: string
    name: string
    gender: string
    age: number
    weight: number
    height: number
    goal: string
    level: string
    favorites: array
    createdAt: timestamp
    
    history/
      {logId}/
        workoutId: string
        workoutTitle: string
        date: timestamp
        duration_min: number
        caloriesBurned: number
        completedExercises: number
        totalExercises: number
```

## Storage Structure

```
master/
  workouts.json          # Master workout library

training/                # Optional: Workout images
  power_blast.webp
  morning_energizer.webp
  ...
```

## Cost Optimization Tips

### Free Tier Limits (Spark Plan)

- **Authentication**: Unlimited
- **Firestore**: 
  - 50K reads/day
  - 20K writes/day
  - 1 GB storage
- **Storage**: 5 GB
- **Downloads**: 1 GB/day

### Staying Within Free Tier

1. **Use Storage for Heavy Data**: The `workouts.json` is stored in Storage and cached locally, minimizing Firestore reads

2. **Cache Workout Library**: The app caches workouts for 24 hours, reducing Storage downloads

3. **Minimal Firestore Writes**: Only write to Firestore for:
   - User profile creation/updates
   - Workout completion logs
   - Favorites changes

4. **Optimize Images**: Use WebP format and CDN URLs (like Unsplash) for workout images instead of Firebase Storage

## Troubleshooting

### iOS Build Issues

If you get build errors after adding Firebase:

```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

### Android Build Issues

Ensure your `android/build.gradle` includes:

```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
}
```

And `android/app/build.gradle` includes:

```gradle
apply plugin: 'com.google.gms.google-services'
```

### Storage CORS Issues

If you encounter CORS errors when fetching from Storage, add CORS configuration:

Create `cors.json`:
```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

Apply it:
```bash
gsutil cors set cors.json gs://your-bucket-name.appspot.com
```

## Security Checklist

- ✅ Firestore rules restrict access to user's own data
- ✅ Storage rules make workout library read-only
- ✅ Authentication required for all data access
- ✅ No sensitive API keys in client code
- ✅ `google-services.json` and `GoogleService-Info.plist` in `.gitignore`

## Next Steps

1. Test all app features with Firebase
2. Monitor usage in Firebase Console
3. Set up backup strategy for user data
4. Configure Firebase App Check for additional security (optional)
5. Set up Cloud Functions for advanced features (optional)

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)
- [Firebase Pricing](https://firebase.google.com/pricing)

---

**Need Help?** Open an issue on [GitHub](https://github.com/rakeshbade/gymverse/issues)
