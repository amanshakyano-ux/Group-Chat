const Message = require("../models/message");
const { isStrInvalid } = require("../controller/user");
const { json } = require("sequelize");
const  WebSocket = require("ws")
const User = require("../models/user")

const addMessage = async (req, res, next) => {
  try {
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
    const messageWithUser = {
  id: savedMessage.id,
  message: savedMessage.message,
  userId: savedMessage.userId,
  createdAt: savedMessage.createdAt,
  userName: user.username,   // 👈 important
};
 

    const wss = req.app.get("wss")
    wss.clients.forEach(client => {
      if(client.readyState === WebSocket.OPEN)
      {
        client.send(
          JSON.stringify(messageWithUser)
        )
      }
      
    });
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
      attributes: ["message", "userId","createdAt"]
    });

    return res.status(200).json({
      success: true,
      data: allMessages
    });

  } catch (err) {
    next(err);
  }
};
module.exports = { addMessage,retrieve };
