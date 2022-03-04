
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const  crypto  = require('crypto');
const User = require('../models/usermodel');
const Token = require('../models/tokenmodel');
const Mail = require('../helper/sendMail');


module.exports = {
register: async (req, res) =>{
    try {
        
        const {
            firstname, lastname, email, password
        } = req.body;
        //salt and hash password
        const salt =  await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)
    
        //create a new user
        const user = await User.create({
             firstname,
             lastname,
             email,
            password: hashPassword
        });

        //Token Secret Key
        const tokenSecretKey = process.env.JWT_SECRET;
        
        // Data to be
        const data = { _id: user._id };
        // Token Expiration Time
        const tokenExpirationTime = process.env.JWT_EXPIRATION_TIME;
  
        // Create a token
        const token = jwt.sign(data, tokenSecretKey, {
          expiresIn: tokenExpirationTime,
        });
        console.log(token);

        if (!user) {
         return res.status(400).json({ result: 'user not created'})
        } else {
         return res.status(200).json({ result: user, token});
        } 
        }catch (error) {
        return res.status(400).json({ message: error.message });
        }
    },
    
    login: async (req, res) => {
        try {
          const { email, password } = req.body;
    
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).send('Email Not Found, Please Register');
          }
          const isValid = await bcrypt.compare(password, user.password);
    
          if (!isValid) {
            return res
              .status(400)
              .json({ result: 'Incorrect password' });
          }
          // Token Secret Key
          const tokenSecretKey = process.env.JWT_SECRET;
        
          // Data to be
          const data = { _id: user._id };
          // Token Expiration Time
          const tokenExpirationTime = process.env.JWT_EXPIRATION_TIME;
    
          // Create a token
          const token = jwt.sign(data, tokenSecretKey, {
            expiresIn: tokenExpirationTime,
          });

          console.log(token);
    
          return res.status(200).json({ result: 'Welcome to our platform', token });
        } catch (err) {
          return res.status(400).json({ message: err.message });
        }
      },

      get: async(req,res) => {
        const user = await User.findById({_id: req.user._id});
        return res.status(200).json({ data: `Hello ${user.firstname} Welcome Back`})
      },
      request_password_reset: async (req, res) => {
        try{
          const { email } = req.body
          const user = await user.findOne({ email });
          if (!user) {
            return res.status(404).json({ result: 'Email not found, try to register' });
        }

        const resetToken  = crypto.randomBytes(20).toString('hex');
        const hash = await bcrypt.hash(resetToken, 10 )
        await Token.create({
          userId: user._id,
          token: hash,
        });

        const url = `http://localhost:5080/reset_password/?userId=${user._id}&resetToken=${resetToken}`
        
        // send reset password url to user 
        await Mail(
          email, 
          'Reset Password'
          `<a href=""${url}">Reset Password</a>`,
        
        );

        return res.status(200).json({ result: 'Email Sent'});

      } catch (error) { 
        return res.status(400).json({ message: error.message });
      }

},
  reset_password: async (req, res) => { 
    try {
      const { userId, resetToken, password } = req.body

      const user = await user.findById(userId)
      if(!User) return res.status(404).json({ result: 'User Not Founmd' });
      
      const token  = await Token.findone({ userId });
      if(!token) return res.status(404).json({ result: 'Token Not Founmd' });

      const isValid = await bcrypt.compare(resetToken, token.token);
      if(isValid) return res.status(404).json({ result: 'Token Not Valid or Expired'});

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Password, salt);

      user.password = hashedPassword;
      await user.save();

      //delete token
      token.remove();

      return res.status(200).json({ result: 'Password Reset Successfully' });
   
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

    };
  
