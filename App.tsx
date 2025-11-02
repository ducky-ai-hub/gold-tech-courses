import React, { useState, createContext, useContext, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CourseList from './components/CourseList';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import CourseDetailPage from './pages/CourseDetailPage';
import SupabaseConfigModal from './components/SupabaseConfigModal';
// FIX: Import the Footer component to fix "Cannot find name 'Footer'" error.
import Footer from './components/Footer';
import type { Course, CourseFromSupabase } from './types';
import { supabase as supabaseFromFile } from './lib/supabaseClient';
import { courses as staticCourses } from './data/courses';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './lib/supabaseClient';

// Create a context for the router
const RouterContext = createContext<{ navigate: (path: string) => void }>({
  navigate: () => console.warn('Navigate function called outside of Router context'),
});

// Custom hook for router
export const useRouter = () => useContext(RouterContext);

// Create a context for courses
const CourseContext = createContext<{ courses: Course[]; enrollInCourse: (id: number) => Promise<void>; }>({
  courses: [],
  enrollInCourse: async () => console.warn('enrollInCourse function called outside of Course context'),
});

// Custom hook for courses
export const useCourses = () => useContext(CourseContext);

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

const LandingPage: React.FC<{ courses: Course[] }> = ({ courses }) => (
  <>
    <Header />
    <main>
      <Hero />
      <Features />
      <CourseList courses={courses} />
      <Testimonials />
      <FAQ />
      <CTASection />
    </main>
    <Footer />
  </>
);

const App: React.FC = () => {
  const [route, setRoute] = useState('/'); // e.g., '/', '/course/1'
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient<Database> | null>(supabaseFromFile);
  const [showConfigModal, setShowConfigModal] = useState(false);


  useEffect(() => {
    // If client is passed from file (env vars exist), fetch courses.
    // Otherwise, show the modal to let the user decide.
    if (supabaseClient) {
      fetchCourses(supabaseClient);
    } else {
      setShowConfigModal(true);
      setLoading(false); // Stop loading to show the modal
    }
  }, [supabaseClient]); // Rerun when client is set dynamically

  const fetchCourses = async (client: SupabaseClient<Database>) => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await client
          .from('courses')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          // Map the snake_case data from Supabase to camelCase for the UI
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
  
  const handleUseStaticData = () => {
    setCourses(staticCourses);
    setShowConfigModal(false);
  };
  
  // This will be called from the modal
  const handleSupabaseConnect = (client: SupabaseClient<Database>) => {
    setSupabaseClient(client);
    setShowConfigModal(false);
  };


  const navigate = (path: string) => {
    // Links are like '#/', '#/course/1'. We strip '#' to get the route.
    const newRoute = path.substring(1);
    setRoute(newRoute);
    window.scrollTo(0, 0);
  };
  
  const enrollInCourse = async (courseId: number) => {
    if (!supabaseClient) {
      alert("Enrollment feature is disabled. Database connection not configured.");
      return;
    }

    // Optimistically update UI
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId ? { ...course, isEnrolled: true } : course
      )
    );
    
    // Then, update the backend
    try {
      // Use snake_case for the update operation, as expected by the DB schema
      const { error } = await supabaseClient
        .from('courses')
        .update({ is_enrolled: true })
        .eq('id', courseId);

      if (error) {
        throw error;
      }
    } catch(err) {
      console.error("Failed to enroll:", err);
      // Revert UI change on failure
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === courseId ? { ...course, isEnrolled: false } : course
        )
      );
      // Optionally, show an error message to the user
      alert("Could not enroll in the course. Please try again.");
      // Re-throw the error to be caught by the caller if needed
      throw err;
    }
  };

  const renderPage = () => {
    if (route.startsWith('/course/')) {
      const courseId = parseInt(route.replace('/course/', ''), 10);
      if (!isNaN(courseId)) {
        return <CourseDetailPage courseId={courseId} />;
      }
    }
    return <LandingPage courses={courses} />;
  };

  if (showConfigModal) {
    return <SupabaseConfigModal onConnect={handleSupabaseConnect} onUseStaticData={handleUseStaticData} />;
  }

  if (loading) {
    return <div className="h-screen bg-gray-950 flex items-center justify-center text-white text-xl">Loading courses...</div>;
  }

  if (error) {
    return <div className="h-screen bg-gray-950 flex flex-col items-center justify-center text-center text-red-400 text-xl px-4">
      <p>{error}</p>
      <button onClick={() => {
        setSupabaseClient(null);
        setShowConfigModal(true);
      }} className="mt-4 bg-amber-500 text-slate-900 font-semibold py-2 px-4 rounded-lg">
        Change Connection
      </button>
    </div>;
  }

  return (
    <CourseContext.Provider value={{ courses, enrollInCourse }}>
      <RouterContext.Provider value={{ navigate }}>
        <div className="bg-gray-950 font-sans">
          {renderPage()}
        </div>
      </RouterContext.Provider>
    </CourseContext.Provider>
  );
};

export default App;