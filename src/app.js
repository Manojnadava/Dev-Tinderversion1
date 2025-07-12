

const express=require('express');

const app= express(); // creating an instance of an express through calling function

//One route can have a multiple route handler function

// we can also do like this 
// app.use('/user', [rh1, rh2.rh3], rh4,rh5)

app.use('/user',
    (req,res,next)=>{
    //console.log('')
    next(); // here quickly jumps to next route handler and excute that function and once done it will execute below code i.e
    // again executing line no 14 which will throw error as response sent already
   // res.send('First route handler')  // sending response to back where req made 
   //if we not sending response to req then node will not pass to next route handler unless we use next
   // once we send res back to url where req made the second route handler throews error as once send res connection over
},
(req,res, next)=>{
    console.log('second')
    res.send('Second route handler')  // sending response to back where req made 
    next();
},
(req,res,next)=>{
    console.log('Super 3')
    //res.send('Third route handler')  // sending response to back where req made 
    next();
}
)


app.listen(3500, ()=>{
    console.log('starting a new project');
})