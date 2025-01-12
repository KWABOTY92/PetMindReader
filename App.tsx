import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from './src/contexts/AppContext';
import LoadingScreen from './src/components/LoadingScreen';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PhotoResultScreen from './src/screens/PhotoResultScreen';
import WelcomeScreen from './src/screens/onboarding/WelcomeScreen';
import FamilyContextScreen from './src/screens/onboarding/FamilyContextScreen';
import PetManagementScreen from './src/screens/onboarding/PetManagementScreen';
import PetDetailsScreen from './src/screens/onboarding/PetDetailsScreen';

import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setHasCompletedOnboarding(hasLaunched === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {!hasCompletedOnboarding ? (
              // Onboarding Flow
              <>
                <Stack.Screen 
                  name="Welcome" 
                  component={WelcomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="FamilyContext" 
                  component={FamilyContextScreen}
                  options={{
                    headerTitle: 'Your Family',
                    headerBackTitle: 'Back',
                  }}
                />
                <Stack.Screen 
                  name="PetManagement" 
                  component={PetManagementScreen}
                  options={{
                    headerTitle: 'Your Pets',
                    headerBackTitle: 'Back',
                  }}
                  initialParams={{
                    onComplete: handleOnboardingComplete,
                  }}
                />
                <Stack.Screen 
                  name="PetDetails" 
                  component={PetDetailsScreen}
                  options={({ route }) => ({
                    headerTitle: route.params?.petId ? 'Edit Pet' : 'Add Pet',
                    headerBackTitle: 'Back',
                  })}
                />
              </>
            ) : (
              // Main App Flow
              <>
                <Stack.Screen 
                  name="Home" 
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="PhotoResult" 
                  component={PhotoResultScreen}
                  options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerTintColor: '#fff',
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;