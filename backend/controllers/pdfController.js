const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const streamifier = require('streamifier');
dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: `pdfs/${uuidv4()}`,
        folder: 'pdfs'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error);
          return res.status(500).json({ success: false, message: 'Error uploading to Cloudinary' });
        }
       // console.log('Cloudinary result:', result);
        return res.status(200).json({ success: true, url: result.secure_url });
      }
    );

    // ✅ Convert buffer to stream
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getPdf = (req, res) => {
  const { public_id } = req.params;

  const pdfUrl = cloudinary.url(public_id, {
    resource_type: 'raw',
    secure: true,
  });

  res.redirect(pdfUrl);
};

module.exports = { uploadPdf, getPdf };
