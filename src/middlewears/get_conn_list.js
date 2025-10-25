//const { connections } = require('mongoose');
const connection= require('../models/connection');

const get_follower_list_user=  (req,res, next)=>{

const results= connection.aggregate([
    {
        $match : {status : 'accepted', $or :[{sender_id : req.user._id},{receiver_id : req.user._id}] }
    },
    {
        $lookup : {
        from : 'users',
        localField: 'sender_id',
        foreignField:'_id',
         as : 'sender'
        }
    },
    { 
        $unwind : '$sender'
    },
    {
        $lookup : {
        from : 'users',
        localField: 'receiver_id',
        foreignField:'_id',
         as : 'receiver'
        }
    },
    { 
        $unwind : '$receiver'
    }, 
    {
       $group : {_id : null,  total_connections : {$sum : 1}}   // basically put all matched doc from top to one bucket
    }



])
req.connection_counts= results;
next() 

}

const get_follower_details_per_user=  async (req,res,next)=>{
    console.log('enterd get_follower_details_per_user')

const results= await  connection.aggregate([
    {
        $match : {status : 'accepted', $or :[{sender_id : req.user._id},{receiver_id : req.user._id}] }
    },
    // nexct is a project pipeline where it will do select where the mentioned fields inside only it will keep
    {
        $project : {
            otherUserId : {
                $cond : {
                    
                       if : { $eq : ['$sender_id', req.user._id] },  // ome is a equation implies sender_id=123
                    then : '$receiver_id',// truth value if true eq  where recevier_id is filed value stored in string format
                   else : '$sender_id'// false value
                }
            }
        }
    },
    {
        $lookup : {
        from : 'users',
        localField: 'otherUserId',
        foreignField:'_id',
         as : 'OtherUserId'
        }
    },
    { 
        $unwind : '$OtherUserId'
    }, 
    {
        $project : {
            'OtherUserId.firstName' : 1,  // when i get doc in this stage each doc isstored inside OtherUserId key of particular conncetio id.s
            'OtherUserId.lastName'   : 1  // selecting on firstand last Names

        }
    },
    
    {
       $group : {_id : null,  Followers : {$push : '$OtherUserId'}}   // basically put all matched doc from top to one bucket
    }



])
//console.log(results)
req.connection_details= results;
next() 


}

const get_follow_request_details= async  (req, res, next)=> {
 const results=  await connection.find({
    receiver_id : req.user._id ,
    status : 'pending',

 }).select('_id status').populate('sender_id', 'firstName lastName')  // select is to select field from smae collection

req.connection_request= results;
next();

}

const get_followers_count_per_user=  async (req,res,next)=>{
const results= await connection.aggregate([
    {
        $match : {
        status : 'accepted',
        $or : [{receiver_id : req.user._id}, {sender_id : req.user._id}]
    }
},
  {
    $group : {
        _id : null ,
        total_connections : {$sum : 1}
    }
  }, 
  {
    $project : {
        _id : 0,
        connections : '$total_connections'
    }
  }
])
req.total_connections= results; // returns a array
next();

}

module.exports= {get_follower_list_user, get_follower_details_per_user,get_follow_request_details, get_followers_count_per_user}