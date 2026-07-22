import express from 'express';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dns from 'dns';
import Contact from '../models/contact.js';

const router = express.Router();

export const verifyEmailAuthenticity = async (email) => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) return false;

  const domain = trimmed.split('@')[1];
  if (!domain) return false;

  try {
    const mxRecords = await dns.promises.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Email authenticity check failed for domain ${domain}:`, err.message);
    return false;
  }
};

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received:', { name, email, message });

  // 1. Verify email authenticity (syntax + domain MX lookup)
  const isAuthentic = await verifyEmailAuthenticity(email);
  if (!isAuthentic) {
    return res.status(400).json({ error: 'Please provide a valid, authentic email address.' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    console.log('Saved successfully');

    // Send email notification via Resend (preferred) or Nodemailer SMTP (fallback)
    const {
      RESEND_API_KEY,
      RESEND_FROM_EMAIL,
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      EMAIL_TO,
      EMAIL_FROM,
    } = process.env;

    const recipient = EMAIL_TO || 'dhrumintechnotech@gmail.com';
    const formattedSenderName = name ? `${name} via Portfolio` : 'Portfolio Contact';
    const emailSubject = `New Portfolio Project Brief from ${name || 'a visitor'}`;
    const textBody = `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\n\nProject Brief:\n${message}`;
    const htmlBody = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #00bcd4; border-bottom: 2px solid #00bcd4; padding-bottom: 10px; margin-top: 0;">New Project Brief Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Business Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #00bcd4; margin-top: 15px; border-radius: 4px;">
          <p style="margin: 0; white-space: pre-wrap;"><strong>Project Brief:</strong><br/>${message}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">Sent from your Portfolio contact form backend.</p>
      </div>
    `;

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const fromAddress = RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        await resend.emails.send({
          from: `"${formattedSenderName}" <${fromAddress}>`,
          to: recipient,
          replyTo: email,
          subject: emailSubject,
          text: textBody,
          html: htmlBody,
        });
        console.log('Email notification sent successfully via Resend to', recipient);
      } catch (resendError) {
        console.error('Error sending email notification via Resend:', resendError);
      }
    } else if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      try {
        const isSecure = process.env.SMTP_SECURE === 'true';
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT || '587', 10),
          secure: isSecure,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        const mailOptions = {
          from: EMAIL_FROM || `"${formattedSenderName}" <${SMTP_USER}>`,
          to: recipient,
          replyTo: email,
          subject: emailSubject,
          text: textBody,
          html: htmlBody,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully via Nodemailer to', recipient);
      } catch (emailError) {
        console.error('Error sending email notification via Nodemailer:', emailError);
      }
    } else {
      console.warn('Email notification skipped: Neither RESEND_API_KEY nor SMTP settings are configured.');
    }

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
