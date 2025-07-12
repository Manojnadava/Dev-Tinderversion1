

const express=require('express');

const app= express(); // creating an instance of an express through calling function

app.get(/^\/orders\/[0-9]{2}.{2}.+done$/,(req,res)=>{
    res.send({firstName: 'Mw]eo', LastName:'hij'});
   // here \ escape char [0-9] any number with total length 2 . is anything with total length 2 again . i.e anything with lenth 1 atleast ending wioth done 
})

app.get('/user',(req,res)=>{
    // to acess query paramter like localhost:7777/user?userid=101&password=skjdjidn
   // console.log(req.query);
   res.send('hellos')
})

//Used to make dynamic routes  likes  ocalhost:7777/user/userid/name
app.get('/user/:userid/:name',(req,res)=>{
    console.log(req.params);
    res.send(req.params);
})



app.listen(3500, ()=>{
    console.log('starting a new project');
})