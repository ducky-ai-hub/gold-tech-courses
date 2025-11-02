
import React from 'react';
import type { Testimonial } from '../types';
import TestimonialCard from './TestimonialCard';

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'An Nguyễn',
    course: 'ReactJS Toàn Tập',
    quote: 'Khóa học ReactJS thật tuyệt vời! Lộ trình rõ ràng, kiến thức sâu và các dự án thực tế giúp mình tự tin apply vào các công ty lớn. Cảm ơn TechLearn!',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: 2,
    name: 'Bảo Trần',
    course: 'Làm Chủ NodeJS',
    quote: 'Mình đã có thể tự tay xây dựng một backend hoàn chỉnh sau khóa học NodeJS. Giảng viên hỗ trợ rất nhiệt tình, giải đáp mọi thắc mắc của mình.',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
  },
  {
    id: 3,
    name: 'Chi Phạm',
    course: 'DevOps Masterclass',
    quote: 'Kiến thức về DevOps rất rộng, nhưng khóa học đã hệ thống hóa một cách logic. Các bài thực hành với Docker và Kubernetes cực kỳ hữu ích.',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 sm:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Học Viên Nói Gì Về Chúng Tôi</h2>
          <p className="mt-4 text-lg text-slate-300">
            Sự thành công của bạn là niềm tự hào lớn nhất của TechLearn.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
