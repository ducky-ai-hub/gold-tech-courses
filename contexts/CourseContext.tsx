import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';
import type { Course, CourseFromSupabase, RegistrationInfo, Database } from '../types';
import { supabase as supabaseFromFile } from '../lib/supabaseClient';
import { courses as staticCourses } from '../data/courses';
import type { SupabaseClient } from '@supabase/supabase-js';
import SupabaseConfigModal from '../components/SupabaseConfigModal';

// Helper function to map data from Supabase (snake_case) to frontend (camelCase)
const mapSupabaseCourseToCourse = (dbCourse: CourseFromSupabase): Course => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
    instructor: dbCourse.instructor,
    instructorDetails: dbCourse.instructor_details,
    price: dbCourse.price,
    originalPrice: dbCourse.original_price ?? undefined,
    promotionDeal: dbCourse.promotion_deal ?? undefined,
    imageUrl: dbCourse.image_url,
    rating: dbCourse.rating,
    shortDescription: dbCourse.short_description,
    longDescription: dbCourse.long_description,
    learningObjectives: dbCourse.learning_objectives,
    modules: dbCourse.modules,
    duration: dbCourse.duration,
    skillLevel: dbCourse.skill_level,
    isEnrolled: dbCourse.is_enrolled,
    status: dbCourse.status,
  };
};


// --- Context Definition ---
interface CourseContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  showConfigModal: boolean;
  enrollInCourse: (id: number) => Promise<void>;
  registerForCourse: (info: RegistrationInfo, courseId: number) => Promise<void>;
  changeConnection: () => void;
}

const CourseContext = createContext<CourseContextType>({
  courses: [],
  loading: true,
  error: null,
  showConfigModal: false,
  enrollInCourse: async () => console.warn('enrollInCourse function called outside of Course context'),
  registerForCourse: async () => console.warn('registerForCourse function called outside of Course context'),
  changeConnection: () => console.warn('changeConnection function called outside of Course context'),
});

// Custom hook for courses
export const useCourses = () => useContext(CourseContext);


// --- Provider Component ---
export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient<Database> | null>(supabaseFromFile);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    if (supabaseClient) {
      fetchCourses(supabaseClient);
    } else {
      setShowConfigModal(true);
      setLoading(false);
    }
  }, [supabaseClient]);

  const fetchCourses = async (client: SupabaseClient<Database>) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await client
        .from('courses')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) {
        const mappedCourses = data.map(mapSupabaseCourseToCourse);
        setCourses(mappedCourses);
      }
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError('Failed to load courses from Supabase. Please check your credentials and connection.');
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: number) => {
    if (!supabaseClient) {
      alert("Enrollment feature is disabled. Database connection not configured.");
      return;
    }

    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId ? { ...course, isEnrolled: true } : course
      )
    );
    
    try {
      const { error } = await supabaseClient
        .from('courses')
        .update({ is_enrolled: true })
        .eq('id', courseId);
      if (error) throw error;
    } catch(err) {
      console.error("Failed to enroll:", err);
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === courseId ? { ...course, isEnrolled: false } : course
        )
      );
      alert("Could not enroll in the course. Please try again.");
      throw err;
    }
  };

  const registerForCourse = async (info: RegistrationInfo, courseId: number) => {
    if (!supabaseClient) {
        throw new Error("Database connection not configured.");
    }
    try {
        const { error } = await supabaseClient
            .from('registrations')
            .insert({
                course_id: courseId,
                email: info.email,
                full_name: info.fullName,
                phone: info.phone
            });
        
        if (error) {
            if (error.code === '23505') {
                throw new Error('Bạn đã đăng ký khóa học này với email này rồi.');
            }
            throw error;
        }
        await enrollInCourse(courseId);
    } catch (err: any) {
        console.error("Failed to register:", err);
        throw new Error(err.message || 'Không thể hoàn tất đăng ký. Vui lòng thử lại.');
    }
  };

  const handleUseStaticData = () => {
    setCourses(staticCourses);
    setShowConfigModal(false);
  };
  
  const handleSupabaseConnect = (client: SupabaseClient<Database>) => {
    setSupabaseClient(client);
    setShowConfigModal(false);
  };
  
  const changeConnection = () => {
    setSupabaseClient(null);
    setShowConfigModal(true);
  }

  const value = {
    courses,
    loading,
    error,
    showConfigModal,
    enrollInCourse,
    registerForCourse,
    changeConnection,
  };

  return (
    <CourseContext.Provider value={value}>
      {showConfigModal 
        ? <SupabaseConfigModal onConnect={handleSupabaseConnect} onUseStaticData={handleUseStaticData} />
        : children
      }
    </CourseContext.Provider>
  );
};
