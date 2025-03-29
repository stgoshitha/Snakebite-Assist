const User = require('../models/User');

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


module.exports = { getUser, blockUser, unblockUser,deletUser };
