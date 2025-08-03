const mongoose= require('mongoose');

const userSchema=  new mongoose.Schema ({
    firstName : {
        type: String
    },
    lastName :{
        type : String
    },
    emailId : {
        type : String
    },
    password : {
        type : String
    },
    age : {
        type : String
    },
    gender : {
        type : String
    }

})
userSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();  // 🧠 access the incoming update
    console.log('Update object before save:', update);

    const update1 = this.emailId;  // 🧠 access the incoming update
    console.log('Update object before save:', update1);
  
    // Optionally modify fields
    if (update.emailId) {
      update.emailId = update.emailId.trim();  // remove unwanted spaces
    }
  
    // If you change anything, set it back
    this.setUpdate(update);
  
    next();
  });
  

// then we create a model aka collection using above schema
//const user= mongoose.model("User",userSchema)   // this model is a like class a type USer which create its own objects or indtancess which are nothing but records or documents

module.exports= mongoose.model("User",userSchema);  // this will return a class of named User