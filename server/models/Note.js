const { Schema, model } = require("mongoose");

const noteSchema = new Schema(
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

const Note = model("Note", noteSchema);

module.exports = Note;
