import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, InjuryData, EmergencyContact } from '../types';
import { useAuth } from './AuthContext';
import { 
  getUserAssessments, 
  getEmergencyContacts, 
  saveAssessment, 
  saveEmergencyContact, 
  deleteEmergencyContact,
  updateAssessment
} from '../services/database';

// Initial state with empty arrays
const initialState: AppState = {
  currentInjury: null,
  injuryHistory: [],
  emergencyContacts: [],
  isOffline: !navigator.onLine
};

type Action =
  | { type: 'SET_CURRENT_INJURY'; payload: InjuryData | null }
  | { type: 'ADD_INJURY'; payload: InjuryData }
  | { type: 'UPDATE_INJURY'; payload: InjuryData }
  | { type: 'ADD_CONTACT'; payload: EmergencyContact }
  | { type: 'REMOVE_CONTACT'; payload: string }
  | { type: 'SET_OFFLINE_STATUS'; payload: boolean }
  | { type: 'LOAD_STORED_DATA'; payload: Partial<AppState> }
  | { type: 'SET_INJURY_HISTORY'; payload: InjuryData[] }
  | { type: 'SET_EMERGENCY_CONTACTS'; payload: EmergencyContact[] };

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_INJURY':
      return {
        ...state,
        currentInjury: action.payload
      };
    case 'ADD_INJURY': {
      const newHistory = Array.isArray(state.injuryHistory) 
        ? [action.payload, ...state.injuryHistory]
        : [action.payload];
      
      return {
        ...state,
        injuryHistory: newHistory,
        currentInjury: action.payload
      };
    }
    case 'UPDATE_INJURY': {
      const updatedHistory = Array.isArray(state.injuryHistory)
        ? state.injuryHistory.map(injury =>
            injury.id === action.payload.id ? action.payload : injury
          )
        : [action.payload];
      
      return {
        ...state,
        injuryHistory: updatedHistory,
        currentInjury: state.currentInjury?.id === action.payload.id
          ? action.payload
          : state.currentInjury
      };
    }
    case 'ADD_CONTACT': {
      const newContacts = Array.isArray(state.emergencyContacts)
        ? [...state.emergencyContacts, action.payload]
        : [action.payload];
      
      return {
        ...state,
        emergencyContacts: newContacts
      };
    }
    case 'REMOVE_CONTACT': {
      const filteredContacts = Array.isArray(state.emergencyContacts)
        ? state.emergencyContacts.filter(contact => contact.id !== action.payload)
        : [];
      
      return {
        ...state,
        emergencyContacts: filteredContacts
      };
    }
    case 'SET_OFFLINE_STATUS':
      return {
        ...state,
        isOffline: action.payload
      };
    case 'LOAD_STORED_DATA':
      return {
        ...state,
        ...action.payload,
        injuryHistory: Array.isArray(action.payload.injuryHistory) 
          ? action.payload.injuryHistory 
          : [],
        emergencyContacts: Array.isArray(action.payload.emergencyContacts)
          ? action.payload.emergencyContacts
          : []
      };
    case 'SET_INJURY_HISTORY':
      return {
        ...state,
        injuryHistory: Array.isArray(action.payload) ? action.payload : []
      };
    case 'SET_EMERGENCY_CONTACTS':
      return {
        ...state,
        emergencyContacts: Array.isArray(action.payload) ? action.payload : []
      };
    default:
      return state;
  }
};

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Database operations
  saveInjuryToDatabase: (injury: InjuryData) => Promise<void>;
  saveContactToDatabase: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  removeContactFromDatabase: (contactId: string) => Promise<void>;
  updateInjuryInDatabase: (injury: InjuryData) => Promise<void>;
  loadUserData: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, guestMode } = useAuth();

  // Load user data when authenticated
  useEffect(() => {
    if (user && !guestMode) {
      loadUserData();
    } else if (guestMode || !user) {
      // Load from localStorage for guest mode or when not authenticated
      loadLocalData();
    }
  }, [user, guestMode]);

  // Load data from localStorage
  const loadLocalData = () => {
    try {
      const storedInjuryHistory = localStorage.getItem('injuryHistory');
      const storedEmergencyContacts = localStorage.getItem('emergencyContacts');
      
      const loadedData: Partial<AppState> = {};
      
      if (storedInjuryHistory) {
        loadedData.injuryHistory = JSON.parse(storedInjuryHistory);
      }
      
      if (storedEmergencyContacts) {
        loadedData.emergencyContacts = JSON.parse(storedEmergencyContacts);
      }
      
      if (Object.keys(loadedData).length > 0) {
        dispatch({ type: 'LOAD_STORED_DATA', payload: loadedData });
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  // Handle online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => {
      dispatch({ type: 'SET_OFFLINE_STATUS', payload: !navigator.onLine });
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [assessments, contacts] = await Promise.all([
        getUserAssessments(),
        getEmergencyContacts()
      ]);

      dispatch({ type: 'SET_INJURY_HISTORY', payload: assessments });
      dispatch({ type: 'SET_EMERGENCY_CONTACTS', payload: contacts });
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to localStorage if database fails
      loadLocalData();
    }
  };

  const saveInjuryToDatabase = async (injury: InjuryData) => {
    try {
      // Always save to localStorage first
      const currentHistory = state.injuryHistory;
      const newHistory = [injury, ...currentHistory];
      localStorage.setItem('injuryHistory', JSON.stringify(newHistory));
      
      // Try to save to database if user is authenticated
      if (user && !guestMode) {
        await saveAssessment(injury);
      }
      
      dispatch({ type: 'ADD_INJURY', payload: injury });
    } catch (error) {
      console.error('Error saving injury:', error);
      // Still update local state even if database fails
      dispatch({ type: 'ADD_INJURY', payload: injury });
    }
  };

  const updateInjuryInDatabase = async (injury: InjuryData) => {
    try {
      // Always update localStorage
      const updatedHistory = state.injuryHistory.map(item =>
        item.id === injury.id ? injury : item
      );
      localStorage.setItem('injuryHistory', JSON.stringify(updatedHistory));
      
      // Try to update database if user is authenticated
      if (user && !guestMode) {
        await updateAssessment(injury);
      }
      
      dispatch({ type: 'UPDATE_INJURY', payload: injury });
    } catch (error) {
      console.error('Error updating injury:', error);
      // Still update local state even if database fails
      dispatch({ type: 'UPDATE_INJURY', payload: injury });
    }
  };

  const saveContactToDatabase = async (contact: Omit<EmergencyContact, 'id'>) => {
    try {
      let contactId: string;
      
      // Try to save to database if user is authenticated
      if (user && !guestMode) {
        contactId = await saveEmergencyContact(contact);
      } else {
        contactId = Date.now().toString();
      }
      
      const newContact: EmergencyContact = { ...contact, id: contactId };
      
      // Always save to localStorage
      const currentContacts = state.emergencyContacts;
      const newContacts = [...currentContacts, newContact];
      localStorage.setItem('emergencyContacts', JSON.stringify(newContacts));
      
      dispatch({ type: 'ADD_CONTACT', payload: newContact });
    } catch (error) {
      console.error('Error saving contact:', error);
      // Save to localStorage only if database fails
      const newContact: EmergencyContact = { ...contact, id: Date.now().toString() };
      const currentContacts = state.emergencyContacts;
      const newContacts = [...currentContacts, newContact];
      localStorage.setItem('emergencyContacts', JSON.stringify(newContacts));
      dispatch({ type: 'ADD_CONTACT', payload: newContact });
    }
  };

  const removeContactFromDatabase = async (contactId: string) => {
    try {
      // Try to remove from database if user is authenticated
      if (user && !guestMode) {
        await deleteEmergencyContact(contactId);
      }
      
      // Always remove from localStorage
      const filteredContacts = state.emergencyContacts.filter(contact => contact.id !== contactId);
      localStorage.setItem('emergencyContacts', JSON.stringify(filteredContacts));
      
      dispatch({ type: 'REMOVE_CONTACT', payload: contactId });
    } catch (error) {
      console.error('Error removing contact:', error);
      // Remove from localStorage only if database fails
      const filteredContacts = state.emergencyContacts.filter(contact => contact.id !== contactId);
      localStorage.setItem('emergencyContacts', JSON.stringify(filteredContacts));
      dispatch({ type: 'REMOVE_CONTACT', payload: contactId });
    }
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch,
      saveInjuryToDatabase,
      saveContactToDatabase,
      removeContactFromDatabase,
      updateInjuryInDatabase,
      loadUserData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};