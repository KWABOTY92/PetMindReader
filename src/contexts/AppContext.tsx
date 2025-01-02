// src/contexts/AppContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  color?: string;
  features?: string[];
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
    setCurrentPhoto: (photo: Photo) => void;
    setCurrentThought: (thought: string) => void;
  };
};

const initialState: AppState = {
  user: null,
  pets: [],
  currentPhoto: null,
  currentThought: null,
};

enum ActionTypes {
  SET_USER = 'SET_USER',
  ADD_PET = 'ADD_PET',
  SET_CURRENT_PHOTO = 'SET_CURRENT_PHOTO',
  SET_CURRENT_THOUGHT = 'SET_CURRENT_THOUGHT',
}

type Action =
  | { type: ActionTypes.SET_USER; payload: User }
  | { type: ActionTypes.ADD_PET; payload: Pet }
  | { type: ActionTypes.SET_CURRENT_PHOTO; payload: Photo }
  | { type: ActionTypes.SET_CURRENT_THOUGHT; payload: string };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case ActionTypes.ADD_PET:
      return {
        ...state,
        pets: [...state.pets, action.payload],
      };
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

// Create context with initial undefined value
const AppContext = createContext<AppContextType>({
  state: initialState,
  actions: {
    setUser: () => {},
    addPet: () => {},
    setCurrentPhoto: () => {},
    setCurrentThought: () => {},
  },
});

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setUser = (user: User) => {
    dispatch({ type: ActionTypes.SET_USER, payload: user });
  };

  const addPet = (pet: Pet) => {
    dispatch({ type: ActionTypes.ADD_PET, payload: pet });
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
      setCurrentPhoto,
      setCurrentThought,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}