require("dotenv").config();
const jwt = require("jsonwebtoken")
const User = require("../models/user")



const authenticate = async(req,res , next)=>{
    try{
        const token = req.headers["authorization"]
        const user = jwt.verify(token,process.env.JWT_KEY)
        User.findByPk(user.userId)
          .then(user=>{
            req.user = user
            next();
          })

    }catch(err){
        console.log("Token Invalid")
      return res.status(401).json({success:false,message:"Token is invalid"})
    }
}
module.exports = {authenticate};