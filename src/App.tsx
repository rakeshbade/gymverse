import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <WorkoutProvider>
                        <RootNavigator />
                    </WorkoutProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default App;
