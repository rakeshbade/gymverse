# VyaM - Exercise Your Inner Beast 🦍

![VyaM Banner](https://img.shields.io/badge/VyaM-Premium%20Ad--Free-9EFD38?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**VyaM** (Sanskrit for "Exercise") is a premium, ad-free fitness application designed to provide a high-quality workout experience completely free. Built with a storage-first architecture to minimize operational costs while maximizing user experience.

## 🌟 Features

- **🔐 Secure Authentication**: Email/password authentication via Firebase
- **💪 Comprehensive Workout Library**: Curated exercises for all fitness levels (Easy, Medium, Heavy)
- **⏱️ Active Workout Sessions**: Real-time timer, rest intervals, and progress tracking
- **🔥 Calorie Tracking**: Accurate calorie calculation using MET formula
- **⭐ Favorites System**: Save and sync your favorite workouts across devices
- **📊 Workout History**: Track your progress with detailed workout logs
- **🔍 Smart Search**: Find workouts by name, exercise, or description
- **🎨 Dark Mode UI**: High-contrast neon design (#9EFD38) optimized for readability
- **💝 Community Support**: Optional donation support via Buy Me a Coffee

## 🏗️ Architecture

VyaM uses a **Storage-First Architecture** to minimize costs:

- **Backend**: Firebase (Free Tier)
- **Authentication**: Firebase Auth
- **Database**: Firestore (user metadata, favorites, history only)
- **Storage**: Firebase Storage (hosts `workouts.json` and images)
- **Local Processing**: Calorie calculations done on-device using MET formula

### Tech Stack

- **Framework**: React Native 0.73
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Backend**: Firebase (Auth, Firestore, Storage)
- **UI Components**: Custom components with Linear Gradient effects

## 📁 Project Structure

```
gymverse/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── WorkoutCard.tsx
│   │   └── Loading.tsx
│   ├── constants/          # App constants and theme
│   │   ├── theme.ts
│   │   └── index.ts
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── WorkoutContext.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── RootNavigator.tsx
│   ├── screens/            # Screen components
│   │   ├── Auth/
│   │   ├── Home/
│   │   ├── Workout/
│   │   ├── Search/
│   │   ├── Favorites/
│   │   ├── History/
│   │   └── Account/
│   ├── services/           # Firebase services
│   │   ├── auth.service.ts
│   │   ├── firestore.service.ts
│   │   └── storage.service.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── utils/              # Helper functions
│   │   └── helpers.ts
│   └── App.tsx             # Root component
├── assets/                 # Static assets
│   └── workouts.json       # Master workout library
├── android/                # Android native code
├── ios/                    # iOS native code
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- React Native development environment
- Firebase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rakeshbade/gymverse.git
cd gymverse
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up Firebase**

   a. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   b. Enable Authentication (Email/Password)
   
   c. Create Firestore database
   
   d. Create Storage bucket
   
   e. Download configuration files:
      - For Android: `google-services.json` → `android/app/`
      - For iOS: `GoogleService-Info.plist` → `ios/`

4. **Upload workout library**
```bash
# Upload assets/workouts.json to Firebase Storage at path: master/workouts.json
```

5. **Deploy security rules**
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

### Running the App

**iOS**
```bash
npx react-native run-ios
```

**Android**
```bash
npx react-native run-android
```

## 🔐 Security

### Firestore Security Rules

Users can only access their own data:
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### Storage Security Rules

Workout library is read-only for authenticated users:
```javascript
match /master/{allPaths=**} {
  allow read: if request.auth != null;
  allow write: if false;
}
```

## 📱 Features in Detail

### Calorie Calculation

Uses the MET (Metabolic Equivalent) formula:
```
Calories = Duration × ((MET × 3.5 × Weight_kg) / 200)
```

### Workout Library Format

```json
{
  "version": 1.0,
  "workouts": [
    {
      "id": "unique_id",
      "title": "Workout Name",
      "level": "Easy|Medium|Heavy",
      "duration_min": 45,
      "met_value": 6.0,
      "image_path": "url_to_image",
      "exercises": [...]
    }
  ]
}
```

### User Profile Validation

- Age: 13-99 years
- Weight: 30-250 kg
- Height: 100-250 cm

## 🎨 Design System

### Colors
- Background: `#000000`
- Neon Accent: `#9EFD38`
- Dark mode optimized with high contrast

### Typography
- Font sizes: 12-48px
- Weights: Regular, Medium, SemiBold, Bold

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💝 Support VyaM

VyaM is completely free and ad-free. If you love the app, consider supporting us:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20VyaM-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/rakeshbade)

## 📞 Contact

Rakesh Bade - [@rakeshbade](https://github.com/rakeshbade)

Project Link: [https://github.com/rakeshbade/gymverse](https://github.com/rakeshbade/gymverse)

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- React Native community
- All our amazing users and contributors

---

**Made with 💚 for the fitness community**

*Premium · Ad-Free · Free Forever*