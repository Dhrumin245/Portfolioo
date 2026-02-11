import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// GET resume file
router.get('/', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'fs' });

    // Find the file by filename
    const files = await db.collection('fs.files').find({ filename: 'resume.pdf' }).toArray();
    if (files.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const file = files[0];
    res.set({
      'Content-Type': file.contentType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${file.filename}"`
    });

    // Stream the file
    const downloadStream = bucket.openDownloadStream(file._id);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

export default router;
