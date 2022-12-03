const { Schema, model } = require("mongoose");

const geoSchema = new Schema(
  {
    flag: {
      type: String,
    },
    country: {
      type: String,
    },
    capital: {
      type: String,
    },
    continent: {
      type: String,
    },
    phoneCode: {
      type: String,
    },
    masterId: {
      type: String,
    },
    createdAt: {
      type: String,
    },
    updatedAt: {
      type: String,
    },
  },
  // set this to use virtual below
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Geography = model("Geography", geoSchema);

module.exports = Geography;
