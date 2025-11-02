import React from 'react';
import type { Course } from '../types';
import { useRouter } from '../App';

interface CourseCardProps {
  course: Course;
}

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);


const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { navigate } = useRouter();
  const isUpcoming = course.status === 'upcoming';

  const handleCourseClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(`#/course/${course.id}`);
  };

  const PriceDisplay: React.FC = () => {
    if (isUpcoming) {
      return <p className="text-lg font-semibold text-[#6D28D9]">Sắp ra mắt</p>;
    }
    if (course.price === 'Miễn phí') {
      return <p className="text-xl font-bold text-green-400">Miễn phí</p>;
    }
    if (course.originalPrice) {
      return (
        <div className="flex items-end gap-2">
          <p className="text-xl font-bold text-amber-400">{course.price}</p>
          <del className="text-sm text-slate-500">{course.originalPrice}</del>
        </div>
      );
    }
    return <p className="text-xl font-bold text-amber-400">{course.price}</p>;
  };

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-lg transition-all duration-300 hover:border-amber-500 hover:-translate-y-2`}>
      <div className="relative aspect-video">
        <img className="h-full w-full object-cover object-center" src={course.imageUrl} alt={course.title} />
        
        {/* --- New Impressive Promotion Seal --- */}
        {course.promotionDeal && (
           <div className="absolute top-3 left-3 w-24 h-24" aria-hidden="true">
             <div className="absolute inset-0 z-10 flex items-center justify-center">
               <div
                 className="absolute h-20 w-20 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-lg flex items-center justify-center text-center text-slate-900 font-bold text-xs uppercase p-2 transition-transform duration-300 group-hover:scale-110"
               >
                 {course.promotionDeal}
               </div>
             </div>
             {/* Ribbon Tails */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24">
                 <div className="absolute bottom-0 left-0 h-10 w-4 -translate-x-1 translate-y-3 rotate-45 transform bg-amber-700/80"></div>
                 <div className="absolute bottom-0 right-0 h-10 w-4 translate-x-1 translate-y-3 -rotate-45 transform bg-amber-700/80"></div>
             </div>
           </div>
        )}

        {course.isEnrolled && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="inline-flex items-center rounded-md bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
              Đã Đăng Ký
            </span>
          </div>
        )}

        {isUpcoming && !course.isEnrolled && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="inline-flex items-center rounded-md bg-violet-700/10 px-3 py-1 text-sm font-medium text-violet-400 ring-1 ring-inset ring-violet-700/20">
              Sắp ra mắt
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-6">
        <h3 className="text-lg font-semibold text-white">
          <a href={`#/course/${course.id}`} onClick={handleCourseClick}>
            <span aria-hidden="true" className="absolute inset-0" />
            {course.title}
          </a>
        </h3>
        <p className="text-sm text-slate-400">bởi {course.instructor}</p>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-5 h-5 ${i < course.rating ? 'text-amber-400' : 'text-slate-600'}`} />
          ))}
        </div>
        <div className="flex flex-1 flex-col justify-end">
          <PriceDisplay />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;