# 🔨 VyaM - Build Instructions

Your Firebase is connected and native projects are set up! Here's how to build VyaM.

## ✅ Setup Complete

- [x] Firebase configuration files in place
- [x] iOS project created and configured
- [x] Android project created and configured
- [x] Bundle ID/Package name: `com.rakeshbade.vyam`
- [x] Pod file updated with Firebase dependencies

## 📱 Building for iOS (macOS Required)

### Prerequisites
- macOS with Xcode 14 or later
- CocoaPods installed (`sudo gem install cocoapods`)

### Build Steps

1. **Install iOS Dependencies**
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. **Run on iOS Simulator**
   ```bash
   npx react-native run-ios
   ```

3. **Run on Physical iPhone** (requires Apple Developer account)
   ```bash
   npx react-native run-ios --device "Your iPhone Name"
   ```

### iOS Troubleshooting

**If pod install fails:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

**If build fails in Xcode:**
1. Open `ios/VyaM.xcworkspace` in Xcode
2. Select your team in Signing & Capabilities
3. Build from Xcode (Cmd+B)

## 🤖 Building for Android

### Prerequisites
- Android Studio with SDK 33 or later
- ANDROID_HOME environment variable set
- JDK 11 or later

### Build Steps

1. **Start Metro Bundler**
   ```bash
   npx react-native start
   ```

2. **In a new terminal, run Android**
   ```bash
   npx react-native run-android
   ```

### Android Troubleshooting

**If Gradle sync fails:**
```bash
cd android
./gradlew clean
cd ..
npx react-native start --reset-cache
```

**If build fails:**
1. Open `android/` folder in Android Studio
2. Let Gradle sync complete
3. Build → Make Project

**Environment setup:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 🚀 Development Workflow

### Start Development

```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run iOS
npx react-native run-ios

# OR Terminal 2: Run Android
npx react-native run-android
```

### Common Commands

```bash
# Clean everything and start fresh
npm run clean  # if script exists
rm -rf node_modules ios/Pods
npm install
cd ios && pod install && cd ..

# Reset Metro cache
npx react-native start --reset-cache

# View logs
npx react-native log-ios
npx react-native log-android
```

## 🧪 Testing the App

### First Launch Checklist

1. **Launch App**
   - Should see VyaM splash screen
   - Transitions to Login/Signup

2. **Create Account**
   - Tap "Sign Up"
   - Enter valid email and password (6+ chars)
   - Should proceed to Profile Setup

3. **Complete Profile**
   - Enter: Name, Age (13-99), Weight (30-250kg), Height (100-250cm)
   - Select Gender, Goal, Level
   - Tap "Complete Profile"

4. **Verify Home Screen**
   - Should see "Browse Workouts" title
   - Should see loading indicator briefly
   - Should see 8 workouts loaded from Firebase Storage
   - Filter buttons work (All/Easy/Medium/Heavy)

5. **Test Workout Flow**
   - Tap a workout → See details
   - Tap "Start Workout" → Active workout screen
   - Timer should count up
   - "Next Exercise" progresses through exercises
   - "Complete Workout" saves to Firestore History

6. **Test Features**
   - **Search**: Find workouts by name/exercise
   - **Favorites**: Star icon toggles favorite
   - **History**: View completed workouts
   - **Account**: See profile, sign out

## ⚠️ Dev Container Limitations

Since you're in a dev container (Linux), you **cannot** build iOS apps directly. You have two options:

### Option 1: Build on Local Mac

1. Clone repo to your Mac:
   ```bash
   git clone https://github.com/rakeshbade/gymverse.git
   cd gymverse
   npm install
   cd ios && pod install && cd ..
   npx react-native run-ios
   ```

### Option 2: Use EAS Build (Expo Cloud Build)

Even though this is a bare React Native app, you can use EAS Build:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login and configure:
   ```bash
   eas login
   eas build:configure
   ```

3. Build for iOS/Android in the cloud:
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

## 📊 Firebase Verification

Before testing, ensure Firebase is fully configured:

1. **Authentication**
   - ✅ Email/Password enabled
   - Check: https://console.firebase.google.com/project/gymverse-fd8d7/authentication/providers

2. **Firestore**
   - ✅ Database created
   - ✅ Security rules deployed
   - Check: https://console.firebase.google.com/project/gymverse-fd8d7/firestore

3. **Storage**
   - ✅ Bucket created
   - ✅ `master/workouts.json` uploaded (2.1 KB)
   - ✅ Security rules deployed
   - Check: https://console.firebase.google.com/project/gymverse-fd8d7/storage

## 🔍 Debugging

### Check React Native logs
```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

### Check Firebase errors
1. Enable debug logging in app
2. Check Firebase Console → Functions/Firestore/Storage logs
3. Verify security rules aren't blocking requests

### Common Issues

**"Cannot find module '@react-native-firebase/app'"**
- Run: `npm install`
- iOS: `cd ios && pod install && cd ..`
- Rebuild app

**Workouts not loading**
- Check `master/workouts.json` exists in Firebase Storage
- Verify Storage rules allow authenticated reads
- Check user is signed in before loading

**Authentication errors**
- Verify Email/Password is enabled in Firebase Console
- Check email format and password length (6+ chars)

## 📦 Building for Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- App Store submission (iOS)
- Google Play submission (Android)
- App icons and splash screens
- Privacy policy and terms (required)
- ASO (App Store Optimization)

## 🎯 Next Steps

1. ✅ Build the app on macOS or use EAS Build
2. 📱 Test all features thoroughly
3. 🖼️ Replace placeholder workout images with real images
4. 🎨 Customize app icon and splash screen
5. 📝 Review Privacy Policy and Terms of Service
6. 🚀 Deploy to App Store and Google Play

---

**Project**: VyaM (gymverse)  
**Bundle ID**: com.rakeshbade.vyam  
**Firebase**: gymverse-fd8d7  
**React Native**: 0.73.2  

Need help? Check [NEXT_STEPS.md](NEXT_STEPS.md) or [MANUAL_FIREBASE_SETUP.md](MANUAL_FIREBASE_SETUP.md)
