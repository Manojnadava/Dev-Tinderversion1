const mongoose= require('mongoose');
const connection= async  ()=>{
  await mongoose.connect('mongodb+srv://shettymanoj111:qYeTATP5F4JItHUw@cluster0.luureav.mongodb.net/dev_tinder?retryWrites=true&w=majority&appName=Cluster0');  // connectimg particular cluster
// /dev-tinder connceting to particular db
}

module.exports=connection;  // here directly exporting a function not with key value 

// module.exports={connection}  here need to access this function in app.js has const {connection} = require()_

