

const express=require('express');
const connection=require('./config/database');
const app= express(); // creating an instance of an express through calling function
const User= require('./models/user')  // since we directly exported user calss there we can import with any name

// crerating a signup api post req ahndling

app.post('/signup', async (req, res)=>{
    const userObj= {
        firstName : "akshay",
        lastName : "shay",
        emailId : "akshay@gmail.com",
        password : "akshay",
    }

    // creating a new istnace of the User model
    const user= new User(userObj);

    try {
        await user.save();  // tghis in hidsight using inserOne function in mongo which returns a promise so we need to use async in handler

        res.send('User added succesfullky')
    }
    catch (err) {
      res.status(400).send('Error hppend with'+ err.message)
    }
    
})


connection().then(()=>{
    console.log('Connection establised  to databse dev-tinder')
    app.listen(3500, ()=>{
        console.log('starting a new project');
    })
}).catch((err)=>{
  console.log(err.mesage);
})

// first we need to establish a connection with db then should listen to user request i.e server listnening

