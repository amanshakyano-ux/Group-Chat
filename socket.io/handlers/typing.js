
const{formatName} = require("../../utils/strFormater")

module.exports = (socket, io) => {
  socket.on("typing_start", ({ room}) => {
     console.log(socket.user);
  socket.to(room).emit("show_typing", {
    user: formatName(socket.user.username)
  });
});

socket.on("typing_stop", ({ room }) => {
  socket.to(room).emit("hide_typing");
});
  
   
};