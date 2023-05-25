const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const category = require("./routes/category");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://0.0.0.0/vidaly")
  .then(console.log("Connected to mongodb"))
  .catch((err) => console.error("Error", err));

app.get("/", (req, res) => {
  res.send("Vidaly Web Application");
  res.setHeader("X-Foo", "bar");
});

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/category", category);

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`App is running on port no: ${port}...`);
});
