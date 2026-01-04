import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/theme';
import { isValidEmail, isValidPassword } from '../../utils/helpers';

const LoginScreen = () => {
    const navigation = useNavigation();
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors = { email: '', password: '' };
        let isValid = true;

        if (!email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (!isValidPassword(password)) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <Text style={styles.logo}>🦍</Text>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue your journey</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon="email-outline"
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            isPassword
                            icon="lock-outline"
                            error={errors.password}
                        />

                        <Button title="Sign In" onPress={handleLogin} loading={loading} />

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup' as never)}>
                                <Text style={styles.signupLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginTop: SPACING.xxl,
        marginBottom: SPACING.xl,
    },
    logo: {
        fontSize: 80,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.h1,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },
    form: {
        flex: 1,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.lg,
    },
    signupText: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
    },
    signupLink: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.neon,
        fontWeight: TYPOGRAPHY.semiBold,
    },
});

export default LoginScreen;
