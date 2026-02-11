import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true }
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
