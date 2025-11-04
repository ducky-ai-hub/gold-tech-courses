

import { createClient } from '@supabase/supabase-js';
// FIX: Import the Database type from the centralized types file.
import type { Database } from '../types';

/*
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
*/

// The TypeError indicates the values were likely swapped. This ensures the correct
// URL and Key are used for the Supabase client initialization.
//const supabaseUrl = 'https://lxqpasgwibfjxteqjoku.supabase.co';
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cXBhc2d3aWJmanh0ZXFqb2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMzUxMjAsImV4cCI6MjA3NzcxMTEyMH0.d8nUZd-aga39Z6cDFDpes-QSalau5w95_snFWWCeJUA';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const initializeSupabase = () => {
  if (supabaseUrl && supabaseKey) {
    return createClient<Database>(supabaseUrl, supabaseKey);
  }
  console.warn('Supabase environment variables (SUPABASE_URL, SUPABASE_KEY) not set. The application will use static data, and database features will be disabled.');
  return null;
};

export const supabase = initializeSupabase();
