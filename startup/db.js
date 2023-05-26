const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://0.0.0.0/vidaly")
    .then(() => winston.info("Connected to mongodb"));
};
