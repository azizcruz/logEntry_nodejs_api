const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitorSchema = Schema(
  {
    email: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Visitor", visitorSchema);
