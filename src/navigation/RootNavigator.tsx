import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/theme';

// Auth Screens
import SplashScreen from '../screens/Auth/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import ProfileSetupScreen from '../screens/Auth/ProfileSetupScreen';

// Main Screens
import HomeScreen from '../screens/Home/HomeScreen';
import WorkoutDetailScreen from '../screens/Workout/WorkoutDetailScreen';
import ActiveWorkoutScreen from '../screens/Workout/ActiveWorkoutScreen';
import WorkoutCompleteScreen from '../screens/Workout/WorkoutCompleteScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
import HistoryScreen from '../screens/History/HistoryScreen';
import AccountScreen from '../screens/Account/AccountScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: COLORS.background },
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
);

// Home Stack
const HomeStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: COLORS.background },
        }}>
        <Stack.Screen name="HomeMain" component={HomeScreen} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
        <Stack.Screen name="WorkoutComplete" component={WorkoutCompleteScreen} />
    </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                backgroundColor: COLORS.backgroundCard,
                borderTopColor: COLORS.backgroundSecondary,
                borderTopWidth: 1,
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
            },
            tabBarActiveTintColor: COLORS.neon,
            tabBarInactiveTintColor: COLORS.textTertiary,
            tabBarIcon: ({ color, size }) => {
                let iconName = 'home';

                if (route.name === 'Home') {
                    iconName = 'home';
                } else if (route.name === 'Search') {
                    iconName = 'magnify';
                } else if (route.name === 'Favorites') {
                    iconName = 'heart';
                } else if (route.name === 'History') {
                    iconName = 'history';
                } else if (route.name === 'Account') {
                    iconName = 'account';
                }

                return <Icon name={iconName} size={size} color={color} />;
            },
        })}>
        <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Home' }} />
        <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
        <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
        <Tab.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
);

// Root Navigator
const RootNavigator = () => {
    const { user, userProfile, loading } = useAuth();

    if (loading) {
        return <SplashScreen />;
    }

    // Show ProfileSetup if user exists but no profile
    if (user && !userProfile) {
        return <ProfileSetupScreen />;
    }

    return (
        <NavigationContainer>
            {user ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default RootNavigator;
