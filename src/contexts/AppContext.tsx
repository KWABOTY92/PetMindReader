// src/contexts/AppContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  traits?: {
    suggested: string[];
    custom: string[];
  };
  quirks?: string;
  favoriteThings?: string;
}

interface User {
  id: string;
  name: string;
  familyMembers?: string[];
}

interface Photo {
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
}

interface AppState {
  user: User | null;
  pets: Pet[];
  currentPhoto: Photo | null;
  currentThought: string | null;
}

type AppContextType = {
  state: AppState;
  actions: {
    setUser: (user: User) => void;
    addPet: (pet: Pet) => void;
    updatePet: (pet: Pet) => void;
    deletePet: (petId: string) => void;
    setCurrentPhoto: (photo: Photo) => void;
    setCurrentThought: (thought: string) => void;
  };
};

// Initial State & Storage Keys
const initialState: AppState = {
  user: null,
  pets: [],
  currentPhoto: null,
  currentThought: null,
};

const STORAGE_KEYS = {
  USER: '@pet_thoughts_user',
  PETS: '@pet_thoughts_pets',
};

// Action Types
enum ActionTypes {
  SET_USER = 'SET_USER',
  ADD_PET = 'ADD_PET',
  UPDATE_PET = 'UPDATE_PET',
  DELETE_PET = 'DELETE_PET',
  SET_CURRENT_PHOTO = 'SET_CURRENT_PHOTO',
  SET_CURRENT_THOUGHT = 'SET_CURRENT_THOUGHT',
}

type Action =
  | { type: ActionTypes.SET_USER; payload: User }
  | { type: ActionTypes.ADD_PET; payload: Pet }
  | { type: ActionTypes.UPDATE_PET; payload: Pet }
  | { type: ActionTypes.DELETE_PET; payload: string }
  | { type: ActionTypes.SET_CURRENT_PHOTO; payload: Photo }
  | { type: ActionTypes.SET_CURRENT_THOUGHT; payload: string };

const initializeState = async (): Promise<AppState> => {
  try {
    const [userData, petsData] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.USER),
      AsyncStorage.getItem(STORAGE_KEYS.PETS),
    ]);

    return {
      ...initialState,
      user: userData ? JSON.parse(userData) : null,
      pets: petsData ? JSON.parse(petsData) : [],
    };
  } catch (error) {
    console.error('Error loading initial state:', error);
    return initialState;
  }
};

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  let newState: AppState;

  switch (action.type) {
    case ActionTypes.SET_USER:
      newState = {
        ...state,
        user: action.payload,
      };
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      return newState;

    case ActionTypes.ADD_PET:
      console.log('ADD_PET action received:', action.payload);
      console.log('Current pets:', state.pets);
      newState = {
        ...state,
        pets: [...state.pets, action.payload],
      };
      console.log('New pets array:', newState.pets);
      AsyncStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(newState.pets));
      return newState;

    case ActionTypes.UPDATE_PET:
      newState = {
        ...state,
        pets: state.pets.map(pet =>
          pet.id === action.payload.id ? action.payload : pet
        ),
      };
      AsyncStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(newState.pets));
      return newState;

    case ActionTypes.DELETE_PET:
      newState = {
        ...state,
        pets: state.pets.filter(pet => pet.id !== action.payload),
      };
      AsyncStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(newState.pets));
      return newState;

    case ActionTypes.SET_CURRENT_PHOTO:
      return {
        ...state,
        currentPhoto: action.payload,
      };

    case ActionTypes.SET_CURRENT_THOUGHT:
      return {
        ...state,
        currentThought: action.payload,
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext<AppContextType>({
  state: initialState,
  actions: {
    setUser: () => {},
    addPet: () => {},
    updatePet: () => {},
    deletePet: () => {},
    setCurrentPhoto: () => {},
    setCurrentThought: () => {},
  },
});

// Provider Component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialState = async () => {
      const initializedState = await initializeState();
      if (initializedState.user) {
        dispatch({ type: ActionTypes.SET_USER, payload: initializedState.user });
      }
      if (initializedState.pets.length > 0) {
        initializedState.pets.forEach(pet => {
          dispatch({ type: ActionTypes.ADD_PET, payload: pet });
        });
      }
      setIsLoading(false);
    };

    loadInitialState();
  }, []);

  if (isLoading) {
    return null; // or return a loading component
  }

  const setUser = (user: User) => {
    dispatch({ type: ActionTypes.SET_USER, payload: user });
  };

  const addPet = (pet: Pet) => {
    dispatch({ type: ActionTypes.ADD_PET, payload: pet });
  };

  const updatePet = (pet: Pet) => {
    dispatch({ type: ActionTypes.UPDATE_PET, payload: pet });
  };

  const deletePet = (petId: string) => {
    dispatch({ type: ActionTypes.DELETE_PET, payload: petId });
  };

  const setCurrentPhoto = (photo: Photo) => {
    dispatch({ type: ActionTypes.SET_CURRENT_PHOTO, payload: photo });
  };

  const setCurrentThought = (thought: string) => {
    dispatch({ type: ActionTypes.SET_CURRENT_THOUGHT, payload: thought });
  };

  const value = {
    state,
    actions: {
      setUser,
      addPet,
      updatePet,
      deletePet,
      setCurrentPhoto,
      setCurrentThought,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}