const Message = require("../models/message")
const User = require("../models/user")

//Association 
User.hasMany(Message,{foreignKey:"userId",onDelete:"cascade"})
Message.belongsTo(User,{foreignKey:"userId"})


