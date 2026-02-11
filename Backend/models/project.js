import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  image: String
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
