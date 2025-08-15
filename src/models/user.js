const mongoose= require('mongoose');
const regex=/^https?:\/\/.+\.(jpg|png)$/
const skills=['JS','SQL','React','Node','CSS']
const validator= require('validator');  // this is a npm module which we can use to validate email and other things

// to validate user email we are using external module validator

const userSchema=  new mongoose.Schema ({
    firstName : {
        type: String,
        required: true,
        trim: true,
        match:[/^[a-zA-Z ]{5,20}$/,'Invalid user Name']   // this is short hand for method validate and a regex to vlidate name
    },
    lastName :{
        type : String,
        trim: true,
        match:[/^[a-zA-Z ]{5,20}$/,'Invalid last user Name']
    },
    emailId : {
        type : String,
        required: true,
        unique:true,
        trim: true  , // removes whitespoace anywhere from emailId
        validate : {
            validator:(value)=>validator.isEmail(value),
            message:props=>`${props.value + props.path} is not a valid email`
        }
    },
    password : {
        type : String,
        required: true
    },
    age : {
        type : String,
        min : [18, 'Underage'],
        max : 54
    },
    gender : {
        type : String
    },
    photoUrl : {
        type: String,
        validate : {
            validator : (value)=> {
               return regex.test(value)
            },
            message : (props)=> `${props.value} Not a Valid Url`
        }
    },
    about : {
        type: String ,
        default:"This is about section of user"
    },
    skills :{
        type: [String] , // this will store multiple value so barray then inside type of it
        validate : [

            {
                validator : (v)=> {       console.log(v);
                 const result= v.filter(value=>!skills.includes(value))
                 this.result=result;
                 console.log(result);
                 if(result.length>0) {
                    return false;
                 }
                },
                message: (props)=> `${this.result} Not a Valid Skill`
            }, 
            {
                validator : (v)=> {       console.log(v);
                 const result= v.length;
                 if(result < 2 & result > 7){
                    return false;
                 }
                },
                message: (props)=> `Not Enough Skills`
            }
        ]
            
           
        
    }

},{ timestamps: true,  // this will add createdAt and updatedAt fields to the schema
    versionKey: false  // this will remove __v field from the schema
});


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