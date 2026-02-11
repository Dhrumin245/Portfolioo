import express from 'express';
import Contact from '../models/contact.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received:', { name, email, message });

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    console.log('Saved successfully'); 
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact:', error); 
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
