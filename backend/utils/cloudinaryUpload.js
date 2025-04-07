const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path to upload
 * @param {string} folder - Cloudinary folder to upload to
 * @returns {Promise} - Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = 'snakes') => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    });
    
    // Delete the local file after upload
    fs.unlinkSync(filePath);
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    // In case of error, try to delete the local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = { uploadToCloudinary }; 