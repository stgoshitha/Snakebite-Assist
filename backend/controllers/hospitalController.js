const Hospital = require('../models/Hospital');

//create new hospital
const createHospital = async (req, res) => {
  try {
    const { hospitalName, address, city, phoneNumber, email, latitude, longitude, is24hrService, workingHours, proofCertificate, hospitalImages } = req.body;

    const userId = req.user.id;

    const newHospital = new Hospital({
      hospitalName,
      address,
      city,
      phoneNumber,
      email,  
      latitude,
      longitude,
      is24hrService,
      workingHours,
      proofCertificate,
      hospitalImages,
      user: userId,
      isApproved: false 
    });

    const hospital = await newHospital.save();

    res.status(201).json({
      message: 'Hospital created successfully',
      hospital
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get all approved hospital details
const getAllHospitalApproved = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isApproved: true });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

//get all not approved hospital details
const getAllHospitalNotApproved = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isApproved: false });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

//get one hospital detail
const getOneHospital = async (req, res) => {
  try {
    const hospitalId = req.params.id;
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//get one hospital detail
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

//update hospital detail
const updateHospital = async (req, res) => {
  try {
    const hospitalId = req.params.id;
    const updateData = req.body; 

    const updatedHospital = await Hospital.findByIdAndUpdate(hospitalId, updateData, { new: true, runValidators: true });

    if (!updatedHospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({ message: 'Hospital updated successfully', hospital: updatedHospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//delete hospital detail
const deleteHospital = async (req, res) => {
  try {
    const hospitalId = req.params.id;
    const hospital = await Hospital.findByIdAndDelete(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({ message: 'Hospital deleted successfully', hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createHospital, getAllHospitalApproved, getAllHospitalNotApproved, getOneHospital, approveHospital, updateHospital, deleteHospital};
