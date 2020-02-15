const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const middlewares = require("./middlewares");

const logs = require("./api/logs");
const visitors = require("./api/visitors");

const mongoose = require("mongoose");

const mongoooseConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  keepAlive: 1,
  connectTimeoutMS: 30000
};

// Load .env file data
require("dotenv").config();

mongoose
  .connect(
    process.env.NODE_ENV === "dev"
      ? process.env.DB_URL
      : process.env.DB_TEST_URL,
    mongoooseConnectionOptions,
    () => {}
  )
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`Listening on port ${port}`);
    }
  })
  .catch(err => {
    console.log(error);
  });

// Middlewares
//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
  //use morgan to log at command line
  app.use(morgan("common")); //'combined' outputs the Apache style LOGs
}
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/logs", logs);
app.use("/api/visitors", visitors);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Listening on port ${port}`);
  }
});

module.exports = app; // for testing
