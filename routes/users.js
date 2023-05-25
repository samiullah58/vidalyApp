const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../model/users");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
// Adding new Movies
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already Registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

// // Updating existing Movies
// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     { name: req.body.name, email: req.body.email, password: req.body.password },
//     { new: true }
//   );
//   if (!user) return res.status(404).send("customer Not Found");
//   res.send(user);
// });

// // // Deleting existing Movies
// router.delete("/:id", async (req, res) => {
//   const user = await User.findByIdAndDelete(req.params.id);
//   if (!user) res.status(404).send("customer Not Found");
//   res.send(user);
// });

// // // Get movie by ID
// router.get("/:id", async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if (!user) res.status(404).send("customer Not Found");
//   res.send(user);
// });

module.exports = router;
