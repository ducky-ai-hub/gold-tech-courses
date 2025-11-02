import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { courses } from './data/courses.js';
import Course from './models/courseModel.js';
import connectDB from './config/db.js';

dotenv.config();

await connectDB();

const importData = async () => {
  try {
    await Course.deleteMany();
    await Course.insertMany(courses);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Course.deleteMany();

    console.log('Data Destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
