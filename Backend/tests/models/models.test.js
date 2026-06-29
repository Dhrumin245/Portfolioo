import { describe, it, expect } from 'vitest';
import Contact from '../../models/contact.js';
import Project from '../../models/project.js';
import Resume from '../../models/resume.js';

describe('Mongoose Models Validation', () => {
  describe('Contact Model', () => {
    it('should validate a correct contact object', () => {
      const contact = new Contact({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world',
      });
      const err = contact.validateSync();
      expect(err).toBeUndefined();
    });
  });

  describe('Project Model', () => {
    it('should require title and slug', () => {
      const project = new Project({});
      const err = project.validateSync();
      expect(err.errors.title).toBeDefined();
      expect(err.errors.slug).toBeDefined();
    });

    it('should validate a valid project', () => {
      const project = new Project({
        title: 'Awesome Portfolio',
        slug: 'awesome-portfolio',
        category: 'Web App',
        status: 'published',
      });
      const err = project.validateSync();
      expect(err).toBeUndefined();
      expect(project.status).toBe('published');
    });

    it('should set default status to draft', () => {
      const project = new Project({
        title: 'Awesome Portfolio',
        slug: 'awesome-portfolio',
      });
      expect(project.status).toBe('draft');
    });
  });

  describe('Resume Model', () => {
    it('should require filename, data, and contentType', () => {
      const resume = new Resume({});
      const err = resume.validateSync();
      expect(err.errors.filename).toBeDefined();
      expect(err.errors.data).toBeDefined();
      expect(err.errors.contentType).toBeDefined();
    });
  });
});
