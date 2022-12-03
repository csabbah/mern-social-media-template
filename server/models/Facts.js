const { Schema, model } = require("mongoose");

const factSchema = new Schema(
  {
    text: {
      type: String,
    },
    genre: {
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

const Facts = model("Facts", factSchema);

module.exports = Facts;
