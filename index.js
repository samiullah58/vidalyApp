const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/route")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

app.get("/", (req, res) => {
  res.send("Vidaly Web Application");
  res.setHeader("X-Foo", "bar");
});

winston.info(process.env.NODE_ENV);
const port = process.env.PORT || 3000;
const server = app.listen(port, (req, res) => {
  winston.info(`App is running on port no: ${port}...`);
});

module.exports = server;
