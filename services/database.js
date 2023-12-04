const User = require("../models/user");

exports.getUserByUsername = async (username) => {
  const user = await User.findOne({ where: { username: username } });
  return user;
}

exports.getUserByPhoneNumber = async (phoneNumber) => {
  const user = await User.findOne({ where: { phoneNumber: phoneNumber } });
  return user;
}

exports.createUser = async(user) => {
  const createdUser = await User.create(user);
  return createdUser;
}