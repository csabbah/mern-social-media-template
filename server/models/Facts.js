const { Schema, model } = require("mongoose");

const factSchema = new Schema(
  {
    text: {
      type: String,
    },
    masterId: {
      type: String,
    },
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Facts = model("Facts", factSchema);

module.exports = Facts;
