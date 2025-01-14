// App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/contexts/AppContext';
import LoadingScreen from './src/components/LoadingScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainStack from './src/navigation/MainStack';

const STORAGE_KEYS = {
  SETUP_COMPLETE: '@setup_complete',
  USER_DATA: '@pet_thoughts_user',
  PETS_DATA: '@pet_thoughts_pets'
};

function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Welcome' | 'Home'>('Welcome');

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const setupComplete = await AsyncStorage.getItem(STORAGE_KEYS.SETUP_COMPLETE);

      if (setupComplete === 'true') {
        setInitialRoute('Home');
      } else {
        setInitialRoute('Welcome');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking setup status:', error);
      setInitialRoute('Welcome');
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <MainStack initialRouteName={initialRoute} />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;