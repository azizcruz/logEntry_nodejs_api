// SET the env to test during testing
require("dotenv").config();
process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const EntryLog = require("../models/LogEntry");

// Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

const headerToken = {
  "auth-token": process.env.TEST_TOKEN
};

chai.use(chaiHttp);

// Parent Block
describe("Logs api testing", () => {
  // Before each test empty the collection
  beforeEach(async () => {
    try {
      await EntryLog.deleteMany({});
    } catch (error) {
      console.error(error);
    }
  });

  /**
   * Test /GET route
   */
  describe("GET /api/logs", () => {
    it("should get all entry logs", done => {
      chai
        .request(server)
        .get("/api/logs")
        .set(headerToken)
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });

    it("should return access denied when the token is not included in the header", done => {
      chai
        .request(server)
        .get("/api/logs")
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.status(401);
          res.body.should.have.property("message").eq("Access Denied.");
        });
      done();
    });
  });

  describe("GET /api/logs/:id", () => {
    it("should get one entry logs", done => {
      // Create entry log
      const test = EntryLog({
        title: "Abraj Al Bait",
        comments: "So modern, and the hospitality was great",
        latitude: "21.418794",
        longitude: "39.823553",
        rating: 9,
        image:
          "https://cdn1.manager-magazin.de/images/image-1028390-galleryV9-uvun-1028390.jpg",
        visitDate: "2020-01-13T19:10:58.522Z"
      });
      test.save(() => {
        chai
          .request(server)
          .get("/api/logs/" + test._id)
          .set(headerToken)
          .end((err, res) => {
            if (err) console.log(err);
            res.should.have.status(200);
            res.body.should.have.property("title").eq("Abraj Al Bait");
            done();
          });
      });
    });

    it("should return access denied when no token is included in the header", done => {
      // Create entry log
      const test = EntryLog({
        title: "Abraj Al Bait",
        comments: "So modern, and the hospitality was great",
        latitude: "21.418794",
        longitude: "39.823553",
        rating: 9,
        image:
          "https://cdn1.manager-magazin.de/images/image-1028390-galleryV9-uvun-1028390.jpg",
        visitDate: "2020-01-13T19:10:58.522Z"
      });
      test.save(() => {
        chai
          .request(server)
          .get("/api/logs/" + test._id)
          .end((err, res) => {
            if (err) console.log(err);
            res.should.have.status(401);
            res.body.should.have.property("message").eq("Access Denied.");
            done();
          });
      });
    });
  });

  /**
   * Test /POST route
   */
  describe("POST /api/logs", () => {
    it("should create a log", done => {
      const testData = {
        title: "Abraj Al Bait",
        comments: "So modern, and the hospitality was great",
        latitude: "21.418794",
        longitude: "39.823553",
        rating: 9,
        image:
          "https://cdn1.manager-magazin.de/images/image-1028390-galleryV9-uvun-1028390.jpg",
        visitDate: "2020-01-13T19:10:58.522Z"
      };
      chai
        .request(server)
        .post("/api/logs")
        .send(testData)
        .set(headerToken)
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.status(200);
          res.body.should.have.property("title").eq("Abraj Al Bait");
          done();
        });
    });

    it("should return field is required when one of the required field is not passed", done => {
      const testData = {
        comments: "So modern, and the hospitality was great",
        latitude: "21.418794",
        longitude: "39.823553",
        rating: 9,
        image:
          "https://cdn1.manager-magazin.de/images/image-1028390-galleryV9-uvun-1028390.jpg",
        visitDate: "2020-01-13T19:10:58.522Z"
      };
      chai
        .request(server)
        .post("/api/logs")
        .send(testData)
        .set(headerToken)
        .end((err, res) => {
          if (err) console.log(err);
          debugger;
          res.should.have.status(200);
          res.body.details[0].should.have
            .property("message")
            .eq('"title" is required');
          done();
        });
    });

    it("should return field is not allowed when a not allowed field is passed", done => {
      const testData = {
        title: "Abraj Al Bait",
        comments: "So modern, and the hospitality was great",
        latitude: "21.418794",
        longitude: "39.823553",
        rating: 9,
        image:
          "https://cdn1.manager-magazin.de/images/image-1028390-galleryV9-uvun-1028390.jpg",
        visitDate: "2020-01-13T19:10:58.522Z",
        sss: "jbb"
      };
      chai
        .request(server)
        .post("/api/logs")
        .send(testData)
        .set(headerToken)
        .end((err, res) => {
          if (err) console.log(err);
          debugger;
          res.should.have.status(200);
          res.body.details[0].should.have
            .property("message")
            .eq('"sss" is not allowed');
          done();
        });
    });

    it("should return access denied when token is not passed in the header", done => {
      const testData = {
        title: "Abraj Al Bait",
        comments: "So modern, and the hospitality was great",
        latitude: "21.418794",
        longitude: "39.823553",
        rating: 9,
        image:
          "https://cdn1.manager-magazin.de/images/image-1028390-galleryV9-uvun-1028390.jpg",
        visitDate: "2020-01-13T19:10:58.522Z"
      };
      chai
        .request(server)
        .post("/api/logs")
        .send(testData)
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.status(401);
          res.body.should.have.property("message").eq("Access Denied.");
          done();
        });
    });
  });
});
