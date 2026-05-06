 require("dotenv").config();

 //Importing
 const express = require("express")
 const db = require("./utils/db-connection")
 const userRoutes = require("./routes/user")
 const path = require("path")
 const cors  = require("cors")
 require("./models/user")



 const app = express();
 app.use(express.static("public"))

app.use(cors())
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))
 


 //Routes
 app.use("/user",userRoutes)
 



//error middleware
app.use((err,req,res,next)=>{
 console.error(err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
})


//Paths
app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","login.html"))
})
app.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","signup.html"))
})


 db.sync({alter:true})
   .then(()=>{
     app.listen(process.env.PORT,()=>{
        console.log("SERVER IS RUNNING AT : ", process.env.PORT)
     })
   })
   .catch((err)=>{
    console.log(`SERVER IS NOT RUNNING :`, err.message)
   })




