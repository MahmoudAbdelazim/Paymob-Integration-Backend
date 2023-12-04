exports.getAuthenticatedUser = async (req, res, next) => {
  try {
    console.log(res.locals.user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};