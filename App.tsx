import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CourseList from './components/CourseList';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import CourseDetailPage from './pages/CourseDetailPage';
import Footer from './components/Footer';
import { useCourses } from './contexts/CourseContext';
import { useRouter } from './contexts/RouterContext';

const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        {/* FIX: The CourseList component fetches its own data via the useCourses hook.
            Passing the 'courses' prop is unnecessary and causes a type error. */}
        <CourseList />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  const { route } = useRouter();
  const { loading, error, changeConnection } = useCourses();

  const renderPage = () => {
    if (route.startsWith('/course/')) {
      const courseId = parseInt(route.replace('/course/', ''), 10);
      if (!isNaN(courseId)) {
        return <CourseDetailPage courseId={courseId} />;
      }
    }
    return <LandingPage />;
  };

  if (loading) {
    return <div className="h-screen bg-gray-950 flex items-center justify-center text-white text-xl">Loading courses...</div>;
  }

  if (error) {
    return <div className="h-screen bg-gray-950 flex flex-col items-center justify-center text-center text-red-400 text-xl px-4">
      <p>{error}</p>
      <button 
        onClick={changeConnection} 
        className="mt-4 bg-amber-500 text-slate-900 font-semibold py-2 px-4 rounded-lg"
      >
        Change Connection
      </button>
    </div>;
  }

  return (
    <div className="bg-gray-950 font-sans">
      {renderPage()}
    </div>
  );
};

export default App;