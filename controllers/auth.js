const authServices = require("../services/auth");

exports.signup = async (req, res, next) => {
  try {
    const username = req.body.username;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const response = await authServices.signupService(
      username,
      password,
      phoneNumber,
      firstName,
      lastName
    );
    if (response.status == 200) {
      res.status(200).json({ message: "user signed up successfully" });
    } else {
      error = new Error(response.message);
      error.statusCode = response.status;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const usernameOrPhoneNumber = req.body?.usernameOrPhoneNumber;
    const password = req.body?.password;

    console.log("heerereeee");
    console.log(req.body);
    const response = await authServices.loginService(
      usernameOrPhoneNumber,
      password
    );
    if (response.status == 200) {
      res
        .status(200)
        .json({
          message: "sent OTP SMS message",
          username: response.username,
          phoneNumber: response.phoneNumber,
        });
    } else {
      error = new Error(response.message);
      error.statusCode = response.status;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.submitOTP = async (req, res, next) => {
  try {
    const username = req.body?.username;
    const otp = req.body?.otp;

    const response = await authServices.submitOTPService(username, otp);
    if (response.status == 200) {
      res
        .status(200)
        .json({ message: "User logged in successfully", user: response.user });
    } else {
      error = new Error(response.message);
      error.statusCode = response.status;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserBasicInfo = async (req, res, next) => {
  try {
    console.log("HEEEREEEEEE");
    const user = await authServices.getUserBasicInfoService(req.user);
    res.status(200).json({ ...user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
