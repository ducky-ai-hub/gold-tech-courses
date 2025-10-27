
import mongoose from 'mongoose';

const lessonSchema = mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
});

const moduleSchema = mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const instructorSchema = mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  bio: { type: String, required: true },
});

const courseSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  instructorDetails: instructorSchema,
  price: { type: String, required: true },
  originalPrice: { type: String },
  promotionDeal: { type: String },
  imageUrl: { type: String, required: true },
  rating: { type: Number, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  learningObjectives: [{ type: String }],
  modules: [moduleSchema],
  duration: { type: String, required: true },
  skillLevel: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  isEnrolled: { type: Boolean, required: true, default: false },
  status: { type: String, required: true, enum: ['available', 'upcoming'] },
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);

export default Course;