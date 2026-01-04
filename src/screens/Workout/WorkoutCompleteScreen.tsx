import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../components/Button';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { formatDuration } from '../../utils/helpers';
import { Workout } from '../../types';

const WorkoutCompleteScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { workout, duration_min, caloriesBurned } = route.params as {
        workout: Workout;
        duration_min: number;
        caloriesBurned: number;
    };

    const handleGoHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            }),
        );
    };

    const handleViewHistory = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'History' }],
            }),
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[COLORS.background, COLORS.backgroundSecondary]}
                style={styles.gradient}>
                {/* Success Icon/Animation */}
                <View style={styles.iconContainer}>
                    <View style={styles.successCircle}>
                        <Icon name="check" size={80} color={COLORS.background} />
                    </View>
                </View>

                {/* Congratulations Message */}
                <View style={styles.messageContainer}>
                    <Text style={styles.title}>Congratulations! 🎉</Text>
                    <Text style={styles.subtitle}>You crushed it!</Text>
                    <Text style={styles.workoutName}>{workout.title}</Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Icon name="fire" size={40} color={COLORS.neon} />
                        <Text style={styles.statValue}>{caloriesBurned}</Text>
                        <Text style={styles.statLabel}>Calories Incinerated</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Icon name="clock-outline" size={40} color={COLORS.neon} />
                        <Text style={styles.statValue}>{formatDuration(duration_min)}</Text>
                        <Text style={styles.statLabel}>Duration</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Icon name="dumbbell" size={40} color={COLORS.neon} />
                        <Text style={styles.statValue}>{workout.exercises.length}</Text>
                        <Text style={styles.statLabel}>Exercises</Text>
                    </View>
                </View>

                {/* Motivational Quote */}
                <View style={styles.quoteContainer}>
                    <Text style={styles.quote}>
                        "The only bad workout is the one that didn't happen."
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Button title="Back to Home" onPress={handleGoHome} />
                    <TouchableOpacity onPress={handleViewHistory} style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>View History</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    gradient: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    successCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: COLORS.neon,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: TYPOGRAPHY.h1,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.h3,
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    workoutName: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
        gap: SPACING.sm,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
    },
    statValue: {
        fontSize: TYPOGRAPHY.h3,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        marginTop: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    statLabel: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    quoteContainer: {
        backgroundColor: COLORS.backgroundCard,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.neon,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.xl,
    },
    quote: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    actions: {
        gap: SPACING.md,
    },
    secondaryButton: {
        paddingVertical: SPACING.md,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.semiBold,
        color: COLORS.neon,
    },
});

export default WorkoutCompleteScreen;
