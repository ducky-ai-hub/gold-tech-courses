import express from 'express';
const router = express.Router();
import { getCourses, getCourseById } from '../controllers/courseController.js';

router.route('/').get(getCourses);
router.route('/:id').get(getCourseById);

export default router;
