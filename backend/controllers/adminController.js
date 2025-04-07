const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get all users
const getUser = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin")
      return res.status(403).json({ message: "Access denied" });

    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const blockUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    user.isBlocked = true;

    await user.save();
    res.send('User has been blocked');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const unblockUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    user.isBlocked = false; // Unblock the user
    await user.save();
    res.send('User has been unblocked');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Delete user
const deletUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err); 
    return res.status(500).json({ message: "Internal server error" });
  }
};


const updateAdmins = async (req, res) => {
  const {editAdminId} = req.params;
  const {name,email,password,role} = req.body;

  try{
    if(req.user.role !== "admin" && req.user.role !== "superadmin")
      return res.status(403).json({ message: "Only admin details can be updated" });

    const admin = await User.findById(editAdminId);
    if (!admin) return res.status(404).send('Admin not found');

    if(name) admin.name = name;
    if(email) admin.email = email;
    if(password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    };
    if(role) admin.role = role;

    await admin.save();
    res.status(200).json({ message: 'Admin details updated successfully' });

  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
  
};



module.exports = { getUser, blockUser, unblockUser,deletUser,updateAdmins };
