import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

interface LoadingProps {
    message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.neon} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    text: {
        marginTop: 16,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },
});

export default Loading;
