let onlineUsers = 0;

module.exports = (socket, io) => {
  //setting connection with new socke
   onlineUsers++;
   console.log(
      "Users Online :",
      onlineUsers
   );
   io.emit("online_users",onlineUsers)


   socket.on("disconnect",()=>{



      socket.rooms.forEach((room) => {

      if(room !== socket.id){

         const roomSize =
         (io.sockets.adapter.rooms.get(room)?.size || 1) - 1;

         io.to(room).emit(
            "room_users_count",
            roomSize
         );

      }

   });
    onlineUsers--;
     console.log(
         "Users Online :",
         onlineUsers
      );

      io.emit("online_users",
        onlineUsers
      )

   })
   
};