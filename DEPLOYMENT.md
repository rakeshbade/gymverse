# Deployment Guide for VyaM

This guide covers deploying VyaM to both iOS App Store and Google Play Store.

## Prerequisites

- ✅ Completed Firebase setup
- ✅ Apple Developer Account ($99/year for iOS)
- ✅ Google Play Developer Account ($25 one-time for Android)
- ✅ App tested on physical devices
- ✅ All assets and icons prepared

## Pre-Deployment Checklist

### 1. App Assets

- [ ] App icon (1024x1024 px)
- [ ] Splash screen
- [ ] Screenshots for both platforms (multiple device sizes)
- [ ] Feature graphic (1024x500 px for Android)
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] Support email address

### 2. Legal Requirements

- [ ] Privacy Policy reviewed and uploaded
- [ ] Terms of Service reviewed and uploaded
- [ ] Age rating determined (13+ recommended)
- [ ] Content rating questionnaire completed

### 3. App Store Optimization (ASO)

- [ ] App title (max 30 characters)
- [ ] Subtitle/short description
- [ ] Keywords researched
- [ ] Full description written
- [ ] What's New section prepared

---

## iOS Deployment

### Step 1: Configure Xcode Project

1. Open project in Xcode:
```bash
cd ios
open VyaM.xcworkspace  # or VyaM.xcodeproj
```

2. Update **Signing & Capabilities**:
   - Select your development team
   - Ensure bundle identifier is `com.rakeshbade.vyam`
   - Enable automatic signing

3. Update version and build number:
   - Version: `1.0.0`
   - Build: `1`

### Step 2: Configure App Icons

1. Use [App Icon Generator](https://appicon.co/) to create all required sizes
2. Add icons to `ios/VyaM/Images.xcassets/AppIcon.appiconset/`

### Step 3: Build Release Version

```bash
# Clean build folder
cd ios
xcodebuild clean

# Build for release
npx react-native run-ios --configuration Release
```

### Step 4: Archive and Upload

1. In Xcode, select **Product > Archive**
2. Once archived, click **Distribute App**
3. Choose **App Store Connect**
4. Follow the wizard to upload

### Step 5: App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click **My Apps** → **+ New App**
3. Fill in app information:
   - **Name**: VyaM
   - **Primary Language**: English
   - **Bundle ID**: com.rakeshbade.vyam
   - **SKU**: vyam-fitness-001

4. Fill in **App Information**:
   - **Subtitle**: Exercise Your Inner Beast
   - **Category**: Health & Fitness
   - **Privacy Policy URL**: https://yourdomain.com/privacy
   - **Support URL**: https://github.com/rakeshbade/gymverse

5. Upload **Screenshots** for all required device sizes:
   - iPhone 6.7"
   - iPhone 6.5"
   - iPhone 5.5"
   - iPad Pro 12.9"

6. Write **App Description**:
```
VyaM - Exercise Your Inner Beast 🦍

Premium fitness experience. Completely free. Forever ad-free.

FEATURES:
• Comprehensive workout library for all fitness levels
• Real-time workout sessions with timer and rest intervals
• Accurate calorie tracking using MET formula
• Track your progress with detailed workout history
• Save your favorite workouts
• Smart search to find the perfect workout
• Beautiful dark mode interface

WHY VYAM?
✓ 100% Free - No subscriptions, no hidden costs
✓ Ad-Free - Uninterrupted workout experience
✓ Privacy First - Your data belongs to you
✓ Community Supported - Powered by voluntary donations

Start your fitness journey today with VyaM!
```

7. Set **Age Rating**: 4+

8. Fill in **App Review Information**:
   - Test account credentials
   - Review notes (mention donation feature is optional)

9. Set **Pricing**: Free

10. Click **Submit for Review**

### iOS Review Timeline

- Typical: 24-48 hours
- First app: May take longer (up to 7 days)

---

## Android Deployment

### Step 1: Generate Signing Key

```bash
cd android/app

# Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore vyam-release.keystore -alias vyam-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Enter and remember:
# - Keystore password
# - Key password
# - Your details
```

**IMPORTANT**: Backup `vyam-release.keystore` and passwords securely!

### Step 2: Configure Gradle

Edit `android/gradle.properties`:

```properties
MYAPP_RELEASE_STORE_FILE=vyam-release.keystore
MYAPP_RELEASE_KEY_ALIAS=vyam-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

### Step 3: Build APK/AAB

```bash
cd android

# For AAB (recommended for Play Store)
./gradlew bundleRelease

# For APK (for testing)
./gradlew assembleRelease

# Output:
# AAB: android/app/build/outputs/bundle/release/app-release.aab
# APK: android/app/build/outputs/apk/release/app-release.apk
```

### Step 4: Google Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. Click **Create app**
3. Fill in details:
   - **App name**: VyaM
   - **Default language**: English
   - **App/Game**: App
   - **Free/Paid**: Free

4. Complete **Setup** tasks:
   - App access (all features accessible)
   - Ads (No ads)
   - Content rating (Everyone 10+)
   - Target audience (13+)
   - Data safety (follow prompts)

5. Create **Store Listing**:

**Short description** (80 chars):
```
Premium fitness app. Free forever. No ads. Exercise your inner beast! 🦍
```

**Full description** (4000 chars):
```
VyaM - Exercise Your Inner Beast 🦍

Transform your fitness journey with VyaM, the premium workout app that's completely free and forever ad-free. Built for the fitness community, by the fitness community.

🌟 FEATURES

💪 COMPREHENSIVE WORKOUT LIBRARY
Choose from expertly designed workouts for all fitness levels - Easy, Medium, and Heavy. Each workout includes detailed exercises with proper form guidance.

⏱️ REAL-TIME WORKOUT SESSIONS
Active workout mode with built-in timer, rest intervals, and progress tracking. Stay focused and motivated throughout your entire session.

🔥 ACCURATE CALORIE TRACKING
Uses the scientifically-proven MET (Metabolic Equivalent) formula to calculate calories burned based on your personal metrics.

⭐ FAVORITES & HISTORY
Save your favorite workouts and track your progress over time. Review your workout history with detailed statistics.

🔍 SMART SEARCH
Find the perfect workout by searching exercises, names, or descriptions. Filter by intensity level to match your current fitness state.

🎨 BEAUTIFUL DARK MODE
High-contrast neon design optimized for readability in any lighting condition. Easy on the eyes during late-night workouts.

✨ WHY CHOOSE VYAM?

✓ 100% FREE - No subscriptions, trials, or hidden costs. Ever.
✓ AD-FREE - Uninterrupted workout experience. Zero distractions.
✓ PRIVACY FIRST - Your data stays yours. We never sell your information.
✓ OFFLINE READY - Workouts cached locally for offline access.
✓ COMMUNITY SUPPORTED - Sustained by voluntary donations, not ads.

🦍 BUILT DIFFERENTLY

VyaM uses a storage-first architecture to keep costs minimal, ensuring we can provide premium features completely free. Our goal is simple: make fitness accessible to everyone.

📱 PERFECT FOR

• Beginners starting their fitness journey
• Intermediate athletes looking to level up
• Advanced fitness enthusiasts seeking new challenges
• Anyone who wants quality workouts without ads or fees

🎯 WORKOUT TYPES

• Full-body workouts
• Cardio sessions
• Strength training
• Core exercises
• Morning energizers
• HIIT routines

💝 SUPPORT VYAM

Love the app? Support us through voluntary donations via Buy Me a Coffee. Your support helps keep VyaM free and ad-free for everyone.

🔐 PRIVACY & SECURITY

• Secure authentication via Firebase
• Data encrypted in transit and at rest
• Your information never shared or sold
• Full control over your data

📝 BEFORE YOU START

VyaM is a fitness guidance tool. Always consult with your physician before beginning any exercise program, especially if you have pre-existing health conditions.

Download VyaM today and unleash your inner beast! 🦍

---

Premium · Ad-Free · Free Forever
```

6. Upload **Screenshots** (minimum 2, maximum 8 per device type):
   - Phone: 16:9 or 9:16 ratio
   - Tablet: 16:9 or 9:16 ratio

7. Upload **Feature Graphic**: 1024x500 px

8. Set **App Icon**: 512x512 px

9. Set **App Category**: Health & Fitness

10. Provide **Contact Details**:
    - Email
    - Website (GitHub)
    - Privacy Policy URL

### Step 5: Upload AAB

1. Go to **Production** → **Create new release**
2. Upload `app-release.aab`
3. Add **Release notes**:
```
🎉 Welcome to VyaM v1.0.0!

• Comprehensive workout library for all fitness levels
• Real-time workout tracking with timer and rest intervals
• Calorie calculation using MET formula
• Workout history and favorites
• Smart search functionality
• Premium ad-free experience

Made with 💚 for the fitness community.
```

4. Review release
5. **Roll out to production**

### Android Review Timeline

- Typical: Few hours to 2-3 days
- First app: May take up to a week

---

## Post-Deployment

### Monitor Reviews

**iOS**:
- App Store Connect → Ratings and Reviews
- Respond to user feedback

**Android**:
- Google Play Console → Ratings and Reviews
- Reply to reviews

### Track Analytics

Set up Firebase Analytics (optional):

```bash
npm install @react-native-firebase/analytics
```

### Handle Crash Reports

Use Firebase Crashlytics:

```bash
npm install @react-native-firebase/crashlytics
```

### Version Updates

When releasing updates:

1. Update version in:
   - `package.json`
   - `ios/VyaM/Info.plist` (CFBundleShortVersionString)
   - `android/app/build.gradle` (versionName)

2. Increment build number:
   - iOS: CFBundleVersion
   - Android: versionCode

3. Create new release in respective stores

---

## App Store Optimization (ASO)

### Keywords Research

**iOS Keywords** (100 characters total):
```
fitness,workout,exercise,gym,training,health,calories,tracker,free,ad-free
```

**Android** (include in description naturally):
- fitness app
- workout tracker
- exercise planner
- free fitness
- gym workouts
- calorie counter
- workout timer

### Screenshots Best Practices

1. **Showcase key features** in first 2-3 screenshots
2. Use **text overlays** to explain features
3. Show the **beautiful UI** (dark mode, neon accents)
4. Include **before/after stats** (if available)
5. Highlight **"Free & Ad-Free"** message

### Localization (Future)

Consider translating to:
- Spanish
- French
- German
- Portuguese
- Hindi

---

## Troubleshooting

### iOS Build Fails

```bash
cd ios
pod deintegrate
pod install
cd ..
npx react-native run-ios
```

### Android Build Fails

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Signing Errors

- Verify keystore exists and paths are correct
- Check passwords match
- Ensure bundle ID matches certificates

---

## Launch Checklist

- [ ] Firebase fully configured and tested
- [ ] All features tested on physical devices
- [ ] Privacy Policy and Terms uploaded
- [ ] Support email configured
- [ ] Screenshots prepared (all sizes)
- [ ] App descriptions written
- [ ] Keywords researched
- [ ] Test accounts ready for review
- [ ] Backup of signing keys/certificates
- [ ] Social media accounts ready (optional)
- [ ] Landing page created (optional)

---

## Resources

- [iOS App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://play.google.com/about/developer-content-policy/)
- [React Native Publishing Guide](https://reactnative.dev/docs/publishing-to-app-store)

---

**Good luck with your launch! 🚀**

Questions? Open an issue on [GitHub](https://github.com/rakeshbade/gymverse/issues)
