import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import authService from '../services/auth.service';
import firestoreService from '../services/firestore.service';
import { User } from '../types';

interface AuthContextType {
    user: FirebaseAuthTypes.User | null;
    userProfile: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to auth state changes
        const unsubscribeAuth = authService.onAuthStateChanged(async firebaseUser => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user profile from Firestore
                try {
                    const profile = await firestoreService.getUserProfile(firebaseUser.uid);
                    setUserProfile(profile);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        await authService.signIn(email, password);
    };

    const signUp = async (email: string, password: string) => {
        await authService.signUp(email, password);
    };

    const signOut = async () => {
        await authService.signOut();
        setUserProfile(null);
    };

    const updateProfile = async (updates: Partial<User>) => {
        if (!user) {
            throw new Error('No user logged in');
        }
        await firestoreService.updateUserProfile(user.uid, updates);
        setUserProfile(prev => (prev ? { ...prev, ...updates } : null));
    };

    const value = {
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
