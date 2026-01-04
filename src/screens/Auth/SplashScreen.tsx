import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';

const SplashScreen = () => {
    return (
        <LinearGradient colors={[COLORS.background, COLORS.backgroundSecondary]} style={styles.container}>
            <View style={styles.content}>
                {/* Placeholder for 3D Gorilla/Strength Logo */}
                <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoText}>🦍</Text>
                </View>

                <Text style={styles.title}>VyaM</Text>
                <Text style={styles.subtitle}>Exercise Your Inner Beast</Text>
            </View>

            <Text style={styles.footer}>Premium · Ad-Free · Free Forever</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.backgroundCard,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    logoText: {
        fontSize: 60,
    },
    title: {
        fontSize: TYPOGRAPHY.h1 * 1.5,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: SPACING.xl,
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textTertiary,
    },
});

export default SplashScreen;
