const { Server } = require("socket.io");
const socketAuth = require("./middleware");
const chatHandler = require("./handlers/chat");

module.exports = (server) => {
  try {
    const io = new Server(server, {
      ////  making instance
      cors: {
        //here cors allow if test level only
        origin:
          process.env.NODE_ENV === "production"
            ? false
            : ["http://localhost:3001", "http://localhost:5500"],
      },
    });

    socketAuth(io);

    io.on("connection", (socket) => {
      chatHandler(socket, io);
    });
    return io;
  } catch (err) {
    next(err);
  }
};
