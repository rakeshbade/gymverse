# 🚀 VyaM - Next Steps Guide

Congratulations! Your Firebase configuration files are now in place. Here's what you need to do next to get VyaM running.

## ✅ Completed

- [x] Firebase project created (`gymverse-fd8d7`)
- [x] Firebase config files added to project
  - [x] `ios/GoogleService-Info.plist`
  - [x] `android/app/google-services.json`
- [x] Bundle ID configured: `com.rakeshbade.vyam`

## 📋 Required Firebase Console Setup

Before building the app, complete these steps in the [Firebase Console](https://console.firebase.google.com/project/gymverse-fd8d7):

### 1. Enable Authentication (5 minutes)

1. Go to **Authentication** → **Sign-in method**
   - https://console.firebase.google.com/project/gymverse-fd8d7/authentication/providers
2. Click **Email/Password**
3. Toggle **Enable**
4. Click **Save**

### 2. Create Firestore Database (5 minutes)

1. Go to **Firestore Database**
   - https://console.firebase.google.com/project/gymverse-fd8d7/firestore
2. Click **Create database**
3. Select **Start in production mode**
4. Choose location: **us-central1** (or closest to your users)
5. Click **Enable**

### 3. Create Storage Bucket (3 minutes)

1. Go to **Storage**
   - https://console.firebase.google.com/project/gymverse-fd8d7/storage
2. Click **Get started**
3. Accept security rules (we'll update them next)
4. Choose location: **us-central1** (same as Firestore)
5. Click **Done**

### 4. Deploy Security Rules (2 minutes)

**Option A: Using Firebase CLI (Recommended)**

```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Storage  
# - Realtime Database
# - Use existing project: gymverse-fd8d7

# Deploy rules
firebase deploy --only firestore:rules,storage
```

**Option B: Manual Setup**

Copy rules from `firestore.rules` and `storage.rules` files to Firebase Console.

### 5. Upload Workout Library (2 minutes)

**Option A: Using Firebase CLI**

```bash
# Upload workouts.json to Storage
firebase storage:upload assets/workouts.json master/workouts.json
```

**Option B: Using Firebase Console**

1. Go to Storage in Firebase Console
2. Create folder: `master`
3. Upload `assets/workouts.json` to `master/` folder
4. Make sure the path is: `master/workouts.json`

## 🏗️ Build the App

### For iOS (macOS only)

```bash
# Install CocoaPods dependencies
cd ios
pod install
cd ..

# Run on iOS simulator
npx react-native run-ios

# Or for physical device
npx react-native run-ios --device "Your iPhone Name"
```

**Note**: You'll need:
- macOS with Xcode 14+
- iOS Simulator or physical iOS device
- Apple Developer account (for device testing)

### For Android

```bash
# Make sure Android SDK is installed and configured
# ANDROID_HOME should be set

# Run on Android emulator or device
npx react-native run-android
```

**Note**: You'll need:
- Android Studio with SDK 33+
- Android emulator or physical device
- USB debugging enabled (for device)

## 🐛 Troubleshooting

### Firebase modules not found

If you get errors about `@react-native-firebase/app`:

```bash
# Clean and reinstall
rm -rf node_modules
npm install

# For iOS
cd ios && pod install && cd ..
```

### Build errors on iOS

```bash
# Clean build
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Clean Xcode cache
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### Build errors on Android

```bash
# Clean Gradle cache
cd android
./gradlew clean
cd ..

# Restart Metro bundler
npx react-native start --reset-cache
```

### Firebase Authentication errors

Make sure:
1. Email/Password is enabled in Firebase Console
2. You're using valid email format
3. Password is at least 6 characters

### Storage errors (workouts not loading)

Make sure:
1. `workouts.json` is uploaded to `master/workouts.json` path
2. Storage rules allow authenticated users to read
3. Bundle ID matches Firebase project

## 📱 Testing the App

### Test Authentication Flow

1. Launch app → Should show Splash screen
2. Tap **Sign Up**
3. Enter email, password
4. Complete profile setup (age, weight, height, etc.)
5. Should navigate to Home screen

### Test Workout Features

1. Browse workouts on Home screen
2. Tap a workout → See details
3. Tap **Start Workout** → Active workout session
4. Complete or quit workout
5. Check History tab → See workout log

### Test Other Features

- **Search**: Search for workouts by name/exercise
- **Favorites**: Toggle favorite on workouts
- **Account**: View profile, sign out

## 🔐 Production Checklist

Before releasing to app stores:

- [ ] Test on real iOS device
- [ ] Test on real Android device
- [ ] Upload real workout images to Storage
- [ ] Configure donation link (Buy Me a Coffee)
- [ ] Review privacy policy and terms of service
- [ ] Test all error scenarios
- [ ] Enable Firebase Analytics (optional)
- [ ] Set up crash reporting
- [ ] Configure app icons and splash screen
- [ ] Test offline behavior
- [ ] Verify calorie calculations
- [ ] Test with multiple user accounts

## 📊 Firebase Free Tier Limits

Your current setup should stay within free tier:

| Service | Free Tier | Expected Usage |
|---------|-----------|----------------|
| Authentication | Unlimited | ✅ Safe |
| Firestore Reads | 50K/day | ~5K/day ✅ |
| Storage Download | 1GB/day | ~300MB/day ✅ |
| Realtime Database | 100 simultaneous | Not used ✅ |

**Storage-first architecture** ensures minimal costs!

## 📚 Additional Resources

- [Firebase Setup Guide](FIREBASE_SETUP.md) - Detailed Firebase configuration
- [Deployment Guide](DEPLOYMENT.md) - App Store submission guides
- [Test Report](TEST_REPORT.md) - Validation results
- [Privacy Policy](PRIVACY_POLICY.md) - Required for app stores
- [Terms of Service](TERMS_OF_SERVICE.md) - Legal terms

## 💡 Quick Commands Reference

```bash
# Start Metro bundler
npm start

# Run iOS
npx react-native run-ios

# Run Android
npx react-native run-android

# Deploy Firebase rules
firebase deploy --only firestore:rules,storage

# Upload workouts
firebase storage:upload assets/workouts.json master/workouts.json

# Clean build
npm run clean  # (if configured)
```

## 🆘 Need Help?

If you encounter issues:

1. Check [TEST_REPORT.md](TEST_REPORT.md) for known limitations
2. Review [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed steps
3. Check Firebase Console for errors
4. Verify all configuration files are in place
5. Ensure bundle IDs match across all configs

---

**Firebase Project**: `gymverse-fd8d7`  
**Bundle ID**: `com.rakeshbade.vyam`  
**Storage Bucket**: `gymverse-fd8d7.firebasestorage.app`

🎉 **You're almost ready to run VyaM!** Complete the Firebase Console setup and build the app.
