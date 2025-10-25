const express= require('express');
const router=express.Router();  // profile router instance
const User=require('../models/user')
const {userAuth}=require('../middlewears/auth');
const validatefun= require('../middlewears/validate');
const {get_followers_count_per_user}= require('../middlewears/get_conn_list');

router.post('/view/:userid',userAuth,get_followers_count_per_user, async(req,res)=>{
//const user_id= req.params.userid;

// here we will get one users total connection count 
const user=req.user;

res.json({
    userid: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    about: user.about,
    total_connections : req.total_connections[0].connections
})
})

router.patch('/edit/:userid', userAuth,validatefun,async(req,res)=>{
const allowed_update=['age','photoUrl','about','skills'];
console.log('Enterd edit block')
const user=req.user;
try{

    Object.entries(req.body).filter(([key,value],index)=>{
          if(! allowed_update.includes(key)){
             throw new Error(`${key} cannot be edited`)
          }
          else {
            console.log(user[key]);
           // user.key=value;  //tghis actually create a new propert with name key
           user[key]=value;  
          }
          return ;
    })
    await user.save();
    res.json({
        message : 'User updated successfully',
        data  : user

    })

} 
catch (err) {
    res.json({
        errormessage : err.message
    })

}




})



router.patch('/forgot_password', userAuth,validatefun, async(req,res)=>{
    updating_password= req.body;


})

module.exports=router;