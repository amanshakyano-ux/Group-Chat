require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {formatName} = require("../utils/strFormater")
function generateToken(userId,userName)
{
    return jwt.sign({userId:userId,username:userName},process.env.JWT_KEY)
}

function isStrInvalid(str)
{
   return (!str || !str.trim.length === 0) 
}
const signup = async(req,res,next)=>{
try{
   const {username,email,phoneNumber,password }= req.body;
    if(isStrInvalid(username) || isStrInvalid(email) || isStrInvalid(password) || isStrInvalid(phoneNumber)){
         const err = new Error("All fields are mandatory");
         err.statusCode = 400;
         return next(err);
    }

   let user = await User.findOne({where:{phoneNumber}})
   if(user) 
   {
    const err = new Error("User Already Exists With this Mob Num");
         err.statusCode = 409;
         return next(err);

   }
    const hashedPass = await bcrypt.hash(password,10)
   await User.create({
    username:username,
    email:email,
    phoneNumber:phoneNumber,
    password:hashedPass
   })
   

res.status(201).json({success:true,
                message:"User signedUp successfully"
            })


}catch(err){
    next(err);
}
}
const login = async(req,res,next)=>{
   
    try{
        const {phoneNumber,password} = req.body;
        if(isStrInvalid(password))
        {
        const err = new Error("All fields are mandatory");
         err.statusCode = 401;
         return next(err);
        }
        const user = await User.findOne({where:{phoneNumber}})
        if(user)
        {
            const rightPassword = user.password
            const isMatch = await bcrypt.compare(password,rightPassword)
            if(!isMatch)
            {
              return  res.status(401).json({message:"Password is incorrect",success:false})
            }else
            {
                res.status(200).json({message:"Password is correct", token:generateToken(user.id, user.username)})
            }
        }else 
        {
           return res.status(404).json({
                message:"User does not exist",
                success:false
            })
        }



    }catch(err){
next(err);
    }


}

const tokenDecode = async(req,res,next)=>{
    try{
const userId = req.user.id;
console.log(userId)
    res.status(200).json({success:true,userId:userId})
    }catch(err)
    {
        next(err)
    }
    
}
module.exports = {
    signup,login,isStrInvalid,tokenDecode
}
