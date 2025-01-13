import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from './src/contexts/AppContext';
import LoadingScreen from './src/components/LoadingScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PhotoPreviewScreen from './src/screens/PhotoPreviewScreen';
import PhotoResultScreen from './src/screens/PhotoResultScreen';
import WelcomeScreen from './src/screens/onboarding/WelcomeScreen';
import FamilyContextScreen from './src/screens/onboarding/FamilyContextScreen';
import PetManagementScreen from './src/screens/onboarding/PetManagementScreen';
import PetDetailsScreen from './src/screens/onboarding/PetDetailsScreen';
import YourPetsWorldScreen from './src/screens/YourPetsWorldScreen';

import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const STORAGE_KEYS = {
  HAS_LAUNCHED: 'hasLaunched',
  STALE_DATA: 'hasStaleData',
  USER_DATA: '@pet_thoughts_user',
  PETS_DATA: '@pet_thoughts_pets'
};

function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // Clear stale data if needed
        const hasStaleData = await AsyncStorage.getItem(STORAGE_KEYS.STALE_DATA);
        if (hasStaleData === 'true') {
          await AsyncStorage.multiRemove([
            STORAGE_KEYS.HAS_LAUNCHED,
            STORAGE_KEYS.USER_DATA,
            STORAGE_KEYS.PETS_DATA
          ]);
        }

        const [hasLaunched, userData, petsData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.HAS_LAUNCHED),
          AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
          AsyncStorage.getItem(STORAGE_KEYS.PETS_DATA)
        ]);

        const isComplete = hasLaunched === 'true' && 
                          userData !== null && 
                          petsData !== null;
        
        console.log('Onboarding status:', {
          hasLaunched,
          hasUserData: userData !== null,
          hasPetsData: petsData !== null,
          isComplete
        });

        setHasCompletedOnboarding(isComplete);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasCompletedOnboarding(false);
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.HAS_LAUNCHED, 'true'],
        [STORAGE_KEYS.STALE_DATA, 'false']
      ]);
      
      // Force reload of App state
      setHasCompletedOnboarding(true);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return Promise.reject(error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
              headerShown: true,
              headerBackTitle: 'Back',
            }}>
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
                    options={{ headerTitle: 'Your Magical Circle' }}
                  />
                  <Stack.Screen 
                    name="PetManagement" 
                    component={PetManagementScreen}
                    options={{ headerTitle: 'Your Magical Companions' }}
                    initialParams={{ onComplete: handleOnboardingComplete }}
                  />
                  <Stack.Screen 
                    name="PetDetails" 
                    component={PetDetailsScreen}
                    options={({ route }) => ({
                      headerTitle: route.params?.petId ? 'Edit Companion' : 'Add Companion',
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
                    name="YourPetsWorld" 
                    component={YourPetsWorldScreen}
                    options={{ headerTitle: "Your Pet's World" }}
                  />
                  <Stack.Screen 
                    name="PetManagement" 
                    component={PetManagementScreen}
                    options={{ headerTitle: 'Magical Companions' }}
                  />
                  <Stack.Screen 
                    name="FamilyContext" 
                    component={FamilyContextScreen}
                    options={{ headerTitle: 'Their Human Circle' }}
                  />
                  <Stack.Screen 
                    name="PetDetails" 
                    component={PetDetailsScreen}
                    options={({ route }) => ({
                      headerTitle: route.params?.petId ? 'Edit Companion' : 'Add Companion',
                    })}
                  />
                  <Stack.Screen 
                    name="PhotoPreview" 
                    component={PhotoPreviewScreen}
                    options={{
                      headerTitle: '',
                      headerTransparent: true,
                      headerTintColor: '#fff',
                    }}
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
    </GestureHandlerRootView>
  );
}

export default App;