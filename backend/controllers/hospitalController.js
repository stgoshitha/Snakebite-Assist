const Hospital = require('../models/Hospital');
const User = require('../models/User');

// Create a new hospital (One-to-One Relationship)
const createHospital = async (req, res) => {
  try {
    const { hospitalName, hospitalType, address, city, phoneNumber, email, webSiteLink, latitude, longitude, is24hrService, workingHours, proofCertificate, hospitalImages } = req.body;

    const userId = req.user.id;

    // Create new hospital
    const newHospital = new Hospital({
      hospitalName,
      hospitalType,
      address,
      city,
      phoneNumber,
      email,
      webSiteLink,
      latitude,
      longitude,
      is24hrService,
      workingHours,
      proofCertificate,
      hospitalImages:hospitalImages && hospitalImages.length > 0 ? hospitalImages : ['https://example.com/default-hospital.jpg'],
      user: userId,
      isApproved: false
    });

    await newHospital.save();

    // Link hospital to user
    const user = await User.findById(userId);
    if (user) {
      user.hospitalId = newHospital._id;
      await user.save();
    }

    return res.status(201).json({
      message: 'Hospital created successfully',
      hospital: newHospital,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get the hospital for the logged-in user
const getUserHospital = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('hospitalId');
    //console.log(user.hospitalId);
    //console.log(user);
    
    if (!user || !user.hospitalId) {
        return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(user.hospitalId); 

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Get all approved hospitals
const getAllHospitalApproved = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isApproved: true }).populate('user','name');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all unapproved hospitals
const getAllHospitalNotApproved = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isApproved: false });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Approve a hospital
const approveHospital = async (req, res) => {
  try {
    const hospitalId = req.params.id;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    hospital.isApproved = true;
    await hospital.save();

    res.json({ message: 'Hospital approved successfully', hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update hospital details
const updateHospital = async (req, res) => {
  try {
    const hospitalId = req.params.id;  
    const userId = req.user.id; 

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    if (hospital.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You do not own this hospital' });
    }

    const allowedFields = ['hospitalName', 'hospitalType',  'address', 'city', 'phoneNumber', 'email', 'webSiteLink', 'latitude', 'longitude', 'is24hrService', 'workingHours', 'hospitalImages'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        hospital[field] = req.body[field];
      }
    });

    await hospital.save();

    res.json({ message: 'Hospital updated successfully', hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Delete a hospital 
const deleteHospital = async (req, res) => {
  try {
    const userId = req.user.id;
    const hospital = await Hospital.findOneAndDelete({ user: userId });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found or unauthorized' });
    }

    await User.findByIdAndUpdate(userId, { hospitalId: null });

    res.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  createHospital, 
  getUserHospital, 
  getAllHospitalApproved, 
  getAllHospitalNotApproved, 
  approveHospital, 
  updateHospital, 
  deleteHospital 
};
