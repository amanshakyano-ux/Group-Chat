const {DataTypes} = require("sequelize")
const sequelize = require("../utils/db-connection")
const User =  sequelize.define("User",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
    type:DataTypes.STRING,
    allowNull:false
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
     type:DataTypes.STRING,
     allowNull:false
    }
})
module.exports = User;