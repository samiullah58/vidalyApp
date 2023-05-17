function logger(req, res, next) {
  console.log("Logs data");
  next();
}
module.exports = logger;
