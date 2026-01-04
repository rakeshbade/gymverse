export interface User {
  uid: string;
  email: string;
  name: string;
  gender: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  goal: string;
  level: string;
  favorites: string[]; // workout IDs
  createdAt: Date;
}

export interface Exercise {
  name: string;
  duration_sec?: number;
  reps?: string;
  type: 'warmup' | 'strength' | 'cardio' | 'cooldown';
}

export interface Workout {
  id: string;
  title: string;
  level: 'Easy' | 'Medium' | 'Heavy';
  duration_min: number;
  met_value: number;
  image_path: string;
  exercises: Exercise[];
  description?: string;
  featured?: boolean;
}

export interface WorkoutLibrary {
  version: number;
  workouts: Workout[];
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutTitle: string;
  date: Date;
  duration_min: number;
  caloriesBurned: number;
  completedExercises: number;
  totalExercises: number;
}

export interface WorkoutSession {
  workout: Workout;
  currentExerciseIndex: number;
  startTime: Date;
  elapsedTime: number;
  isPaused: boolean;
}
