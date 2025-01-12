// src/types/navigation.ts

export type RootStackParamList = {
  // Onboarding Flow
  Welcome: undefined;
  FamilyContext: undefined;
  PetManagement: {
    onComplete?: () => Promise<void>;
  };
  PetDetails: {
    petId: string | null;  // null when adding new pet
  };

  // Main App Flow
  Home: undefined;
  PhotoResult: {
    photoUri: string;
    base64?: string;
    width?: number;
    height?: number;
  };
};