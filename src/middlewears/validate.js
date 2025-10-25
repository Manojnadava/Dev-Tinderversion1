const validator= require('validator')

const validateRequestBody = (req,res,next) => {
    const { firstName, lastName, emailId, password ,age,about,skills,photoUrl} = req.body;  //object destructuring to extract properties from the request body

    console.log(firstName, lastName, emailId, password);
  if (! req.update)  {
    console.log('Enterd main validation block')
    if (!firstName || typeof firstName !== 'string') {
        throw new Error("Invalid or missing 'firstName'");
    }

    if (!lastName || typeof lastName !== 'string') {
        throw new Error("Invalid or missing 'lastName'");
    }

    //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailId || ! validator.isEmail(emailId)) {
        return res.status(400).json({ error: "Invalid or missing 'emailId'" });
    }

    if (!password || typeof password !== 'string' || password.length < 6 || ! validator.isStrongPassword(password, { minLength: 6 })) {
        return res.status(400).json({ error: "'password' must be at least 6 characters long" });
    }

    return  next();
  }
    console.log(req.body.age + req.body.about+ req.body.photoUrl+req.body.skills)
    if( (req.body.age != undefined ) ) {
       (age>=50 || age <=18 || ! validator.isNumeric(age))
        {
        return res.status(400).json({ error: "Not a Valida age" });
    }

    } 
    if (req.body.about != undefined)   {
        (typeof about !='string' || (about.length <10)  )   
        {
        return res.status(400).json({ error: "Increase About Length" });
    }


    } 
    if( (req.body.photoUrl != undefined) ){
        if (validator.isURL(photoUrl)) {
            return res.status(400).json({ error: `${photoUrl} is not Valid` });
        }
    } 
    if (req.body.skills != undefined) {
        if(skills.length < 1) {
            return res.status(400).json({ error: "Not Enough Skills" });
        }
     
    }
    if (  req.body.password != undefined  & req.update_password) {
        if (!password || typeof password !== 'string' || password.length < 6 || ! validator.isStrongPassword(password, { minLength: 6 })) {
            return res.status(400).json({ error: "'password' must be at least 6 characters long" });
        }
    }
    next() ;
};

module.exports = validateRequestBody;