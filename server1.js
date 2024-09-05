const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Cấu hình CORS
app.use(cors());

// Cấu hình lưu trữ Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.send(`File uploaded successfully: ${req.file.filename}`);
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the image upload server!');
});

// Export ứng dụng để Vercel có thể sử dụng
module.exports = app;
