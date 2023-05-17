const Joi = require("joi");
const express = require("express");
const router = express.Router();
router.use(express.json());

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Horror" },
  { id: 3, name: "Romance" },
];

router.get("/", (req, res) => {
  res.send(genres);
});

// Adding new Movies
router.post("/", (req, res) => {
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
});
// Updating existing Movies
router.put("/:id", (req, res) => {
  // define movies
  const movie = genres.find((c) => c.id === parseInt(req.params.id));
  if (!movie) res.status(404).send("Movie Not Found");
  // if not exist
  const { error } = validateGenres(req.body);
  if (error) res.status(400).send(error.details[0].message);
  // get by id
  movie.name = req.body.name;
  res.send(movie);
});
// Deleting existing Movies
router.delete("/:id", (req, res) => {
  // define movies
  const movie = genres.find((c) => c.id === parseInt(req.params.id));
  // if not exist
  if (!movie) res.status(404).send("Movie Not Found");
  // get by id
  const index = genres.indexOf(movie);
  genres.splice(index, 1);
  res.send(movie);
});
// the actual validation for user input
function validateGenres(movie) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(16).required(),
  });
  return schema.validate(movie);
}
// Get movie by ID
router.get("/:id", (req, res) => {
  // define movies
  const movie = genres.find((c) => c.id === parseInt(req.params.id));
  // if not exist
  if (!movie) res.status(404).send("Movie Not Found");
  res.send(movie);
  // get by id
});

module.exports = router;
