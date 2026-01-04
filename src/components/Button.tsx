import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const isOutline = variant === 'outline';

    const renderContent = () => (
        <View style={[styles.container, style]}>
            {loading ? (
                <ActivityIndicator color={isPrimary ? COLORS.background : COLORS.neon} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        isPrimary && styles.textPrimary,
                        isSecondary && styles.textSecondary,
                        isOutline && styles.textOutline,
                        textStyle,
                    ]}>
                    {title}
                </Text>
            )}
        </View>
    );

    if (isPrimary && !disabled) {
        return (
            <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
                <LinearGradient
                    colors={[COLORS.neon, COLORS.neonDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.gradient, disabled && styles.disabled]}>
                    {renderContent()}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.button,
                isSecondary && styles.secondary,
                isOutline && styles.outline,
                disabled && styles.disabled,
                style,
            ]}>
            {renderContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
    },
    gradient: {
        borderRadius: BORDER_RADIUS.md,
    },
    container: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    secondary: {
        backgroundColor: COLORS.backgroundCard,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.neon,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.bold,
    },
    textPrimary: {
        color: COLORS.background,
    },
    textSecondary: {
        color: COLORS.neon,
    },
    textOutline: {
        color: COLORS.neon,
    },
});

export default Button;
