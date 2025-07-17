

const express=require('express');

const app= express(); // creating an instance of an express through calling function

const  {adminAuth,userAuth}= require('./middlewears/auth');

//One route can have a multiple route handler function

// we can also do like this 
// app.use('/user', [rh1, rh2.rh3], rh4,rh5)

// app.use('/user',
//     (req,res,next)=>{
//     //console.log('')  // tis actually middlewaer which is nothing but coming inbetween req and route handler
//     next(); // here quickly jumps to next route handler and excute that function and once done it will execute below code i.e
//     // again executing line no 14 which will throw error as response sent already
//    // res.send('First route handler')  // sending response to back where req made 
//    //if we not sending response to req then node will not pass to next route handler unless we use next
//    // once we send res back to url where req made the second route handler throews error as once send res connection over
// },
// (req,res, next)=>{
//     console.log('second')
//     res.send('Second route handler')  // sending response to back where req made   
// this call back is a actual route hndler
//     next();
// },
// (req,res,next)=>{
//     console.log('Super 3')
//     //res.send('Third route handler')  // sending response to back where req made 
//     next();
// }
// )
//Handle auth middleware for all get post de;lete admin path routes

//app.use('/admin',adminAuth.adminAuth) // if we not use bracket to acces adminAuth

app.use('/admin',adminAuth) 

app.post('/user', (req,res, next)=>{
    res.send('post req no use of user auth middlewaer')
    next();
})
app.get('/user', userAuth , (req,res)=>{
    res.send('get req  use of user auth')
})

app.get('/getUser', userAuth , (req,res)=>{
    try{
        throw new Error('Erorr on getting user list');  // will create a new err objhect
       res.send('get no of user')
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})

app.post('/getUser', userAuth , (req,res)=>{
    throw new Error('Erorr on getting user post list');  // will create a new err objhect
    res.send('get no of user')
})



// why middlewear requires actually
app.get('/admin/getAllData', (req,res)=>{
    // first chek whether req is authenticated i.e is admin ia valid one
    res.send('All data sent');
    
})

app.get('/admin/deletUser', (req,res)=>{
// first chek whether req is authenticated i.e is admin ia valid one herealso
    res.send('Deleted User');
})

// middleware can also be used to catch error orginated from other middlewaer or route handlet like try and catch

app.use('/', (err,req,res,next)=>{
  if(err){
    res.status(500).send(err.message);
  }
})


app.listen(3500, ()=>{
    console.log('starting a new project');
})