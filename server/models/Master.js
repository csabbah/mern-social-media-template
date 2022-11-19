const { Schema, model } = require("mongoose");

const masterSchema = new Schema(
  {
    notesArr: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
        default: [],
      },
    ],
    labelArr: [
      {
        type: String,
        default: [],
      },
    ],
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Master = model("Master", masterSchema);

module.exports = Master;
