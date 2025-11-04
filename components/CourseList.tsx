import React from 'react';
import CourseCard from './CourseCard';
import type { Course } from '../types';
import { useCourses } from '../contexts/CourseContext';

const CourseList: React.FC = () => {
  const { courses } = useCourses();
  
  return (
    <section id="courses" className="py-20 sm:py-24 bg-gray-950/70">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Khóa Học Nổi Bật</h2>
          <p className="mt-4 text-lg text-slate-300">
            Khám phá các khóa học được yêu thích nhất và bắt đầu hành trình của bạn.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseList;