//require keyword is added as schema so that in document those fileds are must otherwise they throw error from mongodb- these are checks at databse level

const express=require('express');
const connection=require('./config/database');
const validator= require('validator')
const app= express(); // creating an instance of an express through calling function
const User= require('./models/user')  // since we directly exported user calss there we can import with any name
const validateRequestBody=require('./util/validate');
//const {encryptPassword, matchPassword} = require('./util/encrypt'); // importing the encryptPassword and matchPassword functions from encrypt.js file
const cookieparser=require('cookie-parser')
const {userAuth}= require('./middlewears/auth');

User.init()  // ensures indexes are built
  .then(() => console.log('Indexes are ensured'))
  .catch((err) => console.error('Index error', err));


app.use(express.json()); // which converts json data from post req to js object and attched to req.body
// crerating a signup api post req handling

app.use(cookieparser()); // which will parse or convert the cookie to object by adding the key value pair and asign to req.cookies




//Login Autrhentication API
app.post('/login', async (req,res)=>{
  const {emailId, password}= req.body;
  console.log(password);
  try{
     const valid= validator.isEmail(emailId);
     console.log(valid);
     if(!valid) {
      throw new Error('Invalid Credentials')
     }
     const user= await  User.findOne({emailId}).select('+password');
     console.log(user);
     const matchPasswords= await user.verifyPassword;
     if(!matchPasswords) {
      throw new Error('Invalid Credentials')
     }
     // Login successful
     // Create a JWT token
     const token=  await user.getJwt();
     // add this jwt token to cookie and send the response back to user
     res.cookie('token',token,{httpOnly:true ,maxAge:1000*60*60 , secure: true});
     res.send('Login successfull');


  } catch (err) {
   res.status(401).send('Error with'+ err.message);
  }

})

app.get('/profile', userAuth, async (req,res)=>{
  res.send(req.user);
})

app.post('/signup', async (req, res)=>{
  // ajson obj diff to js obj js obj is key value pair but in json both should be string
    // creating a new istnace of the User model
  console.log( req.body);  //serverundefined  if no middelwear used
    const userObj= req.body;   // our server cant directly read data req.body as it is in json format so we neeed middelwear
    

    try {
       //User data validation
        validateRequestBody(req,res);
        console.log('Validation done ');
        const { firstName, lastName, emailId, password } = req.body; 


       //Password Hashing taken care at schema level
       

       //console.log(hashedpassword);

       // saving the user 
       const user= new User({
        firstName,
        lastName,
        emailId,
        password,  // here we are using the encryptPassword function to hash the password
        skills: req.body.skills || [],  // if skills not provided then it will be an empty array
        photoUrl: req.body.photoUrl   // if photoUrl not provided then it will be an empty string
       });   //here this User isa model which uliton frame work or structure of schema user_schema
      await user.save();  // this in hidsight using inserOne function in mongo which returns a promise so we need to use async in handler

        res.send('User added succesfully')
    }
    catch (err) {
      res.status(400).send('Error happend with'+ err.message)
    }
    
})


// get user data individual 
app.get('/user', userAuth,async (req,res)=>{
    try {
        const useremail = req.body.user_email;
        console.log
       const user=  await User.findOne({emailId : useremail})  // retrun a single obj
       console.log(user)
       if(user) {
        res.send(user);
       }
       else {
        res.status(401).send("User not found");
       }
       

    } catch(err) {
        res.status(501).send('Something went wrong'+ err.mesage);
    }
})

// Feed APi - GET/ APi  Feed get all users from db
app.get('/feed', async (req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);
    } catch(err) {
        res.status(401).send(err.message);
    }
   
    
})


//to delete a particluare user from db

app.delete('/user',userAuth,async (req,res)=>{
   const userid = req.body.user_id;
   res.send("User deleted Succesfully");
   
 try{
    await User.findByIdAndDelete(userid);
    
 } catch(err) {
    res.send("Something Not right");
 }
    
})
// Update a user document using PUT
app.put('/user/:userid',userAuth, async (req, res) => {
  try {
    const userId = req.params.userid; // Extract user ID from URL params
    const updatedData = req.body; // Data to update from the request body
    const { emailId,skills,photoUrl } = updatedData; // Destructure emailId from the request body
    console.log(emailId,skills,photoUrl);

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }); // Update and return the updated document
    if (user) {
      res.send(user); // Send the updated user data
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send('Error updating user: ' + err.message);
  }
});


// Update a one particular record of a one document in a collection using Patch
 app.patch('/update/:userid',userAuth, async (req, res)=>{
 try{
     const xeff = req.body;
     console.log(xeff)
     const user= await User.findByIdAndUpdate(req.params.userid, xeff, {returnOriginal:false,runValidators:true}); // returnOriginal:false ensures that the updated document is returned, runValidators:true ensures that the update respects the schema validation rules
     console.log(user);
    res.send(user);
 }  catch(err) {
    res.status(401).send('Resoure unable to update')
 }
   
 })



connection().then(()=>{
    console.log('Connection establised  to databse dev-tinder')
    app.listen(3500, ()=>{
        console.log('starting a new project');
    })
}).catch((err)=>{
  console.log('Not good');
})

// first we need to establish a connection with db then should listen to user request i.e server listnening

