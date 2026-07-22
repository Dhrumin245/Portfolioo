import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import dns from 'dns';
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

const mockResendSend = vi.fn();
vi.mock('resend', () => ({
  Resend: class {
    constructor() {
      this.emails = {
        send: mockResendSend,
      };
    }
  },
}));

vi.mock('dns', () => ({
  default: {
    promises: {
      resolveMx: vi.fn(),
    },
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
    // Default valid MX resolution for jane@example.com
    dns.promises.resolveMx.mockResolvedValue([{ exchange: 'mail.example.com', priority: 10 }]);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('POST /api/contact should return 400 when email is invalid format or domain does not exist', async () => {
    const err = new Error('Domain not found');
    err.code = 'ENOTFOUND';
    dns.promises.resolveMx.mockRejectedValue(err);

    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Bad Email',
        email: 'invalid-email-or-fake-domain.fake',
        message: 'Hello!',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Please provide a valid, authentic email address.' });
    expect(Contact.prototype.save).not.toHaveBeenCalled();
  });

  it('POST /api/contact should return 200, save message, and skip email if neither Resend nor SMTP configured', async () => {
    Contact.prototype.save = vi.fn().mockResolvedValue({});
    delete process.env.RESEND_API_KEY;
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
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it('POST /api/contact should return 200, save message, and send email via Resend when RESEND_API_KEY is configured', async () => {
    Contact.prototype.save = vi.fn().mockResolvedValue({});
    mockResendSend.mockResolvedValue({ data: { id: 'resend_123' }, error: null });

    process.env.RESEND_API_KEY = 're_test_key_123';
    process.env.RESEND_FROM_EMAIL = 'onboarding@resend.dev';
    process.env.EMAIL_TO = 'dhrumintechnotech@gmail.com';

    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello via Resend!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Message sent successfully' });
    expect(Contact.prototype.save).toHaveBeenCalledTimes(1);
    expect(mockResendSend).toHaveBeenCalledWith({
      from: '"Jane Doe via Portfolio" <onboarding@resend.dev>',
      to: 'dhrumintechnotech@gmail.com',
      replyTo: 'jane@example.com',
      subject: 'New Portfolio Project Brief from Jane Doe',
      text: expect.stringContaining('Hello via Resend!'),
      html: expect.stringContaining('Jane Doe'),
    });
  });

  it('POST /api/contact should fallback to Nodemailer SMTP if Resend API returns an error', async () => {
    Contact.prototype.save = vi.fn().mockResolvedValue({});
    mockResendSend.mockResolvedValue({
      data: null,
      error: { statusCode: 403, message: 'You can only send testing emails to your own email address' },
    });
    mockSendMail.mockResolvedValue({});

    process.env.RESEND_API_KEY = 're_test_key_123';
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
    expect(mockResendSend).toHaveBeenCalled();
    expect(nodemailer.createTransport).toHaveBeenCalled();
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
