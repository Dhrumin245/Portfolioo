# TODO: Implement PDF Upload to MongoDB GridFS and Download from Frontend

## Steps from Approved Plan

- [x] Backend/server.js: Mount resumeRoutes with app.use('/api/resume', resumeRoutes);
- [x] Backend/routes/resumeRoutes.js: Update GET route to use GridFS for downloading
- [x] my-app/src/App.jsx: Attach onClick to the Download Resume button
- [ ] Upload PDF to MongoDB Compass using GridFS with filename 'resume.pdf'
- [ ] Test the download functionality
