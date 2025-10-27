
export interface Instructor {
  name: string;
  title: string;
  avatarUrl: string;
  bio: string;
}

export interface Lesson {
  title: string;
  duration: string;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Course {
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
}

export interface Testimonial {
  id: number;
  name: string;
  course: string;
  quote: string;
  avatarUrl: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RegistrationInfo {
  fullName: string;
  email: string;
  phone: string;
}