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