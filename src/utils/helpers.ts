/**
 * Calculate calories burned using MET (Metabolic Equivalent) formula
 * Formula: Calories = Duration × ((MET × 3.5 × Weight_kg) / 200)
 * 
 * @param durationMinutes - Duration of workout in minutes
 * @param metValue - MET value for the workout
 * @param weightKg - User's weight in kilograms
 * @returns Calories burned (rounded to nearest integer)
 */
export const calculateCalories = (
  durationMinutes: number,
  metValue: number,
  weightKg: number,
): number => {
  const calories = durationMinutes * ((metValue * 3.5 * weightKg) / 200);
  return Math.round(calories);
};

/**
 * Format time in seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Calculate total duration of all exercises in a workout
 */
export const calculateWorkoutDuration = (exercises: any[]): number => {
  return exercises.reduce((total, exercise) => {
    return total + (exercise.duration_sec || 0);
  }, 0);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength (min 6 characters)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
