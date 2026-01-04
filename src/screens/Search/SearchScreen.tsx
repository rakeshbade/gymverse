import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWorkout } from '../../contexts/WorkoutContext';
import Input from '../../components/Input';
import WorkoutCard from '../../components/WorkoutCard';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';
import { Workout } from '../../types';

const SearchScreen = () => {
    const navigation = useNavigation();
    const { searchWorkouts, isFavorite, toggleFavorite } = useWorkout();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Workout[]>([]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            const results = searchWorkouts(query);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Search Workouts</Text>
            </View>

            <View style={styles.searchContainer}>
                <Input
                    placeholder="Search by name, exercise, or description..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    icon="magnify"
                    autoCapitalize="none"
                />
            </View>

            {searchQuery.trim() === '' ? (
                <View style={styles.emptyState}>
                    <Icon name="magnify" size={80} color={COLORS.textTertiary} />
                    <Text style={styles.emptyText}>Start typing to search workouts</Text>
                    <Text style={styles.emptySubtext}>
                        Search by workout name, exercise, or description
                    </Text>
                </View>
            ) : searchResults.length === 0 ? (
                <View style={styles.emptyState}>
                    <Icon name="emoticon-sad-outline" size={80} color={COLORS.textTertiary} />
                    <Text style={styles.emptyText}>No results found</Text>
                    <Text style={styles.emptySubtext}>Try searching with different keywords</Text>
                </View>
            ) : (
                <FlatList
                    data={searchResults}
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
                    ListHeaderComponent={
                        <View style={styles.resultHeader}>
                            <Text style={styles.resultCount}>
                                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                            </Text>
                        </View>
                    }
                />
            )}
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
    searchContainer: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
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
    resultHeader: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    resultCount: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
    },
});

export default SearchScreen;
