const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "hospital", "admin", "superadmin"],
    },
    isBlocked: { 
      type: Boolean, 
      default: false 
    },
    password: {
      type: String,
      required: true,
    },
    hospitalId: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: 'hospital', 
      default: null, 
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
