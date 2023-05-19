const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const app = express();

mongoose
  .connect("mongodb://0.0.0.0/vidaly")
  .then(console.log("Connected to mongodb"))
  .catch((err) => console.error("Error", err));

app.get("/", (req, res) => {
  res.send("Vidaly Web Application");
});

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`App is running on port no: ${port}...`);
});
