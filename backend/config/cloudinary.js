const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'ddnwteshi',
  api_key: '579897769642632',
  api_secret: 'YoPOlFJ9kmyb75IRdcHWSYhEPoA'
});

module.exports = cloudinary; 