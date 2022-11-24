const { Schema, model } = require("mongoose");

const vocabSchema = new Schema(
  {
    text: {
      type: String,
    },
    typeOfSpeech: {
      type: String,
    },
    definition: {
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

const Vocab = model("Vocab", vocabSchema);

module.exports = Vocab;
