module.exports = (socket, io) => {
  //setting connection with new socke
  socket.on("chat-message", (message) => {
    console.log("User ", socket.user.username, message);
  });
};
