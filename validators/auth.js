exports.validateLogin = (username, password, phoneNumber, firstName, lastName) => {
  if (!username || !phoneNumber || !password || !firstName || !lastName) {
    return {valid: false, message: "signup data missing"};
  }
  if (password.length < 8) {
    return {valid: false, message: "password is too short"};
  }
  return {valid: true};
}