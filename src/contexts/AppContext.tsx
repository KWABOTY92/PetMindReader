// src/contexts/AppContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  user: null,
  pets: [],
  currentPhoto: null,
  currentThought: null,
};

// Action types
const ActionTypes = {
  SET_USER: 'SET_USER',
  ADD_PET: 'ADD_PET',
  SET_CURRENT_PHOTO: 'SET_CURRENT_PHOTO',
  SET_CURRENT_THOUGHT: 'SET_CURRENT_THOUGHT',
};

// Reducer
function appReducer(state, action) {
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

// Create context
const AppContext = createContext();

// Context provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setUser = (user) => {
    dispatch({ type: ActionTypes.SET_USER, payload: user });
  };

  const addPet = (pet) => {
    dispatch({ type: ActionTypes.ADD_PET, payload: pet });
  };

  const setCurrentPhoto = (photo) => {
    dispatch({ type: ActionTypes.SET_CURRENT_PHOTO, payload: photo });
  };

  const setCurrentThought = (thought) => {
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

// Custom hook for using the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
