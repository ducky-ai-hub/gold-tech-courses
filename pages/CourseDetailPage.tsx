import React, { useState } from 'react';
import type { Course, Module, RegistrationInfo } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegistrationModal from '../components/RegistrationModal';
import { useRouter } from '../contexts/RouterContext';
import { useCourses } from '../contexts/CourseContext';

// --- Icons ---
const StarIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ChevronUpIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
const ClockIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ChartBarIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);


// --- Sub Components ---
const WhatYouWillLearn: React.FC<{ objectives: string[] }> = ({ objectives }) => (
    <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Bạn sẽ học được gì?</h2>
        <div className="p-8 border border-slate-800 rounded-2xl bg-slate-900">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {objectives.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                        <span className="text-slate-300">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const CourseContentModule: React.FC<{ module: Module, index: number, openIndex: number | null, setOpenIndex: (index: number | null) => void }> = ({ module, index, openIndex, setOpenIndex }) => {
    const isOpen = index === openIndex;
    const toggleOpen = () => setOpenIndex(isOpen ? null : index);

    
    return (
        <div className="border-b border-slate-800 last:border-b-0">
            <button
                onClick={toggleOpen}
                className="w-full flex justify-between items-center py-4 text-left gap-4"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-medium text-white">{module.title}</h3>
                <span className="flex-shrink-0">
                  {isOpen ? <ChevronUpIcon className="w-5 h-5 text-amber-400"/> : <ChevronDownIcon className="w-5 h-5 text-slate-400" />}
                </span>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <ul className="pt-2 pb-4 pl-4 pr-4 space-y-3">
                    {module.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="flex items-center justify-between text-slate-400 gap-4">
                           <span>{lesson.title}</span>
                           <span className="text-sm flex-shrink-0">{lesson.duration}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const CourseContent: React.FC<{ modules: Module[] }> = ({ modules }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Nội dung khóa học</h2>
            <div className="border border-slate-800 rounded-2xl bg-slate-900">
                {modules.map((module, index) => (
                    <CourseContentModule key={index} module={module} index={index} openIndex={openIndex} setOpenIndex={setOpenIndex} />
                ))}
            </div>
        </div>
    );
};

const InstructorProfile: React.FC<{ course: Course }> = ({ course }) => (
    <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Giảng viên</h2>
        <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <img className="h-20 w-20 rounded-full object-cover flex-shrink-0" src={course.instructorDetails.avatarUrl} alt={course.instructorDetails.name} />
            <div>
                <h3 className="text-xl font-bold text-white">{course.instructorDetails.name}</h3>
                <p className="text-amber-400">{course.instructorDetails.title}</p>
                <p className="mt-2 text-slate-300">{course.instructorDetails.bio}</p>
            </div>
        </div>
    </div>
);

const CoursePurchaseCard: React.FC<{ course: Course }> = ({ course }) => {
    const { registerForCourse } = useCourses();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registrationError, setRegistrationError] = useState<string | null>(null);

    const isUpcoming = course.status === 'upcoming';
    const isFree = course.price === 'Miễn phí';

    const handleFormSubmit = async (data: RegistrationInfo) => {
        setRegistrationError(null); // Clear previous errors
        try {
            await registerForCourse(data, course.id);
            setIsModalOpen(false); // Close modal on success
            console.log("Registration successful!");
        } catch (error: any) {
            console.error("Registration failed in component:", error);
            setRegistrationError(error.message);
            // Re-throw to prevent modal from closing if onSubmit has its own finally block
            throw error;
        }
    };
    
    const renderPrice = () => {
        if (isUpcoming) {
            return <p className="text-xl text-slate-400">Sắp ra mắt</p>;
        }
        if (course.originalPrice) {
            return (
                <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold text-white">{course.price}</p>
                    <del className="text-xl text-slate-500">{course.originalPrice}</del>
                </div>
            );
        }
        return <p className="text-3xl font-bold text-white">{course.price}</p>;
    };

    const renderButton = () => {
        if (course.isEnrolled) {
            return (
                <button disabled className="w-full text-center flex items-center justify-center gap-2 bg-green-600/50 text-white font-semibold py-3 px-8 rounded-lg cursor-not-allowed">
                    <CheckCircleIcon className="w-6 h-6" />
                    Đã Đăng Ký
                </button>
            );
        }
        if (isUpcoming) {
            return (
                <button onClick={() => setIsModalOpen(true)} className="w-full text-center block bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
                    Tham gia Waitlist
                </button>
            );
        }
        return (
            <button onClick={() => setIsModalOpen(true)} className="w-full text-center block bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
                {isFree ? 'Đăng Ký Miễn Phí' : 'Đăng Ký Học'}
            </button>
        );
    };

    return (
      <>
        <RegistrationModal
            courseTitle={course.title}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setRegistrationError(null); // Clear error when closing modal
            }}
            onSubmit={handleFormSubmit}
            error={registrationError}
        />
        <div className="sticky top-28">
            <div className="border border-slate-800 rounded-2xl bg-slate-900 overflow-hidden">
                <img src={course.imageUrl} alt={course.title} className="w-full h-56 object-cover" />
                <div className="p-6 space-y-4">
                    {course.promotionDeal && (
                        <div className="inline-flex items-center rounded-md bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
                            {course.promotionDeal}
                        </div>
                    )}
                    {renderPrice()}
                    {renderButton()}
                    <ul className="space-y-3 pt-2">
                        <li className="flex items-center gap-3 text-slate-300">
                            <ClockIcon />
                            <span>Thời lượng: {course.duration}</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <ChartBarIcon />
                            <span>Trình độ: {course.skillLevel}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </>
    );
};


// --- Main Page Component ---
const CourseDetailPage: React.FC<{ courseId: number }> = ({ courseId }) => {
  const { navigate } = useRouter();
  const { courses } = useCourses();
  const course = courses.find((c) => c.id === courseId);

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('#/');
  };

  if (!course) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-4xl font-bold text-white">404 - Không Tìm Thấy Khóa Học</h1>
            <p className="mt-4 text-slate-300">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <a href="#/" onClick={handleBackClick} className="mt-8 inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 px-6 rounded-lg">
                Về Trang Chủ
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <div className="bg-slate-900">
            <div className="container mx-auto px-6 py-12 md:py-16">
                <a href="#/" onClick={handleBackClick} className="text-amber-400 hover:text-amber-300 mb-6 inline-block">&larr; Quay lại tất cả khóa học</a>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">{course.title}</h1>
                <p className="mt-4 text-lg text-slate-300 max-w-3xl">{course.shortDescription}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <p className="text-slate-300">bởi <span className="font-bold text-white">{course.instructor}</span></p>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-5 h-5 ${i < course.rating ? 'text-amber-400' : 'text-slate-600'}`} />
                        ))}
                        <span className="text-slate-300 ml-1">({course.rating}.0)</span>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
                <div className="lg:col-span-2">
                    <WhatYouWillLearn objectives={course.learningObjectives} />
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Mô tả chi tiết</h2>
                        <p className="text-slate-300 whitespace-pre-line">{course.longDescription}</p>
                    </div>
                    {course.status !== 'upcoming' && <CourseContent modules={course.modules} />}
                    <InstructorProfile course={course} />
                </div>
                <div className="lg:col-span-1">
                    <CoursePurchaseCard course={course} />
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CourseDetailPage;