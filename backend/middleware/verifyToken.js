const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const isAdmin = async (req, res, next) => {
  try{
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({_id: decoded.id});

    if(!token) return res.status(400).json({msg: "Invalid Authentication."});

    if(!user) return res.status(401).json({ message: 'user not found'});
  
    if(user.role !== 'superadmin') return res.status(400).json({msg: "Super admin resources access denied."});

    req.user = user;
    next();

  }catch(err){
    console.error(err);
    return res.status(500).json({msg: err.message});
  }
};

module.exports = {isAdmin};