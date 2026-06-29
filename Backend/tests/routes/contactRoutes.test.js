import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import contactRoutes from '../../routes/contactRoutes.js';
import Contact from '../../models/contact.js';

vi.mock('../../models/contact.js');

describe('Contact Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/contact', contactRoutes);
    vi.clearAllMocks();
  });

  it('POST /api/contact should return 200 and success message when message is saved', async () => {
    Contact.prototype.save = vi.fn().mockResolvedValue({});

    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Message sent successfully' });
  });

  it('POST /api/contact should return 500 when database save fails', async () => {
    Contact.prototype.save = vi.fn().mockRejectedValue(new Error('DB connection failed'));

    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello!',
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to send message' });
  });
});
