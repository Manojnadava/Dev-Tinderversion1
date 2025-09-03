
const Connection= require('../models/connection');
const status=['pending','ignored']

const connection_validation= async  (req, res, next) => {
const user_id= req.user._id.toString(); //since user._id is coming from db which is a objectID 
const sender_id= req.params.user_id;
if(user_id==sender_id) {
    throw new Error ('A user canot send Request to himself');
}

try {
    const result=  await Connection.findOne({ $or : 
        [
        {sender_id : sender_id, receiver_id : user_id }, 
        {sender_id : user_id, receiver_id : sender_id}
     ]})
    
    if(! result || status.includes(result.status)) {
      req.status=result.status;
      return  next(); // here return is must because calling next only registers or schedules next middelware run butonce it registers still call satck rus whatever code preset below 
    }
     return res.json({
        message : `Connection already is in ${result.status} `
     });  // here u must retur the res.send() otherwise after setting response again it will continue execution

} catch (err) {
    res.status(400).send('Connection validation error'+ err.message)
}

}


module.exports= {connection_validation};