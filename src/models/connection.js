const mongoose=  require('mongoose');  //common js syntax
const User = require('./user');

const connection_schema= new mongoose.Schema ({
    sender_id : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required: true
    },
    receiver_id : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required: true
    },
    status :  {
        type: String,
        required : true,
        enum : {
            values : ['pending','accepted','rejected','ignored'] ,
            message : `value is not valid`
        }
    }
})

connection_schema.index({sender_id:1 , receiver_id:1}, {unique: true})  // creating a compound index where 2 user id s are stored in form of tuple in b tree structure in separtae disk of mongo server for index scan- (A,B) like this stored
connection_schema.index({receiver_id:1})  // to get intersetd notification based on each user a receiver id is stored in a separate column in a disk
// receiver_id:1  means the id of receiver are stored in the asscending order smallest to larget in disk of receiver id tree or index record of receiver id



connection_schema.pre('save', function (next) {
    // validation before saving to connection req object in db
    try {
        // here this refers to current document instance called when .save() method 
        if (this.receiver_id.equals(this.sender_id) ) {
            throw new Error ('A user canot send Request to himself');
       }
       next();  // this mongoose midelwear not express 
    }   catch (err) {
        next(err)  // this will be passed to mongoose error handler
          
    }
   
})












const connection_model= mongoose.model('Connection',connection_schema)



module.exports=connection_model;
