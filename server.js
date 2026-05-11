 require("dotenv").config();

 //Importing
 const express = require("express")
 const http = require("http")
 const WebSocket = require("ws")
 const db = require("./utils/db-connection")
 const userRouter = require("./routes/user")
 const msgRouter = require("./routes/message")
 const path = require("path")
 const cors  = require("cors")
 require("./models")
 const {Server} = require("socket.io") 
  


 const app = express();
 const server = http.createServer(app)        //connection through http
const io = new Server(server)                //  making instance

io.on("connection",(socket)=>{       
  socket.on("user-message",(message)=>{
    io.emit("message",message)                //Ye tumhare Socket.IO server ka realtime communication center hai.
  })
})

app.set("io", io)                                  //Ye line Express app ke andar io object ko globally store karti hai.       
 app.use(express.static("public"))

app.use(cors())
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))
 


 //Routes
 app.use("/user",userRouter)
 app.use("/message",msgRouter)
 



//error middleware
app.use((err,req,res,next)=>{
 console.error(err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
})



 

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","login.html"))
})
app.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","signup.html"))
})
app.get("/chat",(req,res)=>{
  res.sendFile(path.join(__dirname,"views","chat.html"))
})


 db.sync({alter:true})
   .then(()=>{
     server.listen(process.env.PORT,()=>{
        console.log("SERVER IS RUNNING AT : ", process.env.PORT)
     })
   })
   .catch((err)=>{
    console.log(`SERVER IS NOT RUNNING :`, err.message)
   })




