const express= require('express');
const validateRequestBody = require('../util/validate');
const User=require('../models/user');
const validator=require('validator')

const authRouter=express.Router();

authRouter.post('/signup',validateRequestBody,async (req, res)=>{
    // ajson obj diff to js obj js obj is key value pair but in json both should be string
      // creating a new istnace of the User model
    console.log( req.body);  //serverundefined  if no middelwear used
      const userObj= req.body;   // our server cant directly read data req.body as it is in json format so we neeed middelwear
      
  
      try {
         //User data validation
         // validateRequestBody(req,res);
          console.log('Validation done ');
          const { firstName, lastName, emailId, password } = req.body; 
  
  
         //Password Hashing taken care at schema level
         
  
         //console.log(hashedpassword);
  
         // saving the user 
         const user= new User({
          firstName,
          lastName,
          emailId,
          password,  // here we are using the encryptPassword function to hash the password
          skills: req.body.skills || [],  // if skills not provided then it will be an empty array
          photoUrl: req.body.photoUrl   // if photoUrl not provided then it will be an empty string
         });   //here this User isa model which uliton frame work or structure of schema user_schema
        await user.save();  // this in hidsight using inserOne function in mongo which returns a promise so we need to use async in handler
  
          res.send('User added succesfully')
      }
      catch (err) {
        res.status(400).send('Error happend with'+ err.message)
      }
      
  })

authRouter.post('/login',async (req,res)=>{
    const {emailId, password}= req.body;
    console.log(password);
    try{
       const valid= validator.isEmail(emailId);
       console.log(valid);
       if(!valid) {
        throw new Error('Invalid Credentials')
       }
       const user= await  User.findOne({emailId}).select('+password');
       console.log(user);
       const matchPasswords= await user.verifyPassword;
       if(!matchPasswords) {
        throw new Error('Invalid Credentials')
       }
       // Login successful
       // Create a JWT token
       const token=  await user.getJwt();
       // add this jwt token to cookie and send the response back to user
       res.cookie('token',token,{httpOnly:true ,maxAge:1000*60*60 , secure: true});
       res.send('Login successfull');
  
  
    } catch (err) {
     res.status(401).send('Error with'+ err.message);
    }
  
  })

authRouter.post('/logout', async(req,  res)=>{
    //logging out a user
 res.clearCookie('token').json({message: 'U have been logged out '});  // just pass token name used while login 

})

module.exports=authRouter;