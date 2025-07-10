

const express=require('express');

const app= express(); // creating an instance of an express through calling function

app.use("/test",(req,res)=>{
    res.send("Hello from server for /test")
})   // req and res hanlder for url /test

app.use((req,res)=>{
    res.send("Hello from server")
})   // req and res hanlder

app.use("/test",(req,res)=>{
    res.send("Hello from server for test")
})   // req and res hanlder for url /test

app.listen(3500, ()=>{
    console.log('starting a new project');
})