const request = require("supertest");
const moment = require("moment");
const mongoose = require("mongoose");
const { User } = require("../../model/users");
const { Rental } = require("../../model//rentals");
const { Movie } = require("../../model//movies");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({
        movieId,
        customerId,
      });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "Sami kan 5",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "Movie Title",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if customerId is not provided", async () => {
      customerId = null;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if movieId is not provided", async () => {
      movieId = null;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if no rental found for this customer/movie", async () => {
      await Rental.deleteMany({});

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if rental already processed", async () => {
      rental.dateReturned = new Date();
      await rental.save();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 200 if valid request", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it("should return set the return date", async () => {
      const res = await exec();

      const rentalInDb = await Rental.findById(rental._id);

      const diff = new Date() - rentalInDb.dateReturned;
      expect(diff).toBeLessThan(10 * 1000);
    });

    it("should return calculate the rental fee if the input is valid", async () => {
      rental.dateOut = moment().add(-7, "days").toDate();
      await rental.save();

      const res = await exec();

      const rentalInDb = await Rental.findById(rental._id);

      expect(rentalInDb.rentalFee).toBe(14);
    });

    it("should increase the stock if input is valid", async () => {
      const res = await exec();

      const movieInDb = await Movie.findById(movieId);

      expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
  });
});
