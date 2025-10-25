const User= require('../models/user');
const jwt=require('jsonwebtoken')



const userAuth= async (req,res,next)=>{
  console.log(req.params);
    const token_value=req.cookies.token;
  console.log(token_value);
 try{
    if(!token_value) {
      throw new Error('token not valid')
    }
   //need to validate this token
   const {_id}= jwt.verify(token_value,"Dev@123tinder")  // fetching the hidden user id from the jwt token

   //console.log(decodetoken);
   const user= await User.findById(_id);
  //  if(user._id.toString()  != 'somethig i need tocompare related to the seding user') {
  //   console.log(user._id )
  //   res.status(401).send('Un authorized user');
  //  }
   if (!user) {
    throw new Error('User not valid')
   }
   req.user=user;
   req.update=true;
    //res.send(user);
    next();

 } catch (err) {
    res.status(401).send(err.message);
 }
}

module.exports={
    userAuth
}


// The userAuth function or a handler is used as a Authentication Validation opf user in all the routes path defined in app.js 
// Only aithenticated user who has valid token can update delete or modify or get the records from system