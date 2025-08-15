const validator= require('validator')

const validateRequestBody = (req) => {
    const { firstName, lastName, emailId, password } = req.body;  //object destructuring to extract properties from the request body

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

    if (!password || typeof password !== 'string' || password.length < 6 || validator.isStrongPassword(password, { minLength: 6 })) {
        return res.status(400).json({ error: "'password' must be at least 6 characters long" });
    }

    return;
};

module.exports = validateRequestBody;