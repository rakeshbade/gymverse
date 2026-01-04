import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: string;
    isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    isPassword = false,
    ...textInputProps
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error ? styles.inputError : null]}>
                {icon && <Icon name={icon} size={20} color={COLORS.textSecondary} style={styles.icon} />}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={COLORS.textTertiary}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    {...textInputProps}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.eyeIcon}>
                        <Icon
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color={COLORS.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: TYPOGRAPHY.medium,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.backgroundCard,
        paddingHorizontal: SPACING.md,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    input: {
        flex: 1,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textPrimary,
        paddingVertical: SPACING.md,
    },
    icon: {
        marginRight: SPACING.sm,
    },
    eyeIcon: {
        padding: SPACING.xs,
    },
    errorText: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.error,
        marginTop: SPACING.xs,
        marginLeft: SPACING.xs,
    },
});

export default Input;
