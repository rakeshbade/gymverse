export const VALIDATION = {
  age: {
    min: 13,
    max: 99,
  },
  weight: {
    min: 30,
    max: 250,
  },
  height: {
    min: 100,
    max: 250,
  },
};

export const GOALS = [
  'Lose Weight',
  'Build Muscle',
  'Get Fit',
  'Improve Endurance',
  'Stay Healthy',
];

export const LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

export const GENDERS = [
  'Male',
  'Female',
  'Other',
];

export const INTENSITY_LEVELS = [
  'Easy',
  'Medium',
  'Heavy',
];

// Firebase collections
export const COLLECTIONS = {
  users: 'users',
  history: 'history',
};

// Storage paths
export const STORAGE_PATHS = {
  workoutsJson: 'master/workouts.json',
  trainingImages: 'training/',
};

// Async storage keys
export const STORAGE_KEYS = {
  workoutCache: '@vyam:workout_cache',
  cacheTimestamp: '@vyam:cache_timestamp',
  user: '@vyam:user',
};

// Cache duration (24 hours in milliseconds)
export const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Donation URL
export const DONATION_URL = 'https://buymeacoffee.com/rakeshbade';
