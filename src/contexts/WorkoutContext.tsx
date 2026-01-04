import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Workout, WorkoutLibrary } from '../types';
import storageService from '../services/storage.service';
import { useAuth } from './AuthContext';
import firestoreService from '../services/firestore.service';

interface WorkoutContextType {
    workouts: Workout[];
    loading: boolean;
    error: string | null;
    featuredWorkouts: Workout[];
    favorites: string[];
    refreshWorkouts: () => Promise<void>;
    getWorkoutById: (id: string) => Workout | undefined;
    filterByLevel: (level: string) => Workout[];
    searchWorkouts: (query: string) => Workout[];
    toggleFavorite: (workoutId: string) => Promise<void>;
    isFavorite: (workoutId: string) => boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
    const { user, userProfile } = useAuth();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load workouts on mount
    useEffect(() => {
        loadWorkouts();
    }, []);

    // Sync favorites from user profile
    useEffect(() => {
        if (userProfile?.favorites) {
            setFavorites(userProfile.favorites);
        } else {
            setFavorites([]);
        }
    }, [userProfile]);

    const loadWorkouts = async () => {
        try {
            setLoading(true);
            setError(null);
            const library: WorkoutLibrary = await storageService.getWorkoutLibrary();
            setWorkouts(library.workouts);
        } catch (err: any) {
            setError(err.message || 'Failed to load workouts');
            console.error('Error loading workouts:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshWorkouts = async () => {
        await storageService.clearWorkoutCache();
        await loadWorkouts();
    };

    const getWorkoutById = (id: string): Workout | undefined => {
        return workouts.find(w => w.id === id);
    };

    const filterByLevel = (level: string): Workout[] => {
        return workouts.filter(w => w.level === level);
    };

    const searchWorkouts = (query: string): Workout[] => {
        const lowerQuery = query.toLowerCase();
        return workouts.filter(
            w =>
                w.title.toLowerCase().includes(lowerQuery) ||
                w.description?.toLowerCase().includes(lowerQuery) ||
                w.exercises.some(e => e.name.toLowerCase().includes(lowerQuery)),
        );
    };

    const toggleFavorite = async (workoutId: string) => {
        if (!user) {
            throw new Error('Must be logged in to add favorites');
        }

        const isFav = favorites.includes(workoutId);

        try {
            if (isFav) {
                await firestoreService.removeFromFavorites(user.uid, workoutId);
                setFavorites(prev => prev.filter(id => id !== workoutId));
            } else {
                await firestoreService.addToFavorites(user.uid, workoutId);
                setFavorites(prev => [...prev, workoutId]);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    };

    const isFavorite = (workoutId: string): boolean => {
        return favorites.includes(workoutId);
    };

    const featuredWorkouts = workouts.filter(w => w.featured === true);

    const value = {
        workouts,
        loading,
        error,
        featuredWorkouts,
        favorites,
        refreshWorkouts,
        getWorkoutById,
        filterByLevel,
        searchWorkouts,
        toggleFavorite,
        isFavorite,
    };

    return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};

export const useWorkout = () => {
    const context = useContext(WorkoutContext);
    if (context === undefined) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
};
