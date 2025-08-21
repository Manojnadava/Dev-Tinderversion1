const User= require('../models/user');
const jwt=require('jsonwebtoken')

const adminAuth=(req,res,next)=>{
    const token='xyz';
    const isadminValid= token==='xyz';
    (isadminValid) ? next() : res.status(401).send('All data not  sent');
}

const userAuth= async (req,res,next)=>{
    const token_value=req.cookies.token;
  console.log(token_value);
 try{
    if(!token_value) {
      throw new Error('token not valid')
    }
   //need to validate this token
   const {_id}= jwt.verify(token_value,"Dev@123tinder")  // fetching the hidden user id from the jwt token

   //onsole.log(decodetoken);
   const user= await User.findById(_id);
   if (!user) {
    throw new Error('User not valid')
   }
   req.user=user;
    res.send(user);
    next();

 } catch (err) {
    res.status(401).send(err.message);
 }
}

module.exports={
    adminAuth,
    userAuth
}


// The userAuth function or a handler is used as a Authentication Validation opf user in all the routes path defined in app.js 
// Only aithenticated user who has valid token can update delete or modify or get the records from system