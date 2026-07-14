import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import contactRoutes from '../../routes/contactRoutes.js';
import Contact from '../../models/contact.js';
import nodemailer from 'nodemailer';

vi.mock('../../models/contact.js');

const mockSendMail = vi.fn();
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: mockSendMail,
    })),
  },
}));

describe('Contact Routes', () => {
  let app;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/contact', contactRoutes);
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('POST /api/contact should return 200, save message, and skip email if SMTP not configured', async () => {
    Contact.prototype.save = vi.fn().mockResolvedValue({});
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Message sent successfully' });
    expect(Contact.prototype.save).toHaveBeenCalledTimes(1);
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  it('POST /api/contact should return 200, save message, and send email when SMTP is configured', async () => {
    Contact.prototype.save = vi.fn().mockResolvedValue({});
    mockSendMail.mockResolvedValue({});

    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user@example.com';
    process.env.SMTP_PASS = 'password';
    process.env.EMAIL_TO = 'dhrumintechnotech@gmail.com';

    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Message sent successfully' });
    expect(Contact.prototype.save).toHaveBeenCalledTimes(1);
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'user@example.com',
        pass: 'password',
      },
    });
    expect(mockSendMail).toHaveBeenCalled();
    const mailArgs = mockSendMail.mock.calls[0][0];
    expect(mailArgs.to).toBe('dhrumintechnotech@gmail.com');
    expect(mailArgs.replyTo).toBe('jane@example.com');
    expect(mailArgs.subject).toContain('Jane Doe');
    expect(mailArgs.text).toContain('Hello!');
  });

  it('POST /api/contact should return 200 even if email sending fails', async () => {
    Contact.prototype.save = vi.fn().mockResolvedValue({});
    mockSendMail.mockRejectedValue(new Error('SMTP connection failed'));

    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user@example.com';
    process.env.SMTP_PASS = 'password';

    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Message sent successfully' });
    expect(Contact.prototype.save).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalled();
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

