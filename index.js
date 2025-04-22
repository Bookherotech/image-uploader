const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { config } = require('dotenv');
const fs = require('fs');

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
