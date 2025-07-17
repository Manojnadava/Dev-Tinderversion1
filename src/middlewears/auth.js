const adminAuth=(req,res,next)=>{
    const token='xyz';
    const isadminValid= token==='xyz';
    (isadminValid) ? next() : res.status(401).send('All data not  sent');
}

const userAuth=(req,res,next)=>{
    const token='xyz';
    const isadminValid= token==='xyz';
    (isadminValid) ? next() : res.status(401).send('All data not  sent');
}

module.exports={
    adminAuth,
    userAuth
}