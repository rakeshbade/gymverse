import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import firestoreService from '../../services/firestore.service';
import Loading from '../../components/Loading';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { formatDuration } from '../../utils/helpers';
import { WorkoutLog } from '../../types';

const HistoryScreen = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<WorkoutLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const logs = await firestoreService.getWorkoutHistory(user.uid);
            setHistory(logs);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date): string => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const totalWorkouts = history.length;
    const totalCalories = history.reduce((sum, log) => sum + log.caloriesBurned, 0);
    const totalMinutes = history.reduce((sum, log) => sum + log.duration_min, 0);

    if (loading) {
        return <Loading message="Loading history..." />;
    }

    if (history.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>History</Text>
                </View>
                <View style={styles.emptyState}>
                    <Icon name="history" size={80} color={COLORS.textTertiary} />
                    <Text style={styles.emptyText}>No workout history yet</Text>
                    <Text style={styles.emptySubtext}>
                        Complete your first workout to see it here
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
            </View>

            {/* Stats Summary */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Icon name="dumbbell" size={24} color={COLORS.neon} />
                    <Text style={styles.statValue}>{totalWorkouts}</Text>
                    <Text style={styles.statLabel}>Workouts</Text>
                </View>

                <View style={styles.statCard}>
                    <Icon name="fire" size={24} color={COLORS.neon} />
                    <Text style={styles.statValue}>{totalCalories}</Text>
                    <Text style={styles.statLabel}>Calories</Text>
                </View>

                <View style={styles.statCard}>
                    <Icon name="clock-outline" size={24} color={COLORS.neon} />
                    <Text style={styles.statValue}>{formatDuration(totalMinutes)}</Text>
                    <Text style={styles.statLabel}>Total Time</Text>
                </View>
            </View>

            {/* History List */}
            <FlatList
                data={history}
                renderItem={({ item }) => (
                    <View style={styles.logCard}>
                        <View style={styles.logHeader}>
                            <View style={styles.logIcon}>
                                <Icon name="check-circle" size={24} color={COLORS.neon} />
                            </View>
                            <View style={styles.logInfo}>
                                <Text style={styles.logTitle}>{item.workoutTitle}</Text>
                                <Text style={styles.logDate}>{formatDate(item.date)}</Text>
                            </View>
                        </View>

                        <View style={styles.logStats}>
                            <View style={styles.logStat}>
                                <Icon name="clock-outline" size={16} color={COLORS.textSecondary} />
                                <Text style={styles.logStatText}>{formatDuration(item.duration_min)}</Text>
                            </View>

                            <View style={styles.logStat}>
                                <Icon name="fire" size={16} color={COLORS.textSecondary} />
                                <Text style={styles.logStatText}>{item.caloriesBurned} cal</Text>
                            </View>

                            <View style={styles.logStat}>
                                <Icon name="dumbbell" size={16} color={COLORS.textSecondary} />
                                <Text style={styles.logStatText}>
                                    {item.completedExercises}/{item.totalExercises} exercises
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyText: {
        fontSize: TYPOGRAPHY.h4,
        fontWeight: TYPOGRAPHY.semiBold,
        color: COLORS.textSecondary,
        marginTop: SPACING.lg,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textTertiary,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
        gap: SPACING.sm,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
    },
    statValue: {
        fontSize: TYPOGRAPHY.h4,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        marginTop: SPACING.xs,
    },
    statLabel: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    list: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    logCard: {
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    logHeader: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    logIcon: {
        marginRight: SPACING.md,
    },
    logInfo: {
        flex: 1,
    },
    logTitle: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.semiBold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    logDate: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
    },
    logStats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    logStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    logStatText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
    },
});

export default HistoryScreen;
