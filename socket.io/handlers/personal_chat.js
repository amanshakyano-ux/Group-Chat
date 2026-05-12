const {formatName} = require("../../utils/strFormater")

module.exports = (socket, io) => {
  //setting connection with new socket

   socket.on("join_room",(room)=>{

      socket.join(room);

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
