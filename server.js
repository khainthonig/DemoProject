const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const storage = multer.diskStorage({
      destination: function (req, file, cb) {
      const uploadDir = 'uploads/';
      if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
      }
            cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
            cb(null, path.extname(file.originalname));
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
app.listen(port,'0.0.0.0', () => {
      console.log(`Server running on http://192.168.1.156:${port}`);
});
