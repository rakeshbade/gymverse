import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { DONATION_URL } from '../../constants';

const AccountScreen = () => {
    const { userProfile, signOut } = useAuth();

    const handleDonate = async () => {
        try {
            const supported = await Linking.canOpenURL(DONATION_URL);
            if (supported) {
                await Linking.openURL(DONATION_URL);
            } else {
                Alert.alert('Error', 'Cannot open donation link');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to open donation link');
        }
    };

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await signOut();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to sign out');
                    }
                },
            },
        ]);
    };

    if (!userProfile) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Account</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>💪</Text>
                    </View>
                    <Text style={styles.name}>{userProfile.name}</Text>
                    <Text style={styles.email}>{userProfile.email}</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Icon name="target" size={24} color={COLORS.neon} />
                        <Text style={styles.statLabel}>Goal</Text>
                        <Text style={styles.statValue}>{userProfile.goal}</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Icon name="chart-line" size={24} color={COLORS.neon} />
                        <Text style={styles.statLabel}>Level</Text>
                        <Text style={styles.statValue}>{userProfile.level}</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Icon name="scale-bathroom" size={24} color={COLORS.neon} />
                        <Text style={styles.statLabel}>Weight</Text>
                        <Text style={styles.statValue}>{userProfile.weight}kg</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Icon name="human-male-height" size={24} color={COLORS.neon} />
                        <Text style={styles.statLabel}>Height</Text>
                        <Text style={styles.statValue}>{userProfile.height}cm</Text>
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <View style={styles.supportCard}>
                        <Icon name="heart" size={48} color={COLORS.error} />
                        <Text style={styles.supportTitle}>Support VyaM</Text>
                        <Text style={styles.supportText}>
                            Love VyaM? Help us keep it free and ad-free forever by supporting our community.
                        </Text>
                        <TouchableOpacity onPress={handleDonate} activeOpacity={0.8} style={styles.donateButton}>
                            <Text style={styles.donateButtonText}>Buy Me a Coffee ☕</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* App Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>

                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                        <Icon name="file-document-outline" size={24} color={COLORS.textSecondary} />
                        <Text style={styles.menuText}>Privacy Policy</Text>
                        <Icon name="chevron-right" size={24} color={COLORS.textTertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                        <Icon name="text-box-outline" size={24} color={COLORS.textSecondary} />
                        <Text style={styles.menuText}>Terms of Service</Text>
                        <Icon name="chevron-right" size={24} color={COLORS.textTertiary} />
                    </TouchableOpacity>

                    <View style={styles.menuItem}>
                        <Icon name="information-outline" size={24} color={COLORS.textSecondary} />
                        <Text style={styles.menuText}>Version</Text>
                        <Text style={styles.versionText}>1.0.0</Text>
                    </View>
                </View>

                {/* Sign Out */}
                <View style={styles.section}>
                    <Button
                        title="Sign Out"
                        onPress={handleSignOut}
                        variant="outline"
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with 💚 for the fitness community</Text>
                    <Text style={styles.footerSubtext}>Premium · Ad-Free · Free Forever</Text>
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
    header: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
    },
    profileCard: {
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.lg,
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.neon + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    avatar: {
        fontSize: 40,
    },
    name: {
        fontSize: TYPOGRAPHY.h3,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    email: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    statItem: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    statValue: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.semiBold,
        color: COLORS.textPrimary,
        marginTop: SPACING.xs,
    },
    section: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.h4,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
        marginBottom: SPACING.md,
    },
    supportCard: {
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    supportTitle: {
        fontSize: TYPOGRAPHY.h3,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },
    supportText: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        lineHeight: 22,
    },
    donateButton: {
        backgroundColor: COLORS.neon,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.md,
    },
    donateButtonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.background,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
    },
    menuText: {
        flex: 1,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textPrimary,
        marginLeft: SPACING.md,
    },
    versionText: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textTertiary,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: SPACING.xl,
    },
    footerText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    footerSubtext: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.textTertiary,
    },
});

export default AccountScreen;
