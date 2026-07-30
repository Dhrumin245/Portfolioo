/**
 * One-time migration script: fix all project slugs/ids that contain
 * spaces or slashes (e.g. "case study / web application")
 * Run with: node Backend/fixSlug.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[/\\]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const projectSchema = new mongoose.Schema({}, { strict: false });
const Project = mongoose.model('Project', projectSchema, 'projects');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const projects = await Project.find({});
  console.log(`Found ${projects.length} projects`);

  let fixed = 0;
  for (const project of projects) {
    const badSlug = project.slug || '';
    const cleanSlug = slugify(badSlug);

    if (cleanSlug !== badSlug) {
      console.log(`  Fixing: "${badSlug}" -> "${cleanSlug}"`);
      try {
        await Project.updateOne(
          { _id: project._id },
          { $set: { slug: cleanSlug, id: cleanSlug } }
        );
        fixed++;
      } catch (err) {
        console.error(`  ERROR updating "${badSlug}":`, err.message);
      }
    } else {
      console.log(`  OK: "${badSlug}"`);
    }
  }

  console.log(`\nDone. Fixed ${fixed} slug(s).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
