import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/resume', resumeRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  })
  // .then(() => {
  //   console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  // .catch((err) => {
  //   console.error('MongoDB connection error:', err.message);
  // });

