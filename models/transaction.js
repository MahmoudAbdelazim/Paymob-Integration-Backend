const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Transaction = sequelize.define("transaction", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  done: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  from: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  receiverPhone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  receiverEmail: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  receiverCompanyName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  receiverCountry: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  receiverCity: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Transaction;
