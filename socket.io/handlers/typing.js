
const{formatName} = require("../../utils/strFormater")

module.exports = (socket, io) => {
  socket.on("typing_start", ({ room}) => {
     
  socket.to(room).emit("show_typing", {
    user: formatName(socket.user.username)
  });
});

socket.on("typing_stop", ({ room }) => {
  socket.to(room).emit("hide_typing");
});
  
   
};