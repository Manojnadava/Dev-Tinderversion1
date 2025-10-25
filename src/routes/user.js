const express= require('express');

const router= express.Router();

const {userAuth}= require('../middlewears/auth');

const Connection= require('../models/connection')

const User= require('../models/user')
const {get_follower_details_per_user}= require('../middlewears/get_conn_list');
const {get_follow_request_details}= require('../middlewears/get_conn_list');  
const total_users= require('../middlewears/get_all_user');
 

router.use(userAuth);

router.get('/connections', get_follower_details_per_user, async (req,res)=>{
    // here we will get one users all connections details by get_follower_details_per_user   so that below direct query not needed

   try {
   // const getConnectios= await Connection.find({$or : [{sender_id: req.user._id , status : 'accepted'},{receiver_id: req.user._id, status : 'accepted'}]}).populate('sender_id') ; // this will return array ut findOne mongoose query returs object 
  console.log(req.connection_details)
   const {Followers}= req.connection_details[0];

   console.log(Followers)
    res.json({
        data : Followers
    })
   }  catch (err) {
    res.json({
        error : err.message
    })
   }
})

router.get('/request', get_follow_request_details, async (req,res)=>{
    // here we will get one users pending connnection s all details 

    try {
     // const getRequest= await Connection.find({status: 'pendig', receiver_id :  req.user._id}) ; 

     res.json({
         data : req.connection_request
     })
    }  catch (err) {
     res.json({
         error : err.message
     })
    }
 })

 router.get('/', total_users,async (req,res)=>{
 
    try{
        //const users= await User.find({});
        const users= req.total_users[0]. paged_data;
        const total_user= req.total_users[0].total[0].totaldoc_user;
        //res.send(users);
        res.json({
            data : users,
            total_data : total_user,
            currentpage : req.query.page,
            prev_page : req.query.page-1,
            has_next_page : (parseInt(total_user) > parseInt(req.query.page)*parseInt(req.query.limit) ? 'yes' : 'no')
        })
    } catch(err) {
        res.status(401).send(err.message);
    }
   
 })

 module.exports=router;