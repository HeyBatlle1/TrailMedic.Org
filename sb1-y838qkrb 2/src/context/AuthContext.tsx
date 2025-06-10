import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  guestMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  guestMode: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  continueAsGuest: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        setGuestMode(false); // Reset guest mode when auth state changes

        // Create profile if user signs up
        if (event === 'SIGNED_UP' && session?.user) {
          await createUserProfile(session.user);
        }
      }
    );

    // Check for guest mode preference
    const savedGuestMode = localStorage.getItem('guestMode');
    if (savedGuestMode === 'true') {
      setGuestMode(true);
      setLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        console.error('Error creating profile:', error);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }
    
    setGuestMode(false);
    localStorage.removeItem('guestMode');
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }
    
    setGuestMode(false);
    localStorage.removeItem('guestMode');
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    
    setGuestMode(false);
    localStorage.removeItem('guestMode');
  };

  const continueAsGuest = () => {
    setGuestMode(true);
    localStorage.setItem('guestMode', 'true');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      guestMode,
      login, 
      signup, 
      logout,
      continueAsGuest
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);