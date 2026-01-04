import firestore from '@react-native-firebase/firestore';
import {User, WorkoutLog} from '../types';
import {COLLECTIONS} from '../constants';

class FirestoreService {
  /**
   * Create user profile document
   */
  async createUserProfile(uid: string, userData: Omit<User, 'uid' | 'createdAt'>): Promise<void> {
    try {
      const userDoc: User = {
        uid,
        ...userData,
        favorites: [],
        createdAt: new Date(),
      };

      await firestore().collection(COLLECTIONS.users).doc(uid).set(userDoc);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const doc = await firestore().collection(COLLECTIONS.users).doc(uid).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return {
        ...data,
        createdAt: data?.createdAt?.toDate(),
      } as User;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
    try {
      await firestore().collection(COLLECTIONS.users).doc(uid).update(updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  /**
   * Add workout to favorites
   */
  async addToFavorites(uid: string, workoutId: string): Promise<void> {
    try {
      await firestore()
        .collection(COLLECTIONS.users)
        .doc(uid)
        .update({
          favorites: firestore.FieldValue.arrayUnion(workoutId),
        });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw new Error('Failed to add to favorites');
    }
  }

  /**
   * Remove workout from favorites
   */
  async removeFromFavorites(uid: string, workoutId: string): Promise<void> {
    try {
      await firestore()
        .collection(COLLECTIONS.users)
        .doc(uid)
        .update({
          favorites: firestore.FieldValue.arrayRemove(workoutId),
        });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw new Error('Failed to remove from favorites');
    }
  }

  /**
   * Save workout log to history
   */
  async saveWorkoutLog(uid: string, log: Omit<WorkoutLog, 'id'>): Promise<void> {
    try {
      await firestore()
        .collection(COLLECTIONS.users)
        .doc(uid)
        .collection(COLLECTIONS.history)
        .add({
          ...log,
          date: firestore.Timestamp.fromDate(log.date),
        });
    } catch (error) {
      console.error('Error saving workout log:', error);
      throw new Error('Failed to save workout log');
    }
  }

  /**
   * Get workout history
   */
  async getWorkoutHistory(uid: string, limit: number = 50): Promise<WorkoutLog[]> {
    try {
      const snapshot = await firestore()
        .collection(COLLECTIONS.users)
        .doc(uid)
        .collection(COLLECTIONS.history)
        .orderBy('date', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      })) as WorkoutLog[];
    } catch (error) {
      console.error('Error getting workout history:', error);
      throw new Error('Failed to get workout history');
    }
  }

  /**
   * Listen to user profile changes
   */
  subscribeToUserProfile(uid: string, callback: (user: User | null) => void) {
    return firestore()
      .collection(COLLECTIONS.users)
      .doc(uid)
      .onSnapshot(
        (doc: any) => {
          if (doc.exists) {
            const data = doc.data();
            callback({
              ...data,
              createdAt: data?.createdAt?.toDate(),
            } as User);
          } else {
            callback(null);
          }
        },
        (error: any) => {
          console.error('Error listening to user profile:', error);
          callback(null);
        },
      );
  }
}

export default new FirestoreService();
