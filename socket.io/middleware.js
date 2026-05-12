const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authorization token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_KEY);

      const user = await User.findByPk(decoded.userId);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;

      next();
    } catch (err) {
      return next(new Error("Token Invalid"));
    }
  });
};
