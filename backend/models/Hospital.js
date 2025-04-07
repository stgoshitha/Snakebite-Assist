const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
    },
    latitude: { type: Number },
    longitude: { type: Number },
    is24hrService: { 
      type: Boolean, 
      default: false,
    },
    workingHours: [
      {
        day: { type: String, required: true }, 
        open: { type: String, required: true }, 
        close: { type: String, required: true },
      },
    ],
    proofCertificate: { type: String, required: true },
    hospitalImages: { type: [String],default: ['https://example.com/default-hospital.jpg'] },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'user',
      required: true 
    },
    isApproved: { type: Boolean, default: false }
  },
  { timestamps: true } 
);

const Hospital = mongoose.model('hospital', HospitalSchema);
module.exports = Hospital;
