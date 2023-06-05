const express = require("express");
const moment = require("moment");
const router = express.Router();
const auth = require("../middleware/auth");
const { Rental } = require("../model/rentals");
const { Movie } = require("../model/movies");

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("customerId not provided.");
  if (!req.body.movieId) return res.status(400).send("movieId not provided.");
  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) return res.status(404).send("Rental not found.");
  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.dateReturned = new Date();

  const rentalDays = moment().diff(rental.dateOut, "days");

  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  await Movie.updateMany(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );
  res.status(200).send();
});

module.exports = router;
