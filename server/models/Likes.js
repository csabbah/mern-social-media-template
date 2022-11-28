const { Schema, model } = require("mongoose");

const likedSchema = new Schema(
  {
    postId: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Likes = model("Likes", likedSchema);

module.exports = Likes;
