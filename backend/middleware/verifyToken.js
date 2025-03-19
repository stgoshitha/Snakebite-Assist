const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const isAdminOrSuperAdmin = async (req, res, next) => {
  try {
    // Check if token exists
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Unauthorized: No token provided." });

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in .env
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ msg: "User not found." });

    // Allow access only for superadmins and admins
    if (user.role !== 'superadmin' && user.role !== 'admin') {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    req.user = user; // Attach user to request object
    next();

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

const isSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'superadmin') {
      return res.status(403).json({ msg: "Access denied. Super Admins only." });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

module.exports = { isAdminOrSuperAdmin, isSuperAdmin };
