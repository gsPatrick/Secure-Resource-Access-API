const {DataType, DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {

    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    acessLevel: {
        type:  DataTypes.ENUM ('user', 'admin', 'superAdmin'),
        allowNull: false,
        defaultValue: 'user',
    }
}, {
    hooks: {
        beforeCreate: (user, options) => {
            user.accessLevel = 'users'; 
        }
    }
});

module.exports = User;