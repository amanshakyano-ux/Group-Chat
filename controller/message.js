const Message = require("../models/message");
const { isStrInvalid } = require("../controller/user");
const { json } = require("sequelize");
const User = require("../models/user")
const {formatName} = require("../utils/strFormater")
const s3 = require("../utils/s3Service")
const {
   PutObjectCommand
} = require("@aws-sdk/client-s3");

const addMessage = async (req, res, next) => {
  try {
    const io = req.app.get("io")                
    const userId = req.user.id;
    const { message } = req.body;
    if (isStrInvalid(message)) {
      const err = new Error("Fill the fields");
      err.statusCode = 400;
      throw err;
    }
    const savedMessage = await Message.create({
      message,
      userId,
    });
    const user = await User.findByPk(userId);
    const firstName = formatName(user.username)
    const messageWithUser = {
      id: savedMessage.id,
      message: savedMessage.message,
      userId: savedMessage.userId,
      createdAt: savedMessage.createdAt,
      userName: firstName,   // 👈 important
    };
    io.emit("message", messageWithUser)      
     //Server sab connected clients ko "message" event bhej raha hai along with complete message object.
 
    res
      .status(201)
      .json({ success: true, message: "Message sent", data: savedMessage });
  } catch (err) {
    next(err);
  }
};

const retrieve = async (req, res, next) => {
  try {
       
    const allMessages = await Message.findAll({

  attributes: ["message", "userId", "createdAt"],

  include: [
    {
      model: User,
      attributes: ["username"]
    }
  ]

});
const formattedMessages = allMessages.map((msg)=>({

  message: msg.message,

  userId: msg.userId,

  createdAt: msg.createdAt,

  userName: formatName(msg.User.username)

}));
    return res.status(200).json({
      success: true,
      data: formattedMessages
    });

  } catch (err) {
    next(err);
  }
};

const addFile = async(req,res,next)=>{
try{

const io = req.app.get("io")       
       
     const userId = req.user.id;

const { room } = req.body;

 

const file = req.file;

 
   
    if(!file){

   const err = new Error(
      "No file uploaded"
   );
      err.statusCode = 400;

         throw err;
  }
    const fileName = `${Date.now()}-${ file.originalname }`;


    const command =  new PutObjectCommand({

         Bucket: process.env.AWS_BUCKET_NAME,

         Key:  fileName,

         Body: file.buffer,

         ContentType: file.mimetype
      });

       

       const response = await s3.send(command);
       console.log("RESPONSE--->",response)
       let mediaUrl;
if(response){

    mediaUrl =
   `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
      const user =
      await User.findByPk(userId);
      
      console.log("MEDIA LINK _____> ",mediaUrl)
      io.emit("broadcast-media",
        {
            

            mediaUrl,

            mediaType :
            file.mimetype,

            userId,

            userName :
            formatName(
               user.username
            ),

            createdAt :
            new Date()
        }
      )
      io.to(room).emit("receive_media",
        {
          
            room,

            mediaUrl,

            mediaType :
            file.mimetype,

            userId,

            userName :
            formatName(
               user.username
            ),

            createdAt :
            new Date()
      })
       return res.status(200).json({

         success : true,

         mediaUrl

      });



}
  catch(err){
    next(err)
  }
    


}

module.exports = { addMessage,retrieve,addFile };
