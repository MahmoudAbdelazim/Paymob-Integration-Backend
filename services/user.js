const User = require("../models/user");

exports.getAllUsers = async () => {
  const users = await User.findAll({
    where: { role: "USER" },
    columns: ["username", "firstName", "lastName", "phoneNumber"],
  });
  return { status: 200, users: users };
};
