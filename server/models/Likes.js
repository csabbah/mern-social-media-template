const { Schema, model } = require("mongoose");

// const uniqueValidator = require("mongoose-unique-validator");

const likedSchema = new Schema(
  {
    conjointId: {
      type: String,
      unique: true,
    },
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

// likedSchema.plugin(uniqueValidator);

const Likes = model("Likes", likedSchema);

module.exports = Likes;
