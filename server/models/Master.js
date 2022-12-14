const { Schema, model } = require("mongoose");

const masterSchema = new Schema(
  {
    quotesArr: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quotes",
        default: [],
      },
    ],
    geoArr: [
      {
        type: Schema.Types.ObjectId,
        ref: "Geography",
        default: [],
      },
    ],
    vocabArr: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vocab",
        default: [],
      },
    ],
    factsArr: [
      {
        type: Schema.Types.ObjectId,
        ref: "Facts",
        default: [],
      },
    ],
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

const Master = model("Master", masterSchema);

module.exports = Master;
