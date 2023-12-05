const User = require("../models/user");
const Transaction = require("../models/transaction");

exports.getUserByUsername = async (username) => {
  const user = await User.findOne({ where: { username: username } });
  return user;
};

exports.getUserByPhoneNumber = async (phoneNumber) => {
  const user = await User.findOne({ where: { phoneNumber: phoneNumber } });
  return user;
};

exports.createUser = async (user) => {
  const createdUser = await User.create(user);
  return createdUser;
};

exports.saveTransaction = async (user, order, amount) => {
  const transaction = await Transaction.create({
    amount: amount,
    done: false,
    from: user.username,
    receiverPhone: order.receiverPhone,
    receiverEmail: order.receiverEmail,
    receiverCompanyName: order.receiverCompanyName,
    receiverCountry: order.receiverCountry,
    receiverCity: order.receiverCity,
  });
  return transaction;
};

exports.getTransactionsOfUser = async (username) => {
  const transactions = await Transaction.findAll({
    where: { from: username },
  });
  return transactions;
};
