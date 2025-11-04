// FIX: Changed from interface to type alias to fix Supabase client type inference issues.
export type Instructor = {
  name: string;
  title: string;
  avatarUrl: string;
  bio: string;
};

// FIX: Changed from interface to type alias to fix Supabase client type inference issues.
export type Lesson = {
  title: string;
  duration: string;
};

// FIX: Changed from interface to type alias to fix Supabase client type inference issues.
export type Module = {
  title: string;
  lessons: Lesson[];
};

// FIX: Changed from interface to type alias for consistency to prevent Supabase client type inference issues.
export type Course = {
  id: number;
  title: string;
  instructor: string; // Keep simple name for card
  instructorDetails: Instructor;
  price: string;
  originalPrice?: string; // For discounts
  promotionDeal?: string; // A short text describing the promotion, e.g., "Christmas Sale"
  imageUrl: string;
  rating: number;
  shortDescription: string;
  longDescription: string;
  learningObjectives: string[];
  modules: Module[];
  duration: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  isEnrolled: boolean;
  status: 'available' | 'upcoming';
};

// NEW TYPE: This represents the data structure in the Supabase `courses` table (snake_case)
// FIX: Changed from interface to type alias to fix Supabase client type inference issues.
export type CourseFromSupabase = {
  id: number;
  title: string;
  instructor: string;
  instructor_details: Instructor;
  price: string;
  original_price?: string | null;
  promotion_deal?: string | null;
  image_url: string;
  rating: number;
  short_description: string;
  long_description: string;
  learning_objectives: string[];
  modules: Module[];
  duration: string;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
  is_enrolled: boolean;
  status: 'available' | 'upcoming';
  created_at: string;
};

// FIX: Add explicit Insert/Update types for Supabase to avoid 'never' type inference.
// FIX: Changed from interface to type alias to fix Supabase client type inference issues.
export type CourseInsert = {
  title: string;
  instructor: string;
  instructor_details: Instructor;
  price: string;
  original_price?: string | null;
  promotion_deal?: string | null;
  image_url: string;
  rating: number;
  short_description: string;
  long_description: string;
  learning_objectives: string[];
  modules: Module[];
  duration: string;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
  is_enrolled: boolean;
  status: 'available' | 'upcoming';
};
// FIX: Changed from an interface to a type alias to fix Supabase client type inference issues.
export type CourseUpdate = {
  title?: string;
  instructor?: string;
  instructor_details?: Instructor;
  price?: string;
  original_price?: string | null;
  promotion_deal?: string | null;
  image_url?: string;
  rating?: number;
  short_description?: string;
  long_description?: string;
  learning_objectives?: string[];
  modules?: Module[];
  duration?: string;
  skill_level?: 'Beginner' | 'Intermediate' | 'Advanced';
  is_enrolled?: boolean;
  status?: 'available' | 'upcoming';
};


// FIX: Changed from interface to type alias for consistency to prevent Supabase client type inference issues.
export type Testimonial = {
  id: number;
  name: string;
  course: string;
  quote: string;
  avatarUrl: string;
};

// FIX: Changed from interface to type alias for consistency to prevent Supabase client type inference issues.
export type FAQItem = {
  question: string;
  answer: string;
};

// FIX: Changed from interface to type alias for consistency to prevent Supabase client type inference issues.
export type RegistrationInfo = {
  fullName: string;
  email: string;
  phone: string;
};

export type RegistrationSubmission = RegistrationInfo & {
  turnstileToken: string;
};

// For the new registrations table
// FIX: Changed from interface to type alias to fix Supabase client type inference issues.
export type RegistrationFromSupabase = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  course_id: number;
  created_at: string;
};

// FIX: Changed from an interface to a type alias to fix Supabase client type inference issues.
export type RegistrationInsert = {
  full_name: string;
  email: string;
  phone: string;
  course_id: number;
};
// FIX: Changed from an interface to a type alias to fix Supabase client type inference issues.
export type RegistrationUpdate = {
  full_name?: string;
  email?: string;
  phone?: string;
  course_id?: number;
};

// FIX: Centralize the Database type definition here to ensure consistent type inference for the Supabase client across the application.
// FIX: Changed to a type alias to resolve 'never' type errors in Supabase client operations. This is more consistent with other fixes for Supabase types.
export type Database = {
  public: {
    Tables: {
      courses: {
        Row: CourseFromSupabase;
        // FIX: Add Insert and Update types to provide correct type inference for Supabase client operations and resolve 'never' type errors.
        Insert: CourseInsert;
        Update: CourseUpdate;
        Relationships: [];
      };
      registrations: {
        Row: RegistrationFromSupabase;
        // FIX: Add Insert and Update types to provide correct type inference for Supabase client operations and resolve 'never' type errors.
        Insert: RegistrationInsert;
        Update: RegistrationUpdate;
        Relationships: [];
      }
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
