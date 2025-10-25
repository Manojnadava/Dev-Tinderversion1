const connection= require('../models/connection');
const User  = require('../models/user');

const total_users= async  (req, res,next) =>{
    const limit =(req.query.limit) ? parseInt(req.query.limit) : 3 ;
    const page= (req.query.page) ? parseInt(req.query.page) : 1;
    const skip= (page-1)*limit;
    const results= await User.aggregate([
    {
        $facet : {
            total : [ {$count : 'totaldoc_user'}] ,
            paged_data : [

    {  
         $sort : {createdAt : 1}

    },
    {
        $skip : skip

    },
    {
        $limit : limit

    },
    {
        
        $lookup : {
            from : 'connections',
            let : {user_id : '$_id'}, // defining a user_id as variable which we use to compare in joining connection table
            pipeline : [
                {
                    $match : {
                        $expr : {
                            $and : [
                                {$or : [
                                    {$eq : ['$sender_id', '$$user_id']},  // expreession always retuen in form of array or fn style
                                    {$eq : ['$recevier_id', '$$user_id']}  // user_id a custom variable defined by lookup so it is not a filed so accessed by $$
                                ]},

                                {$eq : ['$status' , 'accepted'] }

                            ]
                        }
                    }
                }
            ] ,
            as : 'connection'
        } ,
    },  
    {
            $addFields : {
                 total_connection : {$size : '$connection'}
            } 
    },
    {
            $project : {
                firstName : 1,
                lastName :1,
                about :1,
                total_connection :1
            }
    }
            ]
        }
    }
            
    
])
req.total_users= results;
next();
}

module.exports=total_users;
