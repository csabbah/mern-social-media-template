const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    postId: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
    username: {
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

const Comments = model("Comments", commentSchema);

module.exports = Comments;
