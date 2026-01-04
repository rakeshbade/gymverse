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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import firestoreService from '../../services/firestore.service';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { VALIDATION, GOALS, LEVELS, GENDERS } from '../../constants';

const ProfileSetupScreen = () => {
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [goal, setGoal] = useState('');
    const [level, setLevel] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: any = {};
        let isValid = true;

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!gender) {
            newErrors.gender = 'Please select your gender';
            isValid = false;
        }

        const ageNum = parseInt(age, 10);
        if (!age || isNaN(ageNum)) {
            newErrors.age = 'Age is required';
            isValid = false;
        } else if (ageNum < VALIDATION.age.min || ageNum > VALIDATION.age.max) {
            newErrors.age = `Age must be between ${VALIDATION.age.min} and ${VALIDATION.age.max}`;
            isValid = false;
        }

        const weightNum = parseFloat(weight);
        if (!weight || isNaN(weightNum)) {
            newErrors.weight = 'Weight is required';
            isValid = false;
        } else if (weightNum < VALIDATION.weight.min || weightNum > VALIDATION.weight.max) {
            newErrors.weight = `Weight must be between ${VALIDATION.weight.min}kg and ${VALIDATION.weight.max}kg`;
            isValid = false;
        }

        const heightNum = parseFloat(height);
        if (!height || isNaN(heightNum)) {
            newErrors.height = 'Height is required';
            isValid = false;
        } else if (heightNum < VALIDATION.height.min || heightNum > VALIDATION.height.max) {
            newErrors.height = `Height must be between ${VALIDATION.height.min}cm and ${VALIDATION.height.max}cm`;
            isValid = false;
        }

        if (!goal) {
            newErrors.goal = 'Please select your goal';
            isValid = false;
        }

        if (!level) {
            newErrors.level = 'Please select your fitness level';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleComplete = async () => {
        if (!validateForm() || !user) {
            return;
        }

        setLoading(true);
        try {
            await firestoreService.createUserProfile(user.uid, {
                email: user.email!,
                name: name.trim(),
                gender,
                age: parseInt(age, 10),
                weight: parseFloat(weight),
                height: parseFloat(height),
                goal,
                level,
                favorites: [],
            });
            // AuthContext will automatically redirect to main app
        } catch (error: any) {
            Alert.alert('Setup Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderSelection = (
        title: string,
        options: string[],
        selected: string,
        onSelect: (value: string) => void,
        error?: string,
    ) => (
        <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>{title}</Text>
            <View style={styles.optionsContainer}>
                {options.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.option, selected === option && styles.optionSelected]}
                        onPress={() => onSelect(option)}
                        activeOpacity={0.7}>
                        <Text
                            style={[
                                styles.optionText,
                                selected === option && styles.optionTextSelected,
                            ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Help us personalize your fitness experience
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Name"
                            placeholder="Enter your name"
                            value={name}
                            onChangeText={setName}
                            icon="account-outline"
                            error={errors.name}
                        />

                        {renderSelection('Gender', GENDERS, gender, setGender, errors.gender)}

                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <Input
                                    label="Age"
                                    placeholder="Age"
                                    value={age}
                                    onChangeText={setAge}
                                    keyboardType="numeric"
                                    error={errors.age}
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <Input
                                    label="Weight (kg)"
                                    placeholder="Weight"
                                    value={weight}
                                    onChangeText={setWeight}
                                    keyboardType="decimal-pad"
                                    error={errors.weight}
                                />
                            </View>
                        </View>

                        <Input
                            label="Height (cm)"
                            placeholder="Enter your height"
                            value={height}
                            onChangeText={setHeight}
                            keyboardType="decimal-pad"
                            error={errors.height}
                        />

                        {renderSelection('Fitness Goal', GOALS, goal, setGoal, errors.goal)}

                        {renderSelection('Fitness Level', LEVELS, level, setLevel, errors.level)}

                        <Button
                            title="Complete Setup"
                            onPress={handleComplete}
                            loading={loading}
                            style={styles.submitButton}
                        />
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
        marginTop: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.neon,
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    halfInput: {
        flex: 1,
    },
    selectionContainer: {
        marginBottom: SPACING.md,
    },
    selectionTitle: {
        fontSize: TYPOGRAPHY.bodySmall,
        fontWeight: TYPOGRAPHY.medium,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    option: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 2,
        borderColor: COLORS.backgroundCard,
    },
    optionSelected: {
        borderColor: COLORS.neon,
        backgroundColor: COLORS.neon + '20',
    },
    optionText: {
        fontSize: TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        fontWeight: TYPOGRAPHY.medium,
    },
    optionTextSelected: {
        color: COLORS.neon,
    },
    errorText: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
    submitButton: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
    },
});

export default ProfileSetupScreen;
