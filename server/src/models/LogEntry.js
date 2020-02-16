const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requiredNumber = {
  type: Number,
  required: true
};

const logEntryShema = Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: null
    },
    comments: String,
    image: String,
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    latitude: { ...requiredNumber, min: -90, max: 90 },
    longitude: { ...requiredNumber, min: -180, max: 180 },
    visitDate: {
      required: true,
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const LogEntry = mongoose.model("LogEntry", logEntryShema);

module.exports = LogEntry;
