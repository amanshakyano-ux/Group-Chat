const Message = require("../models/message");
const { isStrInvalid } = require("../controller/user");
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
       userId
    });

    res
      .status(201)
      .json({ success: true, message: "Message sent", data: savedMessage });
  } catch (err) {
    next(err);
  }
};

module.exports = {addMessage}