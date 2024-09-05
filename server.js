const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const streamifier = require('streamifier');

const app = express();
app.use(cors());

cloudinary.config({
  cloud_name: 'dvcvm0lel',
  api_key: '788696716814221',
  api_secret: 'huGI0ttVs1W84JqgfOUsdYjT9To',
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Upload file lên Cloudinary
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function uploadFile() {
      let result = await streamUpload(req);
      res.send(`File uploaded successfully: ${result.secure_url}`);
    }

    uploadFile();
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send('Internal server error');
  }
});
app.get('/', (req, res) => {
  res.send('Welcome to the image upload server!');
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
