const express = require("express");
const genres = require("./routes/genres");
const app = express();

app.use(express.json());
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`App is running on port no: ${port}...`);
});
