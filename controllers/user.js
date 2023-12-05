const userServices = require("../services/user");

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = req.user;
    console.log("HEEEEERREEEEEE");
    console.log(user);
    if (user.role != "ADMIN") {
      res.status(301).json({ message: "Unauthorizedd" });
      return;
    }
    const response = await userServices.getAllUsers();
    if (response.status == 200) {
      res.status(200).json({
        users: response.users,
      });
    } else {
      const error = new Error(response?.message);
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
