const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const isAdminOrSuperAdmin  = async (req, res, next) => {
  try{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({_id: decoded.id});

    if(!token) return res.status(400).json({msg: "Invalid Authentication."});

    if(!user) return res.status(401).json({ message: 'user not found'});
  
    if(user.role !== 'superadmin') return res.status(400).json({msg: "Super admin resources access denied."});

    // Allow access to both superadmins and admins
    if (user.role === 'superadmin' || user.role === 'admin') {
      req.user = user;  // Attach user object to request
      return next();
    } else {
      return res.status(403).json({msg: "Admin resources access denied."});
    }

  }catch(err){
    console.error(err);
    return res.status(500).json({msg: err.message});
  }
};


const isSuperAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ msg: "Access denied. Super Admins only." });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {isAdminOrSuperAdmin, isSuperAdmin};