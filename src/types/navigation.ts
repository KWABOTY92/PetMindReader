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
    fromOnboarding?: boolean;
  };

  // Main App Flow
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
};