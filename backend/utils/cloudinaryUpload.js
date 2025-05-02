const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path to upload
 * @param {string} folder - Cloudinary folder to upload to
 * @returns {Promise} - Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = 'snakes') => {
  console.log('Starting Cloudinary upload for file:', filePath);
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File does not exist:', filePath);
      return {
        success: false,
        error: 'File not found'
      };
    }

    console.log('Uploading to Cloudinary with options:', { folder });
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    });
    
    console.log('Cloudinary upload successful:', result);
    
    // Delete the local file after upload
    fs.unlinkSync(filePath);
    console.log('Local file deleted:', filePath);
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    // In case of error, try to delete the local file
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('Local file deleted after error:', filePath);
      } catch (unlinkError) {
        console.error('Error deleting local file:', unlinkError);
      }
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = { uploadToCloudinary }; 