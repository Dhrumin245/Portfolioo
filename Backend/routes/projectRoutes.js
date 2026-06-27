import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Project from '../models/project.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

const createSnapshot = (project) => ({
  label: `Version ${(project.versions?.length || 0) + 1}`,
  title: project.title,
  slug: project.slug,
  category: project.category,
  description: project.description,
  tags: project.tags,
  stack: project.stack,
  image: project.image,
  coverImage: project.coverImage,
  blocks: project.blocks,
  status: project.status,
  savedAt: new Date(),
});

const normalizeProjectPayload = (body) => {
  const slug = body.slug || body.id;

  return {
    title: body.title,
    slug,
    id: body.id || slug,
    category: body.category,
    description: body.description,
    tags: Array.isArray(body.tags) ? body.tags : [],
    stack: Array.isArray(body.stack) ? body.stack : [],
    image: body.image,
    coverImage: body.coverImage || body.image,
    status: body.status === 'published' ? 'published' : 'draft',
    publishedAt: body.status === 'published' ? new Date() : undefined,
    blocks: Array.isArray(body.blocks) ? body.blocks : [],
  };
};

router.post('/upload-image', requireAdmin, async (req, res) => {
  try {
    const { filename, dataUrl } = req.body;
    const match = dataUrl?.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

    if (!filename || !match) {
      return res.status(400).json({ error: 'Valid image data is required' });
    }

    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(filename).toLowerCase() || `.${match[1].split('/')[1]}`;
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`.replace(/[^a-zA-Z0-9.-]/g, '');
    const filePath = path.join(uploadDir, safeName);

    await fs.writeFile(filePath, Buffer.from(match[2], 'base64'));
    res.status(201).json({ url: `/uploads/${safeName}` });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// GET all projects
router.get('/', async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const projects = await Project.find(filter).sort({ updatedAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET project by slug or legacy id
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({
      $or: [{ slug: req.params.slug }, { id: req.params.slug }],
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// CREATE project
router.post('/', requireAdmin, async (req, res) => {

  try {
    const payload = normalizeProjectPayload(req.body);

    if (!payload.title || !payload.slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    const project = await Project.create(payload);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// UPDATE project
router.put('/:slug', requireAdmin, async (req, res) => {
  try {
    const payload = normalizeProjectPayload(req.body);

    if (!payload.title || !payload.slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    const project = await Project.findOne({
      $or: [{ slug: req.params.slug }, { id: req.params.slug }],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.versions = [createSnapshot(project), ...(project.versions || [])].slice(0, 10);
    Object.assign(project, payload);
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.post('/:slug/restore/:versionIndex', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findOne({
      $or: [{ slug: req.params.slug }, { id: req.params.slug }],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const snapshot = project.versions[Number(req.params.versionIndex)];

    if (!snapshot) {
      return res.status(404).json({ error: 'Version not found' });
    }

    project.versions = [createSnapshot(project), ...(project.versions || [])].slice(0, 10);
    project.title = snapshot.title;
    project.slug = snapshot.slug;
    project.id = snapshot.slug;
    project.category = snapshot.category;
    project.description = snapshot.description;
    project.tags = snapshot.tags;
    project.stack = snapshot.stack;
    project.image = snapshot.image;
    project.coverImage = snapshot.coverImage;
    project.blocks = snapshot.blocks;
    project.status = snapshot.status === 'published' ? 'published' : 'draft';
    project.publishedAt = project.status === 'published' ? new Date() : undefined;
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error('Error restoring project:', error);
    res.status(500).json({ error: 'Failed to restore project' });
  }
});

// DELETE project
router.delete('/:slug', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      $or: [{ slug: req.params.slug }, { id: req.params.slug }],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
