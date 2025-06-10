import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Supabase configuration for tiny-rice-99861620 project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tiny-rice-99861620.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  return 'An unexpected error occurred';
};

// Test connection function
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Initialize auth state
export const initializeAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth initialization error:', error);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Auth initialization failed:', error);
    return null;
  }
};