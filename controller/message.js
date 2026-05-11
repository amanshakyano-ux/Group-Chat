const Message = require("../models/message");
const { isStrInvalid } = require("../controller/user");
const { json } = require("sequelize");
const User = require("../models/user")
const {formatName} = require("../utils/strFormater")


const addMessage = async (req, res, next) => {
  try {
    const io = req.app.get("io")                
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
    const firstName = formatName(user.username)
    const messageWithUser = {
      id: savedMessage.id,
      message: savedMessage.message,
      userId: savedMessage.userId,
      createdAt: savedMessage.createdAt,
      userName: firstName,   // 👈 important
    };
    io.emit("message", messageWithUser)          //Server sab connected clients ko "message" event bhej raha hai along with complete message object.
 
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

  attributes: ["message", "userId", "createdAt"],

  include: [
    {
      model: User,
      attributes: ["username"]
    }
  ]

});
const formattedMessages = allMessages.map((msg)=>({

  message: msg.message,

  userId: msg.userId,

  createdAt: msg.createdAt,

  userName: formatName(msg.User.username)

}));
    return res.status(200).json({
      success: true,
      data: formattedMessages
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { addMessage,retrieve };
