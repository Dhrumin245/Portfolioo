import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import { GridFSBucket } from 'mongodb';

dotenv.config();

const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide the path to your PDF file as an argument, e.g., node uploadResume.js C:\\path\\to\\resume.pdf');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error('File not found at the provided path.');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'fs' });

    const readStream = fs.createReadStream(filePath);
    const uploadStream = bucket.openUploadStream('resume.pdf', {
      contentType: 'application/pdf'
    });

    readStream.pipe(uploadStream);

    uploadStream.on('finish', () => {
      console.log('PDF uploaded successfully to GridFS with filename "resume.pdf"');
      mongoose.connection.close();
      process.exit(0);
    });

    uploadStream.on('error', (error) => {
      console.error('Error uploading file:', error);
      mongoose.connection.close();
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });
