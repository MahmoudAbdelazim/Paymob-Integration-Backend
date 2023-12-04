const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  role: {
    type: Sequelize.ENUM(["USER", "ADMIN"]),
    allowNull: false,
  },
});

module.exports = User;
