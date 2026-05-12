require("dotenv").config();
const jwt = require("jsonwebtoken")
const User = require("../models/user")



const authenticate = async(req,res , next)=>{
    try{
        const token = req.headers["authorization"]
        const decoded = jwt.verify(token,process.env.JWT_KEY)


        const foundUser = await User.findByPk(decoded.userId)

         req.user = foundUser
            next();
        

    }catch(err){
        console.log("Token Invalid")
      return res.status(401).json({success:false,message:"Token is invalid"})
    }
}



 

// const socketAuth = async (socket,next)=>{

//    try{

//       const token = socket.handshake.auth.token;

//       if(!token){
//          return next(new Error("Authorization token missing"))
//       }

//       const decoded = jwt.verify(token, process.env.JWT_KEY);

//       const user = await User.findByPk(decoded.userId);

//       if(!user){
//          return next(new Error("User not found"))
//       }

//       socket.user = user;

//       next();

//    }catch(err){

//       return next(new Error("Token Invalid"))

//    }

// }

 
module.exports = {authenticate};