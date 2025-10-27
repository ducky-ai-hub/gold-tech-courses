
import React, { useState, createContext, useContext, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CourseList from './components/CourseList';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import CourseDetailPage from './pages/CourseDetailPage';
import type { Course } from './types';
import { courses as courseData } from './data/courses'; // Import dữ liệu trực tiếp

// Create a context for the router
const RouterContext = createContext<{ navigate: (path: string) => void }>({
  navigate: () => console.warn('Navigate function called outside of Router context'),
});

// Custom hook for router
export const useRouter = () => useContext(RouterContext);

// Create a context for courses
const CourseContext = createContext<{ courses: Course[]; enrollInCourse: (id: number) => void; }>({
  courses: [],
  enrollInCourse: () => console.warn('enrollInCourse function called outside of Course context'),
});

// Custom hook for courses
export const useCourses = () => useContext(CourseContext);


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
  const [courses, setCourses] = useState<Course[]>(courseData); // Sử dụng dữ liệu tĩnh

  const navigate = (path: string) => {
    // Links are like '#/', '#/course/1'. We strip '#' to get the route.
    const newRoute = path.substring(1);
    setRoute(newRoute);
    window.scrollTo(0, 0);
  };
  
  const enrollInCourse = (courseId: number) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId ? { ...course, isEnrolled: true } : course
      )
    );
  };
  
  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash || '#/';
        navigate(hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    // Initial route setup
    handleHashChange();

    return () => {
        window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);


  const renderPage = () => {
    if (route.startsWith('/course/')) {
      const courseId = parseInt(route.replace('/course/', ''), 10);
      if (!isNaN(courseId)) {
        return <CourseDetailPage courseId={courseId} />;
      }
    }
    return <LandingPage courses={courses} />;
  };

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