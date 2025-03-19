const User = require('../models/User');

// Get all users 
const getUser = async (req, res) => {
  try {
      if (req.user.role !== "admin" && req.user.role !== "superadmin")return res.status(403).json({ message: "Access denied" });
      
      const users = await User.find();
      res.status(200).json({ users });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {getUser};