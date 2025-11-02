import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import courseRoutes from './routes/courseRoutes.js';

dotenv.config();

connectDB();

const app = express();

// Enable CORS for all routes to allow frontend requests
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/courses', courseRoutes);

// Basic Error Handling could be added later
// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
