const { Schema, model } = require("mongoose");

const quotesSchema = new Schema(
  {
    text: {
      type: String,
    },
    author: {
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

const Quotes = model("Quotes", quotesSchema);

module.exports = Quotes;
