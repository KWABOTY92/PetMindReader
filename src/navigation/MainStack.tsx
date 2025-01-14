// src/navigation/MainStack.tsx
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PhotoPreviewScreen from '../screens/PhotoPreviewScreen';
import PhotoResultScreen from '../screens/PhotoResultScreen';
import YourPetsWorldScreen from '../screens/YourPetsWorldScreen';
import WelcomeScreen from '../screens/setup/WelcomeScreen';
import FamilyContextScreen from '../screens/setup/FamilyContextScreen';
import PetManagementScreen from '../screens/setup/PetManagementScreen';
import PetDetailsScreen from '../screens/setup/PetDetailsScreen';

// Define our stack param types
export type MainStackParamList = {
  Welcome: undefined;
  Home: undefined;
  YourPetsWorld: undefined;
  PhotoPreview: {
    photoUri: string;
    base64?: string;
    width?: number;
    height?: number;
  };
  PhotoResult: {
    photoUri: string;
    base64?: string;
    width?: number;
    height?: number;
  };
  PetManagement: {
    fromSetup?: boolean;
  };
  PetDetails: {
    petId: string | null;
    fromSetup?: boolean;
  };
  FamilyContext: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

interface MainStackProps {
    initialRouteName: 'Welcome' | 'Home';
  }
  

  function MainStack({ initialRouteName }: MainStackProps) {
    return (
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: true,
          headerBackTitle: 'Back',
        }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
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
    </Stack.Navigator>
  );
}

export default MainStack;