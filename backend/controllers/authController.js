const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); 

dotenv.config();

const register = async (req, res) => {
  try{
    const { name, email, password, role } = req.body;

    //find if user already exists
    const exitUser = await User.findOne({email});
    if(exitUser) return res.status(400).json({msg: "This email already exists"});

    //validate password 
    if(password.length < 6) return res.status(400).json({msg: "Password must be at least 6 characters."});

    //password encryption
    const passwordHash = await bcrypt.hash(password, 10);

    //create the user object
    const user = new User({
      name,
      email,
      password: passwordHash,
      role
    });

    //save the new user
    await user.save();
    res.status(200).json({msg: "Register Success!",user});

  }catch(err){
    console.error(err);
    return res.status(500).json({msg: err.message});
  }
};

const login  = async(req,res) => {
  try{
      const {email,password} = req.body;

      //check the credentials
      //user
      const user = await User.findOne({email});
      if(!user) return res.status(401).json({success:false,message: 'Invalid credentials'});
      //password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if(!isPasswordValid) return res.status(401).json({success:false,message: 'Invalid credentials'});

      if (!user) {
        return res.status(400).send('User not found');
      }
  
      // Check if the user is blocked
      if (user.isBlocked) {
        return res.status(403).send('Your account is blocked');
      }
      
      // Set the token in an HTTP-only cookie for secure authentication
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      res.cookie('token', token,{
          httpOnly: true,
          secure: false,
          maxAge:3600000
      })

      res.status(200).json({success: true,message: "Login Successfully",user,token});
      
      }catch(err){
          res.status(500).send({success:false,message: 'Internal server error'});
      }
};

const logout = async(req,res) =>{
  try{
      // Clear the authentication token stored in cookies
      res.clearCookie('token');

      res.status(200).json({
          success:true,
          message: 'Logout successfully'
      })
  }catch(err){
      res.status(500).send({
          success:false,
          message: 'Internal server error'
      });
  }

};

const getOneUser = async (req, res) => {
  try {
      const { userId } = req.params;

      // Find user by ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({
              success: false,
              message: 'User not found'
          });
      }

      res.status(200).json({
          success: true,
          user
      });
  } catch (err) {
      console.error(err);
      res.status(500).send({
          success: false,
          message: 'Internal server error'
      });
  }
};

module.exports = {register,login,logout,getOneUser};

