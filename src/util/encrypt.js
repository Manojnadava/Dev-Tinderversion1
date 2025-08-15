const bcrypt= require('bcrypt');
const saltRounds=10;

const encryptPassword=async (password)=>{
    const hashpassword= await bcrypt.hash(password , saltRounds)
    return hashpassword;
}

const matchPassword=async (password,storedhash)=>{
    const result= await bcrypt.compare(password , storedhash)
    return result;
}


module.exports={encryptPassword,matchPassword};