
import React from 'react';
import type { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <figure className="flex flex-col rounded-2xl bg-slate-900 p-8 border border-slate-800">
        <blockquote className="flex-grow text-slate-300">
            <p>"{testimonial.quote}"</p>
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-4">
            <img className="h-12 w-12 rounded-full object-cover" src={testimonial.avatarUrl} alt={testimonial.name} />
            <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-slate-400">Học viên khóa {testimonial.course}</div>
            </div>
        </figcaption>
    </figure>
  );
};

export default TestimonialCard;