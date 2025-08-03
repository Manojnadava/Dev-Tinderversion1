

const express=require('express');
const connection=require('./config/database');
const app= express(); // creating an instance of an express through calling function
const User= require('./models/user')  // since we directly exported user calss there we can import with any name


app.use(express.json()); // which converts json data from post req to js object and attched to req.body
// crerating a signup api post req handling

app.post('/signup', async (req, res)=>{
  // ajson obj diff to js obj js obj is key value pair but in json both should be string
    // creating a new istnace of the User model
  console.log( req.body);  //serverundefined  if no middelwear used
    const userObj= req.body;   // our server cant directly read data req.body as it is in json format so we neeed middelwear
    const user= new User(userObj);   //here this User isa model which uliton frame work or structure of schema user_schema

    try {
        await user.save();  // tghis in hidsight using inserOne function in mongo which returns a promise so we need to use async in handler

        res.send('User added succesfullky')
    }
    catch (err) {
      res.status(400).send('Error hppend with'+ err.message)
    }
    
})


// get user data individual 
app.get('/user', async (req,res)=>{
    try {
        const useremail = req.body.user_email;
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

app.delete('/user',async (req,res)=>{
   const userid = req.body.user_id;
   res.send("User deleted Succesfully");
   
 try{
    await User.findByIdAndDelete(userid);
    
 } catch(err) {
    res.send("Something Not right");
 }
    
})


// Update a one particular record of a one document in a collection using Patch
 app.patch('/update', async (req, res)=>{
 try{
     const {emailId} = req.body;
     console.log(emailId)
     const user= await User.findByIdAndUpdate(req.body.user_id, {emailId}, {returnOriginal:false})
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

