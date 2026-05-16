 const { DataTypes } = require("sequelize")
const sequelize = require("../utils/db-connection")
 
const ArchivedMessage= sequelize.define("ArchivedMessage",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    message:{
     type:DataTypes.STRING,
     allowNull:false
    }
})
module.exports = ArchivedMessage;