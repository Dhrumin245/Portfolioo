import express from 'express';
import nodemailer from 'nodemailer';
import Contact from '../models/contact.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received:', { name, email, message });

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    console.log('Saved successfully'); 

    // Send email notification if SMTP is configured
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_TO, EMAIL_FROM } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
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
          from: EMAIL_FROM || `"Portfolio Contact" <${SMTP_USER}>`,
          to: EMAIL_TO || 'dhrumintechnotech@gmail.com',
          replyTo: email,
          subject: `New Portfolio Project Brief from ${name}`,
          text: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\n\nProject Brief:\n${message}`,
          html: `
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
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully to', EMAIL_TO || 'dhrumintechnotech@gmail.com');
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Do not fail the client request if the database save succeeded but email failed
      }
    } else {
      console.warn('Email notification skipped: SMTP_HOST, SMTP_USER, or SMTP_PASS not configured.');
    }

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact:', error); 
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
