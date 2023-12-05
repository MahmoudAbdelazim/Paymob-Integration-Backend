exports.validateTransaction = (amount) => {
  if (amount < 10) {
    return {valid: false, message: "you can't make a payment transaction of less than 10 EGP"}
  }
  return {valid: true}
}