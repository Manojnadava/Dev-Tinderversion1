const connection= require('../models/connection');
const User  = require('../models/user');

const total_users= async  (req, res,next) =>{
    const limit =(req.query.limit) ? parseInt(req.query.limit) : 3 ;
   // const page= (req.query.page) ? parseInt(req.query.page) : 1;
   // const skip= (page-1)*limit;
   const cursor = req.query.cursor ? new Date (req.query.cursor) : new Date('2025-08-17T12:49:13.667+00:00');
   console.log('total user current id'+req.user._id)
    const results= await User.aggregate([
    {
        $facet : {
            total : [ {$count : 'totaldoc_user'}] ,
            paged_data : [
                {
                    $match : {
                        $and : [{createdAt : {$gt : cursor}}, {_id : {$ne : req.user._id}}]
                        
                    }
                },


    {  
         $sort : {createdAt : 1}

    },
    // {
    //     $skip : skip

    // },
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
                                    {$and:[{$eq : ['$sender_id', '$$user_id']},{$eq:['$recevier_id',req.user._id]}]},  // expreession always retuen in form of array or fn style
                                    {$and : [{$eq :['$receiver_id', '$$user_id']},{$eq:['$sender_id',req.user._id]}]}  // user_id a custom variable defined by lookup so it is not a filed so accessed by $$
                                ]},

                                {$eq : ['$status' , 'accepted'] }

                            ]
                        }
                    }
                }
            ] ,
            as : 'connection_with_logged_user'
        } ,
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
                                    {$and:[{$eq : ['$sender_id', '$$user_id']},{$ne:['$recevier_id',req.user._id]}]},  // expreession always retuen in form of array or fn style
                                    {$and : [{$eq :['$recevier_id', '$$user_id']},{$ne:['$sender_id',req.user._id]}]}  // user_id a custom variable defined by lookup so it is not a filed so accessed by $$
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
                 total_connection : {$size : '$connection'},
                 total_user_connection : {$size : '$connection_with_logged_user'}
            } 
    },
    {
        $match : {
            total_user_connection : {$eq : 0}
        }
    },
    {
            $project : {
                firstName : 1,
                lastName :1,
                about :1,
                createdAt : 1,
                total_connection :1,
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
