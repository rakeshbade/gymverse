import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useWorkout } from '../../contexts/WorkoutContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { formatDuration, calculateCalories } from '../../utils/helpers';
import { Workout } from '../../types';

const WorkoutDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { workout } = route.params as { workout: Workout };
    const { userProfile } = useAuth();
    const { isFavorite, toggleFavorite } = useWorkout();

    const estimatedCalories = userProfile
        ? calculateCalories(workout.duration_min, workout.met_value, userProfile.weight)
        : 0;

    const handleStartWorkout = () => {
        navigation.navigate('ActiveWorkout' as never, { workout } as never);
    };

    const handleFavoriteToggle = async () => {
        try {
            await toggleFavorite(workout.id);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Header */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: workout.image_path || 'https://via.placeholder.com/400x300' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', COLORS.background]}
                        style={styles.gradient}
                    />

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}>
                        <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>

                    {/* Favorite Button */}
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={handleFavoriteToggle}
                        activeOpacity={0.8}>
                        <Icon
                            name={isFavorite(workout.id) ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isFavorite(workout.id) ? COLORS.error : COLORS.textPrimary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{workout.title}</Text>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Icon name="clock-outline" size={24} color={COLORS.neon} />
                            <Text style={styles.statValue}>{formatDuration(workout.duration_min)}</Text>
                            <Text style={styles.statLabel}>Duration</Text>
                        </View>

                        <View style={styles.statCard}>
                            <Icon name="fire" size={24} color={COLORS.neon} />
                            <Text style={styles.statValue}>{estimatedCalories}</Text>
                            <Text style={styles.statLabel}>Calories</Text>
                        </View>

                        <View style={styles.statCard}>
                            <Icon name="dumbbell" size={24} color={COLORS.neon} />
                            <Text style={styles.statValue}>{workout.exercises.length}</Text>
                            <Text style={styles.statLabel}>Exercises</Text>
                        </View>
                    </View>

                    {/* Level Badge */}
                    <View style={styles.levelContainer}>
                        <Text style={styles.levelLabel}>Intensity Level:</Text>
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>{workout.level}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    {workout.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About</Text>
                            <Text style={styles.description}>{workout.description}</Text>
                        </View>
                    )}

                    {/* Exercises List */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Exercises</Text>
                        {workout.exercises.map((exercise, index) => (
                            <View key={index} style={styles.exerciseItem}>
                                <View style={styles.exerciseNumber}>
                                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                                </View>
                                <View style={styles.exerciseContent}>
                                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                                    <View style={styles.exerciseMeta}>
                                        {exercise.duration_sec && (
                                            <Text style={styles.exerciseMetaText}>
                                                {Math.floor(exercise.duration_sec / 60)}:{(exercise.duration_sec % 60)
                                                    .toString()
                                                    .padStart(2, '0')} min
                                            </Text>
                                        )}
                                        {exercise.reps && (
                                            <Text style={styles.exerciseMetaText}>{exercise.reps}</Text>
                                        )}
                                        <View style={[styles.typeBadge, styles[`type_${exercise.type}`]]}>
                                            <Text style={styles.typeText}>{exercise.type}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Start Button */}
            <View style={styles.footer}>
                <Button title="Start Workout" onPress={handleStartWorkout} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    imageContainer: {
        height: 300,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    backButton: {
        position: 'absolute',
        top: SPACING.md,
        left: SPACING.md,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteButton: {
        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.backgroundCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: TYPOGRAPHY.h1,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        marginHorizontal: SPACING.xs,
    },
    statValue: {
        fontSize: TYPOGRAPHY.h3,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
        marginTop: SPACING.xs,
    },
    statLabel: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    levelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    levelLabel: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginRight: SPACING.sm,
    },
    levelBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        backgroundColor: COLORS.neon + '20',
        borderRadius: BORDER_RADIUS.sm,
    },
    levelText: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: TYPOGRAPHY.semiBold,
        color: COLORS.neon,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.h4,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
        marginBottom: SPACING.md,
    },
    description: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    exerciseItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
    },
    exerciseNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.neon + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    exerciseNumberText: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
    },
    exerciseContent: {
        flex: 1,
    },
    exerciseName: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.semiBold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    exerciseMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    exerciseMetaText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
    },
    typeBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
    },
    type_warmup: {
        backgroundColor: COLORS.warning + '20',
    },
    type_strength: {
        backgroundColor: COLORS.error + '20',
    },
    type_cardio: {
        backgroundColor: COLORS.success + '20',
    },
    type_cooldown: {
        backgroundColor: COLORS.neon + '20',
    },
    typeText: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        textTransform: 'capitalize',
    },
    footer: {
        padding: SPACING.lg,
        paddingBottom: SPACING.md,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.backgroundCard,
    },
});

export default WorkoutDetailScreen;
