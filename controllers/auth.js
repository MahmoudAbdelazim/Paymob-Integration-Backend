const authServices = require("../services/auth");

exports.signup = async (req, res, next) => {
  const username = req.body.username;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  try {
    console.log(username, phoneNumber, password, firstName, lastName);
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
      error = new Error(response.message)
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
  const usernameOrPhoneNumber = req.body?.usernameOrPhoneNumber;
  const password = req.body?.password;

  try {
    const response = await authServices.loginService(
      usernameOrPhoneNumber,
      password
    );
    if (response.status == 200) {
      res
        .status(200)
        .json({ message: "user logged in successfully", user: response.user });
    } else {
      error = new Error(response.message)
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
