const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Case = require('./models/case'); // Import the case model

const app = express();
const PORT = 3020;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/lawme', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Could not connect to MongoDB...', err));

// File storage configuration for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = file.mimetype.startsWith('image/') ? 'images' : 'documents';
    const uploadPath = path.join(__dirname, 'public/uploads', fileType);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Route to add a new case
app.post('/add-case', upload.fields([{ name: 'documents' }, { name: 'images' }]), async (req, res) => {
  try {
    const caseData = {
      caseName: req.body['case-number'],
      caseDescription: req.body.description,
      caseStatus: 'pending', // Default status is pending
      caseFile: req.files.documents ? req.files.documents[0].filename : null,
      caseImage: req.files.images ? req.files.images[0].filename : null
    };

    const newCase = new Case(caseData);
    await newCase.save(); // Save the case to MongoDB

    const cases = await Case.find(); // Fetch all cases
    res.json({ success: true, cases });
  } catch (error) {
    console.error('Error saving the case:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Route to fetch all cases
app.get('/cases', async (req, res) => {
  try {
    const cases = await Case.find(); // Fetch all cases from MongoDB
    res.status(200).json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Error fetching cases' });
  }
});

// Route to mark a case as solved
app.put('/mark-as-solved/:id', async (req, res) => {
  try {
    await Case.findByIdAndUpdate(req.params.id, { caseStatus: 'solved' });
    res.status(200).json({ success: true, message: 'Case marked as solved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking case as solved' });
  }
});

// Route to delete a case
app.delete('/delete-case/:id', async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting case' });
  }
});

// Serve static files from the 'uploads' directory (for accessing documents/images)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Serve the mycases.html file
app.get('/mycases.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'mycases.html'));
});

// Redirect root route to /mycases
app.get('/', (req, res) => {
  res.redirect('/mycases.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
