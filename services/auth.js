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
    return { status: 400, message: "username already registered" };
  }
  presentUser = await database.getUserByPhoneNumber(phoneNumber);
  if (presentUser) {
    return { status: 400, message: "phone number already registered" };
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
  return { status: 200 };
};

function generateOTP() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

const sendOTPMessage = async (otp, phoneNumber) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  const message = await client.messages.create({
    body: `You OTP verification code is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
  console.log(message.sid);
};

exports.loginService = async (usernameOrPhoneNumber, password) => {
  console.log(usernameOrPhoneNumber);
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
      const otp = generateOTP();
      await sendOTPMessage(otp, user.phoneNumber);
      user.verificationCode = otp;
      console.log("here");
      await user.save();
      return {
        status: 200,
        username: user.username,
        phoneNumber: user.phoneNumber,
      };
    }
  }
};

exports.submitOTPService = async (username, otp) => {
  let user = await database.getUserByUsername(username);
  if (!user) {
    return { status: 404, message: "user not found" };
  } else {
    if (otp == user.verificationCode) {
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
        role: user.role,
      };
      return { status: 200, user: response };
    } else {
      return { status: 400, message: "Incorrect OTP" };
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
