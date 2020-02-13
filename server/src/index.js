const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const middlewares = require("./middlewares");
const logs = require("./api/logs");
const mongoose = require("mongoose");

const mongoooseConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
require("dotenv").config();

mongoose
  .connect(process.env.DB_URL, mongoooseConnectionOptions, () => {})
  .then(() => {
    console.log("Conncted to DB");
  })
  .catch(err => {
    console.log(error);
  });

// Middlewares
app.use(morgan("common"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/logs", logs);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));
