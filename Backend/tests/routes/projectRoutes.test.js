import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import projectRoutes from '../../routes/projectRoutes.js';
import Project from '../../models/project.js';

vi.mock('../../models/project.js');

describe('Project Routes', () => {
  let app;
  const ADMIN_KEY = 'test-admin-key';

  beforeEach(() => {
    process.env.ADMIN_API_KEY = ADMIN_KEY;
    app = express();
    app.use(express.json({ limit: '15mb' }));
    app.use('/api/projects', projectRoutes);
    vi.clearAllMocks();
  });

  describe('GET /api/projects', () => {
    it('should return a list of projects', async () => {
      const mockProjects = [
        { title: 'Project 1', slug: 'project-1' },
        { title: 'Project 2', slug: 'project-2' },
      ];
      Project.find = vi.fn().mockReturnValue({
        sort: vi.fn().mockResolvedValue(mockProjects),
      });

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProjects);
    });

    it('should return 500 when fetch fails', async () => {
      Project.find = vi.fn().mockReturnValue({
        sort: vi.fn().mockRejectedValue(new Error('Fetch error')),
      });

      const response = await request(app).get('/api/projects');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch projects' });
    });
  });

  describe('GET /api/projects/:slug', () => {
    it('should return a single project if found', async () => {
      const mockProject = { title: 'Project 1', slug: 'project-1' };
      Project.findOne = vi.fn().mockResolvedValue(mockProject);

      const response = await request(app).get('/api/projects/project-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProject);
    });

    it('should return 404 if project is not found', async () => {
      Project.findOne = vi.fn().mockResolvedValue(null);

      const response = await request(app).get('/api/projects/non-existent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Project not found' });
    });
  });

  describe('POST /api/projects', () => {
    it('should return 401 if unauthorized', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({ title: 'New Project', slug: 'new-project' });

      expect(response.status).toBe(401);
    });

    it('should return 400 if title or slug is missing', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('x-admin-api-key', ADMIN_KEY)
        .send({ description: 'No title or slug' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Title and slug are required' });
    });

    it('should create a project successfully when authorized', async () => {
      const newProj = { title: 'New Project', slug: 'new-project', status: 'draft' };
      Project.create = vi.fn().mockResolvedValue(newProj);

      const response = await request(app)
        .post('/api/projects')
        .set('x-admin-api-key', ADMIN_KEY)
        .send({ title: 'New Project', slug: 'new-project' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newProj);
    });
  });

  describe('DELETE /api/projects/:slug', () => {
    it('should delete a project if found and authorized', async () => {
      Project.findOneAndDelete = vi.fn().mockResolvedValue({ slug: 'project-1' });

      const response = await request(app)
        .delete('/api/projects/project-1')
        .set('x-admin-api-key', ADMIN_KEY);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Project deleted' });
    });
  });
});
