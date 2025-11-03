import { createClient } from '@supabase/supabase-js';
import type { CourseFromSupabase } from '../types';

// This Database type is a manual representation of what Supabase codegen would create.
// It provides type safety for our specific `courses` table queries.
export type Database = {
  public: {
    Tables: {
      // Use the snake_case type to match the actual DB schema
      courses: {
        Row: CourseFromSupabase; // The type for a SELECT query.
        // FIX: Correctly define Insert and Update types to exclude DB-managed columns.
        // This prevents the Supabase client from inferring `never` for update payloads,
        // which was causing the error in App.tsx.
        Insert: Omit<CourseFromSupabase, 'id' | 'created_at'>; // The type for an INSERT query.
        Update: Partial<Omit<CourseFromSupabase, 'id' | 'created_at'>>; // The type for an UPDATE query.
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const initializeSupabase = () => {
  if (supabaseUrl && supabaseKey) {
    return createClient<Database>(supabaseUrl, supabaseKey);
  }
  console.warn('Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) not set. The application will use static data, and database features will be disabled.');
  return null;
};

export const supabase = initializeSupabase();
