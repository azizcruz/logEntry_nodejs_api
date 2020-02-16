require("dotenv").config();
process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const Visitor = require("../models/Visitor");

// Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

const headerToken = {
  "auth-token": process.env.TEST_TOKEN
};

const dummyData = {
  email: "test@test.com"
};

chai.use(chaiHttp);

// Parent Block
describe("Visitors api testing", () => {
  // Before each test, empty collection
  beforeEach(async () => {
    try {
      await Visitor.deleteMany({});
    } catch (error) {
      console.log(error);
    }
  });

  /**
   * GET routes
   */

  it("GET", async () => {
    try {
      const res = await chai.request(server).get("/api/visitors");
      res.should.have.status(200);
      res.body.should.be.a("array");
    } catch (error) {
      console.log(error);
    }
  });

  /**
   * POST routes
   */
  describe("POST /api/visitors/", () => {
    it("should add new visitor", async () => {
      const data = dummyData;
      const res = await chai
        .request(server)
        .post("/api/visitors/")
        .send(data);

      res.should.have.status(200);
      res.body.should.have.property("id");
    });

    // ================================================================

    it("should get a visitor token if user exists", async () => {
      let visitor = new Visitor(dummyData);
      visitor = await visitor.save();
      data = dummyData;
      const res = await chai
        .request(server)
        .post("/api/visitors/get-token/")
        .send(data);
      res.should.have.status(200);
      res.body.should.have.property("token");
    });
  });

  // ================================================================

  describe("POST /api/visitors/get-token", () => {
    it("should return visitor does not exist when he is not in database", async () => {
      const res = await chai
        .request(server)
        .post("/api/visitors/get-token/")
        .send(data);

      res.should.have.status(404);
      res.body.should.have.property("message").eq("Visitor does not exist");
    });
  });
});
