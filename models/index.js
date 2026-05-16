const Message = require("../models/message")
const User = require("../models/user")
const ArchivedMessage = require("../models/archivedMsg")

//Association 
User.hasMany(Message,{foreignKey:"userId",onDelete:"cascade"})
Message.belongsTo(User,{foreignKey:"userId"})



User.hasMany(ArchivedMessage,{foreignKey:"userId", onDelete:"cascade"})
ArchivedMessage.belongsTo(User,{foreignKey:"userId"})



