import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WorkoutLibrary} from '../types';
import {STORAGE_PATHS, STORAGE_KEYS, CACHE_DURATION} from '../constants';

class StorageService {
  /**
   * Fetch workouts.json from Firebase Storage
   * Uses local cache if available and fresh
   */
  async getWorkoutLibrary(): Promise<WorkoutLibrary> {
    try {
      // Check cache first
      const cachedData = await this.getCachedWorkouts();
      if (cachedData) {
        console.log('Using cached workout library');
        return cachedData;
      }

      // Fetch from Firebase Storage
      console.log('Fetching workout library from Firebase Storage');
      const url = await storage().ref(STORAGE_PATHS.workoutsJson).getDownloadURL();
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch workouts.json');
      }

      const data: WorkoutLibrary = await response.json();

      // Cache the data
      await this.cacheWorkouts(data);

      return data;
    } catch (error) {
      console.error('Error fetching workout library:', error);
      
      // Try to return cached data even if expired as fallback
      const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.workoutCache);
      if (cachedData) {
        console.log('Using expired cache as fallback');
        return JSON.parse(cachedData);
      }

      throw new Error('Failed to load workout library');
    }
  }

  /**
   * Get cached workouts if available and fresh
   */
  private async getCachedWorkouts(): Promise<WorkoutLibrary | null> {
    try {
      const [cachedData, timestamp] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.workoutCache),
        AsyncStorage.getItem(STORAGE_KEYS.cacheTimestamp),
      ]);

      if (!cachedData || !timestamp) {
        return null;
      }

      const cacheAge = Date.now() - parseInt(timestamp, 10);
      if (cacheAge > CACHE_DURATION) {
        // Cache expired
        return null;
      }

      return JSON.parse(cachedData);
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  /**
   * Cache workouts data locally
   */
  private async cacheWorkouts(data: WorkoutLibrary): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.workoutCache, JSON.stringify(data)),
        AsyncStorage.setItem(STORAGE_KEYS.cacheTimestamp, Date.now().toString()),
      ]);
    } catch (error) {
      console.error('Error caching workouts:', error);
    }
  }

  /**
   * Clear workout cache (useful for manual refresh)
   */
  async clearWorkoutCache(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.workoutCache),
        AsyncStorage.removeItem(STORAGE_KEYS.cacheTimestamp),
      ]);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get workout image URL from Firebase Storage
   */
  async getWorkoutImageUrl(imagePath: string): Promise<string> {
    try {
      const url = await storage().ref(imagePath).getDownloadURL();
      return url;
    } catch (error) {
      console.error('Error getting image URL:', error);
      // Return placeholder or throw based on requirements
      return '';
    }
  }
}

export default new StorageService();
