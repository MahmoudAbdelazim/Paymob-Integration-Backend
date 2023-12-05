const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authValidators = require("../validators/auth");
const database = require("./database");

exports.signupService = async (
  username,
  password,
  phoneNumber,
  firstName,
  lastName
) => {
  loginValidation = authValidators.validateLogin(
    username,
    password,
    phoneNumber,
    firstName,
    lastName
  );
  if (loginValidation.valid == false) {
    return { status: 400, message: loginValidation.message };
  }
  let presentUser = await database.getUserByUsername(username);
  if (presentUser) {
    return { status: 400, message: "username already taken" };
  }
  const hashedPw = await bcrypt.hash(password, 12);
  const user = await database.createUser({
    username: username,
    password: hashedPw,
    phoneNumber: phoneNumber,
    firstName: firstName,
    lastName: lastName,
    role: "USER",
  });
  console.log(user);
  return { status: 200 };
};

exports.loginService = async (usernameOrPhoneNumber, password) => {
  let user = await database.getUserByUsername(usernameOrPhoneNumber);
  if (!user) {
    user = await database.getUserByPhoneNumber(usernameOrPhoneNumber);
  }
  if (!user) {
    return { status: 404, message: "user not found" };
  } else {
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return { status: 401, message: "incorrect password" };
    } else {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          phoneNumber: user.phoneNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        process.env.JWT_SECRET
      );
      const response = {
        token: token,
        username: user.username,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      return { status: 200, user: response };
    }
  }
};

exports.getUserBasicInfoService = async (user) => {
  return {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    role: user.role,
  };
};
