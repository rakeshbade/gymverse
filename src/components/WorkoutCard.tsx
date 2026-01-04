import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Workout } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { formatDuration } from '../utils/helpers';

interface WorkoutCardProps {
    workout: Workout;
    onPress: () => void;
    onFavoritePress?: () => void;
    isFavorite?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - SPACING.lg * 2;

const WorkoutCard: React.FC<WorkoutCardProps> = ({
    workout,
    onPress,
    onFavoritePress,
    isFavorite = false,
}) => {
    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Easy':
                return COLORS.success;
            case 'Medium':
                return COLORS.warning;
            case 'Heavy':
                return COLORS.error;
            default:
                return COLORS.neon;
        }
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
            <View style={styles.card}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: workout.image_path || 'https://via.placeholder.com/400x200' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', COLORS.background]}
                        style={styles.imageGradient}
                    />

                    {/* Favorite Button */}
                    {onFavoritePress && (
                        <TouchableOpacity
                            onPress={onFavoritePress}
                            style={styles.favoriteButton}
                            activeOpacity={0.8}>
                            <Icon
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={24}
                                color={isFavorite ? COLORS.error : COLORS.textPrimary}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={2}>
                        {workout.title}
                    </Text>

                    <View style={styles.metaContainer}>
                        {/* Level Badge */}
                        <View style={[styles.badge, { backgroundColor: getLevelColor(workout.level) + '20' }]}>
                            <Text style={[styles.badgeText, { color: getLevelColor(workout.level) }]}>
                                {workout.level}
                            </Text>
                        </View>

                        {/* Duration */}
                        <View style={styles.metaItem}>
                            <Icon name="clock-outline" size={16} color={COLORS.textSecondary} />
                            <Text style={styles.metaText}>{formatDuration(workout.duration_min)}</Text>
                        </View>

                        {/* Exercises Count */}
                        <View style={styles.metaItem}>
                            <Icon name="dumbbell" size={16} color={COLORS.textSecondary} />
                            <Text style={styles.metaText}>{workout.exercises.length} exercises</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    card: {
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    favoriteButton: {
        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.full,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.h4,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    badgeText: {
        fontSize: TYPOGRAPHY.caption,
        fontWeight: TYPOGRAPHY.semiBold,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
    },
});

export default WorkoutCard;
