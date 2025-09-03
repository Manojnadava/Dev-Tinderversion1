const express= require('express');
const router=express.Router();
const Connection= require('../models/connection');
const mongoose= require('mongoose');
const {connection_validation}= require('../util/connection_validation');

const {userAuth}=  require('../middlewears/auth');  //User Authentication


router.use(userAuth);




router.post('/:status/:reciever_id', async(req,res)=>{
    const receiver_id= req.params.reciever_id;
    const sender_id= req.user._id;
    const status=req.params.status // handle both intersted and ignored request

    try{
        const connection= new Connection ({
            sender_id,
            receiver_id,
            status: status
        })
      const result = await  connection.save();
      res.send(result);
    } catch (err) {
        console.log(err.message);
        res.status(401).send(err.message);
    }
})

// router.post('/:status/:reciever_id', async(req,res)=>{
//     const receiver_id= req.params.reciever_id;
//     const sender_id= req.user._id
// try{
//     const result= await Connection.create({
//         sender_id,
//         receiver_id,
//         status: 'ignored'
//      })
//      res.send(result);
// } catch (err) {
//     console.log(err.message);
//     res.status(401).send(err.message);
// }
 
// })


router.patch('/:status/:sender_id',async (req,res)=>{
    const sender_id= req.params.sender_id;
    const receiver_id=req.user._id;
    const status=req.params.status // handle both accepted and rejected request
    const allowed_status=['accepted','rejected'];
    try{
        if(! allowed_status.includes(status) || req.status=='ignored') {
            throw new Error ('Not a valid status');
        }
     
        const result=  (req.status=='pending') ? await Connection.findOneAndUpdate({sender_id : new mongoose.Types.ObjectId(sender_id)},{$set : {status:status}}, {new: true}) : null;
       if (result) {
        res.send('Status set ')
       }
        

    } catch (err) {
         res.json({
            message : err.message 
         })
    }
})


// router.patch('/rejected/:sender_id',async (req,res)=>{
//     const sender_id= req.params.sender_id;
//     const receiver_id=req.user._id;
//     const result=  await Connection.findOneAndUpdate({sender_id : new mongoose.Types.ObjectId(sender_id)},{$set : {status:'rejected'}}, {new: true})
// })


module.exports= router;