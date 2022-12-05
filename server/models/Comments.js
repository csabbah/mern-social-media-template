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
    createdAt: {
      type: String,
    },
    updatedAt: {
      type: String,
    },
    updated: {
      type: Boolean,
      default: false,
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

const Comments = model("Comments", commentSchema);

module.exports = Comments;
