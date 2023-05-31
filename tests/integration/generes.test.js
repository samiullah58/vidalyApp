const request = require("supertest");
const { Genre } = require("../../model/genres");
const { Customer } = require("../../model/customers");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(() => {
    server.close();
  });

  describe("GET /", () => {
    it("should return all the genres", async () => {
      await Genre.collection.insertMany([{ name: "sami1" }, { name: "sami2" }]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(res.body.length);
    });
  });
  describe("GET /", () => {
    it("should return all the customers", async () => {
      await Customer.collection.insertMany([
        { name: "Sami Ullah", isGold: false, phone: "0348 9031734" },
        { name: "Aqib Ali", isGold: true, phone: "0340-1191413" },
      ]);

      const res = await request(server).get("/api/customers");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(res.body.length);
    });
  });
});
