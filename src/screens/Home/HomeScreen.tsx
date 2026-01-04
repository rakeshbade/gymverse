import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkout } from '../../contexts/WorkoutContext';
import WorkoutCard from '../../components/WorkoutCard';
import Loading from '../../components/Loading';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';
import { INTENSITY_LEVELS } from '../../constants';
import { Workout } from '../../types';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { userProfile } = useAuth();
    const { workouts, featuredWorkouts, loading, error, refreshWorkouts, isFavorite, toggleFavorite } =
        useWorkout();

    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshWorkouts();
        setRefreshing(false);
    };

    const filteredWorkouts = selectedLevel
        ? workouts.filter(w => w.level === selectedLevel)
        : workouts;

    const handleWorkoutPress = (workout: Workout) => {
        navigation.navigate('WorkoutDetail' as never, { workout } as never);
    };

    const handleFavoriteToggle = async (workoutId: string) => {
        try {
            await toggleFavorite(workoutId);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (loading && !refreshing) {
        return <Loading message="Loading workouts..." />;
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Icon name="alert-circle-outline" size={60} color={COLORS.error} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.neon} />}
                showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {userProfile?.name || 'Warrior'}! 💪</Text>
                        <Text style={styles.subtitle}>Ready to crush your goals?</Text>
                    </View>
                </View>

                {/* Featured Workouts */}
                {featuredWorkouts.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Top Training</Text>
                        <FlatList
                            horizontal
                            data={featuredWorkouts}
                            renderItem={({ item }) => (
                                <View style={styles.featuredCard}>
                                    <WorkoutCard
                                        workout={item}
                                        onPress={() => handleWorkoutPress(item)}
                                        onFavoritePress={() => handleFavoriteToggle(item.id)}
                                        isFavorite={isFavorite(item.id)}
                                    />
                                </View>
                            )}
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.featuredList}
                        />
                    </View>
                )}

                {/* Filter by Intensity */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Filter by Intensity</Text>
                    <View style={styles.filterContainer}>
                        <TouchableOpacity
                            style={[styles.filterChip, !selectedLevel && styles.filterChipActive]}
                            onPress={() => setSelectedLevel(null)}
                            activeOpacity={0.7}>
                            <Text style={[styles.filterText, !selectedLevel && styles.filterTextActive]}>
                                All
                            </Text>
                        </TouchableOpacity>
                        {INTENSITY_LEVELS.map(level => (
                            <TouchableOpacity
                                key={level}
                                style={[styles.filterChip, selectedLevel === level && styles.filterChipActive]}
                                onPress={() => setSelectedLevel(level)}
                                activeOpacity={0.7}>
                                <Text
                                    style={[styles.filterText, selectedLevel === level && styles.filterTextActive]}>
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* All Workouts */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {selectedLevel ? `${selectedLevel} Workouts` : 'All Workouts'}
                    </Text>
                    {filteredWorkouts.map(workout => (
                        <WorkoutCard
                            key={workout.id}
                            workout={workout}
                            onPress={() => handleWorkoutPress(workout)}
                            onFavoritePress={() => handleFavoriteToggle(workout.id)}
                            isFavorite={isFavorite(workout.id)}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
    },
    greeting: {
        fontSize: TYPOGRAPHY.h3,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    section: {
        marginTop: SPACING.lg,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.h4,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    featuredList: {
        paddingHorizontal: SPACING.lg,
    },
    featuredCard: {
        width: 300,
        marginRight: SPACING.md,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    filterChip: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 2,
        borderColor: COLORS.backgroundCard,
    },
    filterChipActive: {
        borderColor: COLORS.neon,
        backgroundColor: COLORS.neon + '20',
    },
    filterText: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: TYPOGRAPHY.medium,
        color: COLORS.textSecondary,
    },
    filterTextActive: {
        color: COLORS.neon,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    errorText: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SPACING.md,
        marginBottom: SPACING.lg,
    },
    retryButton: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        backgroundColor: COLORS.neon,
        borderRadius: 25,
    },
    retryText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.background,
    },
});

export default HomeScreen;
