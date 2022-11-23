const { Schema, model } = require("mongoose");

const geoSchema = new Schema(
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

const Geography = model("Geography", geoSchema);

module.exports = Geography;
