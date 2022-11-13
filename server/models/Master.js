const { Schema, model } = require("mongoose");

const masterSchema = new Schema(
  {
    company: {
      type: String,
    },
    notesArr: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    labelArr: [
      {
        type: String,
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
