const express= require('express');
const router=express.Router();
const Connection= require('../models/connection');
const mongoose= require('mongoose');
const {connection_validation}= require('../middlewears/connection_validation');

const {userAuth}=  require('../middlewears/auth');  //User Authentication

let result;  // global level scope


//router.use(userAuth);

//router.use(connection_validation);




router.post('/:status/:user_id',userAuth,connection_validation,  async(req,res, next)=>{
    const receiver_id= req.params.user_id;
    const sender_id= req.user._id;
    const status=req.status // handle both intersted and ignored request
    console.log(status+'In conn api')
    if (!['pending','ignored'].includes(status)) {
        console.log('Enterd this block')
      throw new Error ('Invalid Status')
      
    }
    if (req.result && req.result.status=='ignored' & req.params.status=='interested') {
        req.result.status='pending';
       result=  await req.result.save();
        return res.json({
            message : "Connection sent ",
            data: result
        })
    }
    //console.log(req.params.status);

    try{
        const connection= new Connection ({
            sender_id,
            receiver_id,
            status: status
        })
       result = await  connection.save();   // getting from global scope
       //console.log(result);
      res.send(result);
    } catch (err) {
        console.log(err.message);
        next(err);
       
       
    }
})

router.patch('/unfollow/:user_id', userAuth, connection_validation,async (req, res)=>{
    if (req.result) {
        await req.result.deleteOne()
        res.send('Deletion done')
    }
    else {
        throw new Error('No records to delete ')
    }

})


router.patch('/:status/:user_id',userAuth, connection_validation,async (req,res, next)=>{
    const sender_id= req.params.user_id;
    const receiver_id=req.user._id;
    const status=req.params.status // handle both accepted and rejected request
    console.log('eterdpatch'+status+ req.status);
    const allowed_status=['accepted','rejected'];
    try{
        if(! allowed_status.includes(status)) {
            throw new Error ('Not a valid status');
        }
     
        const result=  (req.status=='pending') ? await Connection.findOneAndUpdate({sender_id : sender_id, receiver_id: receiver_id , status: 'pending'},{$set : {status:  status}}, {new: true}) : '';
        console.log(result);
       if (result) {
         return  res.json({
            message : result
         })
       } else {
        throw new Error('Not  a Valid Request')
       }
        

    } catch (err) {
         next(err);
    }
})




router.use((err,req,res,next)=>{

     if(err.code ==11000) {
           return   res.status(401).json({
         message : `Duplicate entry with already a connection status in database `
            });
        }
       // return res.status(500).send(err.message);

    res.json({
        err_message : err.message
    })

})

module.exports= router;