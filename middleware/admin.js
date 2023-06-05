// const user = require("../model/users");
module.exports = function (req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).send("Access Denied not admin.");
  next();
};
