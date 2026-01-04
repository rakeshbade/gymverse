import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import firestoreService from '../../services/firestore.service';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { formatTime, calculateCalories } from '../../utils/helpers';
import { Workout } from '../../types';

const ActiveWorkoutScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { workout } = route.params as { workout: Workout };
    const { user, userProfile } = useAuth();

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isResting, setIsResting] = useState(false);
    const [restSeconds, setRestSeconds] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<Date>(new Date());

    const currentExercise = workout.exercises[currentExerciseIndex];
    const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
    const REST_DURATION = 30; // 30 seconds rest between exercises

    useEffect(() => {
        // Prevent back navigation during workout
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            handleQuit();
            return true;
        });

        // Start timer
        startTimer();

        return () => {
            backHandler.remove();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isPaused) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        } else {
            startTimer();
        }
    }, [isPaused]);

    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            if (isResting) {
                setRestSeconds(prev => {
                    if (prev <= 1) {
                        setIsResting(false);
                        return 0;
                    }
                    return prev - 1;
                });
            } else {
                setElapsedSeconds(prev => prev + 1);
            }
        }, 1000);
    };

    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    const handleNext = () => {
        if (isLastExercise) {
            handleComplete();
        } else {
            // Start rest period
            setIsResting(true);
            setRestSeconds(REST_DURATION);
            setTimeout(() => {
                setCurrentExerciseIndex(prev => prev + 1);
            }, REST_DURATION * 1000);
        }
    };

    const handlePrevious = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
            setIsResting(false);
            setRestSeconds(0);
        }
    };

    const handleQuit = () => {
        Alert.alert(
            'Quit Workout?',
            'Are you sure you want to quit? Your progress will not be saved.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Quit',
                    style: 'destructive',
                    onPress: () => {
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                        }
                        navigation.goBack();
                    },
                },
            ],
        );
    };

    const handleComplete = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        const durationMin = Math.round(elapsedSeconds / 60);
        const caloriesBurned = userProfile
            ? calculateCalories(durationMin, workout.met_value, userProfile.weight)
            : 0;

        // Save workout log
        if (user) {
            try {
                await firestoreService.saveWorkoutLog(user.uid, {
                    workoutId: workout.id,
                    workoutTitle: workout.title,
                    date: startTimeRef.current,
                    duration_min: durationMin,
                    caloriesBurned,
                    completedExercises: workout.exercises.length,
                    totalExercises: workout.exercises.length,
                });
            } catch (error) {
                console.error('Error saving workout log:', error);
            }
        }

        (navigation as any).replace('WorkoutComplete', {
            workout,
            duration_min: durationMin,
            caloriesBurned,
        });
    };

    if (isResting) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient
                    colors={[COLORS.background, COLORS.backgroundSecondary]}
                    style={styles.restContainer}>
                    <Icon name="timer-sand" size={80} color={COLORS.neon} />
                    <Text style={styles.restTitle}>Rest Time</Text>
                    <Text style={styles.restTimer}>{formatTime(restSeconds)}</Text>
                    <Text style={styles.nextExercise}>
                        Next: {workout.exercises[currentExerciseIndex + 1]?.name}
                    </Text>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleQuit} activeOpacity={0.7}>
                    <Icon name="close" size={28} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.workoutTitle}>{workout.title}</Text>
                <TouchableOpacity onPress={handlePause} activeOpacity={0.7}>
                    <Icon name={isPaused ? 'play' : 'pause'} size={28} color={COLORS.neon} />
                </TouchableOpacity>
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%` },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
                </Text>
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
                <Text style={styles.timerLabel}>Elapsed Time</Text>
                <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>
            </View>

            {/* Current Exercise */}
            <View style={styles.exerciseContainer}>
                <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseName}>{currentExercise.name}</Text>

                    {currentExercise.duration_sec && (
                        <View style={styles.exerciseDetail}>
                            <Icon name="clock-outline" size={24} color={COLORS.neon} />
                            <Text style={styles.exerciseDetailText}>
                                {Math.floor(currentExercise.duration_sec / 60)}:{(currentExercise.duration_sec % 60)
                                    .toString()
                                    .padStart(2, '0')} min
                            </Text>
                        </View>
                    )}

                    {currentExercise.reps && (
                        <View style={styles.exerciseDetail}>
                            <Icon name="counter" size={24} color={COLORS.neon} />
                            <Text style={styles.exerciseDetailText}>{currentExercise.reps}</Text>
                        </View>
                    )}

                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{currentExercise.type}</Text>
                    </View>
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.controlButton, currentExerciseIndex === 0 && styles.controlButtonDisabled]}
                    onPress={handlePrevious}
                    disabled={currentExerciseIndex === 0}
                    activeOpacity={0.7}>
                    <Icon
                        name="chevron-left"
                        size={32}
                        color={currentExerciseIndex === 0 ? COLORS.textTertiary : COLORS.textPrimary}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
                    <LinearGradient
                        colors={[COLORS.neon, COLORS.neonDark]}
                        style={styles.nextButtonGradient}>
                        <Text style={styles.nextButtonText}>
                            {isLastExercise ? 'Complete' : 'Next Exercise'}
                        </Text>
                        <Icon name="chevron-right" size={24} color={COLORS.background} />
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={handleNext} activeOpacity={0.7}>
                    <Icon name="chevron-right" size={32} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    workoutTitle: {
        fontSize: TYPOGRAPHY.h4,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
    },
    progressContainer: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    progressBar: {
        height: 8,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: SPACING.sm,
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.neon,
    },
    progressText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    timerLabel: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    timer: {
        fontSize: 64,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
    },
    exerciseContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
    },
    exerciseCard: {
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    exerciseName: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    exerciseDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    exerciseDetailText: {
        fontSize: TYPOGRAPHY.h4,
        color: COLORS.textPrimary,
    },
    typeBadge: {
        marginTop: SPACING.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        backgroundColor: COLORS.neon + '20',
        borderRadius: BORDER_RADIUS.sm,
    },
    typeText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.neon,
        textTransform: 'uppercase',
        fontWeight: TYPOGRAPHY.semiBold,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.xl,
    },
    controlButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlButtonDisabled: {
        opacity: 0.3,
    },
    nextButton: {
        flex: 1,
        marginHorizontal: SPACING.md,
    },
    nextButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.sm,
    },
    nextButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.background,
    },
    restContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    restTitle: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
    },
    restTimer: {
        fontSize: 72,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
        marginBottom: SPACING.xl,
    },
    nextExercise: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});

export default ActiveWorkoutScreen;
