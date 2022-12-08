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

    liked: [String],
    replies: [
      {
        updateAt: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now },
        commentId: { type: String },
        userId: { type: String },
        username: { type: String },
        text: { type: String },
        replyToReply: [{ type: String, default: [] }],
        replyLikes: [{ type: String, default: [] }],
      },
    ],
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
