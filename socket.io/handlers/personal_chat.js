const {formatName} = require("../../utils/strFormater")

const User = require("../../models/user")

module.exports =  (socket, io) => {
  //setting connection with new socket

   socket.on("join_room",async (room)=>{


      const users = room.split("-");

      const receiverEmail =
      users.find(
         email =>
         email !== socket.user.email
      ); 

       const user = await User.findOne({
         where:{
            email : receiverEmail
         }
       })

        if(!user){
         socket.emit("room_error",{
            message:"User not found"
         })
         return;
        }
      socket.join(room);

       const roomSize =
   io.sockets.adapter.rooms.get(room)?.size || 0;

   io.to(room).emit("room_users_count", roomSize);

      socket.emit("room_joined",{
       room,roomSize
      })

      console.log(socket.user.username,"joined",room);

   });

   // PRIVATE MESSAGE
   socket.on("private_message",(data)=>{

      io.to(data.room).emit("receive_private_message",{

         room : data.room,

         message : data.message,

         userId : socket.user.id,

         userName : formatName(socket.user.username),

         createdAt : new Date()

      });

   });
};
