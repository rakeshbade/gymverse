import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWorkout } from '../../contexts/WorkoutContext';
import WorkoutCard from '../../components/WorkoutCard';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';
import { Workout } from '../../types';

const FavoritesScreen = () => {
    const navigation = useNavigation();
    const { workouts, favorites, isFavorite, toggleFavorite } = useWorkout();

    const favoriteWorkouts = workouts.filter(w => favorites.includes(w.id));

    const handleWorkoutPress = (workout: Workout) => {
        navigation.navigate('Home' as never, {
            screen: 'WorkoutDetail',
            params: { workout },
        } as never);
    };

    const handleFavoriteToggle = async (workoutId: string) => {
        try {
            await toggleFavorite(workoutId);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (favoriteWorkouts.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Favorites</Text>
                </View>
                <View style={styles.emptyState}>
                    <Icon name="heart-outline" size={80} color={COLORS.textTertiary} />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <Text style={styles.emptySubtext}>
                        Start adding workouts to your favorites to see them here
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Favorites</Text>
                <Text style={styles.count}>{favoriteWorkouts.length} workouts</Text>
            </View>

            <FlatList
                data={favoriteWorkouts}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <WorkoutCard
                            workout={item}
                            onPress={() => handleWorkoutPress(item)}
                            onFavoritePress={() => handleFavoriteToggle(item.id)}
                            isFavorite={isFavorite(item.id)}
                        />
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
    count: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
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
    list: {
        paddingBottom: SPACING.xl,
    },
    cardContainer: {
        paddingHorizontal: SPACING.lg,
    },
});

export default FavoritesScreen;
