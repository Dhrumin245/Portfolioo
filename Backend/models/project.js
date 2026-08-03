import mongoose from 'mongoose';

const projectBlockSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const projectVersionSchema = new mongoose.Schema(
  {
    label: String,
    title: String,
    slug: String,
    category: String,
    description: String,
    tags: [String],
    stack: [String],
    image: String,
    coverImage: String,
    coverLayout: { type: String, default: 'side' },
    coverFit: { type: String, default: 'cover' },
    blocks: [projectBlockSchema],
    status: String,
    savedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: String,
  description: { type: String, default: '' },
  tags: [String],
  stack: [String],
  image: String,
  coverImage: String,
  coverLayout: { type: String, default: 'side' },
  coverFit: { type: String, default: 'cover' },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  publishedAt: Date,
  blocks: {
    type: [projectBlockSchema],
    default: [],
  },
  versions: {
    type: [projectVersionSchema],
    default: [],
  },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
