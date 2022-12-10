const {
  User,
  Admin,
  Master,
  Quotes,
  Vocab,
  Facts,
  Geography,
  Likes,
  Comments,
} = require("../models");

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { find, findById } = require("../models/User");
const { default: mongoose } = require("mongoose");

const resolvers = {
  Query: {
    get_me: async (parent, { _id }) => {
      return await User.findOne({ _id: _id })
        .select("-__v -password")
        .populate("likedArr")
        .populate("favouritedArr")
        .populate("commentsArr");
    },

    user: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("likedArr")
          .populate("favouritedArr")
          .populate("commentsArr");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },

    users: async (parent, args) => {
      // Example of setting up an auth for viewing data
      // let auth = "test";
      // if (auth == process.env.auth) {
      //   return User.find();
      // }
      // throw new AuthenticationError("Not authorized to view");

      return User.find();
    },

    likes: async () => {
      return Likes.find();
    },
    comments: async () => {
      return Comments.find();
    },
    admins: async (parent, args) => {
      return Admin.find();
    },
    admin: async (parent, { _id }) => {
      return Admin.findOne({ _id });
    },

    quotes: async (parent, args) => {
      return Quotes.find();
    },

    facts: async (parent, args) => {
      return Facts.find();
    },

    vocabs: async (parent, args) => {
      return Vocab.find();
    },

    geo: async (parent, args) => {
      return Geography.find();
    },

    // IMPORTANT NOTE, when we create a Master model, it gets added to an Array considering more of them can be created
    // Thus in typeDefs, we treat the query as an array and we do this in type Query: 'master: [Master]'
    masters: async () => {
      return Master.find()
        .populate("quotesArr")
        .populate("factsArr")
        .populate("vocabArr")
        .populate("geoArr");
    },

    master: async (parent, { _id }) => {
      return Master.findOne({ _id })
        .populate("quotesArr")
        .populate("factsArr")
        .populate("vocabArr")
        .populate("geoArr");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    loginAdmin: async (parent, { email, password }) => {
      const admin = await Admin.findOne({ email });

      if (!admin) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await admin.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(admin);
      return { token, admin };
    },

    removeAdmin: async (parent, { id }) => {
      await Admin.findByIdAndDelete(id);
    },

    addMaster: async () => {
      const master = await Master.create({});

      return master;
    },
    removeLike: async (parent, { likeId, userId }) => {
      // Delete the like
      const like = await Likes.findByIdAndDelete(likeId);

      // Then remove it from the users array
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { likedArr: likeId },
        },
        { new: true }
      ).populate("likedArr");

      return like;
    },

    addLike: async (parent, args) => {
      // Since unique: true doesn't seem to work, we...
      // manually add the function to check if the like exist in the database
      // let likeExists = await Likes.findOne({ conjointId: args.conjointId });
      // if (likeExists) {
      //   return "";
      // }

      const like = await Likes.create({
        conjointId: args.conjointId,
        postId: args.postId,
        userId: args.userId,
      });

      await User.findOneAndUpdate(
        { _id: args.userId },
        { $addToSet: { likedArr: like } },
        { new: true }
      ).populate("likedArr");

      return like;
    },

    removeFavourite: async (parent, { favouriteId, userId }) => {
      // Then remove it from the users array
      const user = await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { favouritedArr: favouriteId },
        },
        { new: true }
      ).populate("favouritedArr");

      return user;
    },

    addFavourite: async (parent, args) => {
      const user = await User.findOneAndUpdate(
        { _id: args.userId },
        { $addToSet: { favouritedArr: args.postId } },
        { new: true }
      ).populate("favouritedArr");

      return user;
    },

    addComment: async (parent, args) => {
      const comment = await Comments.create({
        text: args.text,
        postId: args.postId,
        userId: args.userId,
        username: args.username,
      });

      await User.findOneAndUpdate(
        { _id: args.userId },
        { $addToSet: { commentsArr: comment } },
        { new: true }
      ).populate("commentsArr");

      return await comment;
    },

    updateComment: async (parent, { commentId, text }) => {
      const comment = await Comments.findOneAndUpdate(
        { _id: commentId },
        { $set: { text, updated: true } },
        { new: true }
      );

      return comment;
    },

    removeComment: async (parent, { commentId, userId }) => {
      // Delete the comment
      const comment = await Comments.findByIdAndDelete(commentId);

      // Then remove it from the users array
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { commentsArr: commentId },
        },
        { new: true }
      ).populate("commentsArr");

      return comment;
    },

    addReply: async (parent, { replyToSave }) => {
      const comment = await Comments.findOneAndUpdate(
        { _id: replyToSave.commentId },
        { $push: { replies: replyToSave } },
        { new: true }
      );

      return comment;
    },

    addReplyToReply: async (parent, { replyToReplySave }) => {
      const comment = await Comments.findById({
        _id: replyToReplySave.commentId,
      });

      // Go through the replies array using regular JS expression
      comment.replies.forEach((reply) => {
        if (reply._id == replyToReplySave.replyId) {
          // Update model from JS side
          reply.replyToReply.push(replyToReplySave);
          // Then save the data to the model
          comment.save(reply);
        }
      });

      return comment;
    },

    addLikeToReply: async (parent, { userId, commentId, replyId }) => {
      const comment = await Comments.findById({
        _id: commentId,
      });

      // Go through the replies array using regular JS expression
      comment.replies.forEach((reply) => {
        if (reply._id == replyId) {
          // Update model from JS side
          reply.replyLikes.push(userId);
          // Then save the data to the model
          comment.save(reply);
        }
      });

      return comment;
    },

    removeLikeFromReply: async (parent, { userId, commentId, replyId }) => {
      const comment = await Comments.findById({
        _id: commentId,
      });

      // Go through the replies array using regular JS expression
      comment.replies.forEach((reply, i) => {
        if (reply._id == replyId) {
          // Update model from JS side
          reply.replyLikes.forEach((like, index) => {
            if (like == userId) {
              reply.replyLikes.splice(index, 1);
            }
          });
          // Then save the data to the model
          comment.save(reply);
        }
      });

      return comment;
    },

    removeReply: async (parent, { commentId, replyId }) => {
      const comment = await Comments.findOneAndUpdate(
        { _id: commentId },
        { $pull: { replies: { _id: replyId } } },
        { new: true }
      );

      // If you use below method, change to > Comments.findById
      // comment.replies.forEach((reply, index) => {
      //   if (reply._id == replyId) {
      //     comment.replies.splice(index, 1)
      //     comment.save(reply);
      //   }
      // })

      return comment;
    },

    addCommentLike: async (parent, { commentId, userId }) => {
      const comment = await Comments.findOneAndUpdate(
        { _id: commentId },
        { $push: { liked: userId } },
        { new: true }
      );

      return comment;
    },

    removeCommentLike: async (parent, { userId, commentId }) => {
      const comment = await Comments.findOneAndUpdate(
        { _id: commentId },
        { $pull: { liked: userId } },
        { new: true }
      );

      return comment;
    },

    addQuote: async (parent, args) => {
      // Create the quote which adds it to the DB in general
      const quote = await Quotes.create({
        text: args.text,
        author: args.author,
        masterId: args.masterId,
      });

      // Then add the newly created quote into the Master model sub-array
      const updatedMaster = await Master.findOneAndUpdate(
        { _id: args.masterId },
        { $addToSet: { quotesArr: quote } },
        { new: true }
      )
        .populate("quotesArr")
        .populate("factsArr")
        .populate("vocabArr")
        .populate("geoArr");

      return { updatedMaster, quote };
    },

    addFact: async (parent, args) => {
      // Create the quote which adds it to the DB in general
      const fact = await Facts.create({
        text: args.text,
        genre: args.genre,
        masterId: args.masterId,
      });

      // Then add the newly created quote into the Master model sub-array
      const updatedMaster = await Master.findOneAndUpdate(
        { _id: args.masterId },
        { $addToSet: { factsArr: fact } },
        { new: true }
      )
        .populate("quotesArr")
        .populate("factsArr")
        .populate("vocabArr")
        .populate("geoArr");

      return { updatedMaster, fact };
    },

    addVocab: async (parent, args) => {
      // Create the quote which adds it to the DB in general
      const vocab = await Vocab.create({
        text: args.text,
        definition: args.definition,
        masterId: args.masterId,
        typeOfSpeech: args.typeOfSpeech,
      });

      // Then add the newly created quote into the Master model sub-array
      const updatedMaster = await Master.findOneAndUpdate(
        { _id: args.masterId },
        { $addToSet: { vocabArr: vocab } },
        { new: true }
      )
        .populate("quotesArr")
        .populate("factsArr")
        .populate("vocabArr")
        .populate("geoArr");

      return { updatedMaster, vocab };
    },

    addGeo: async (parent, args) => {
      // Create the quote which adds it to the DB in general
      const geo = await Geography.create({
        flag: args.flag,
        country: args.country,
        masterId: args.masterId,
        capital: args.capital,
        phoneCode: args.phoneCode,
        continent: args.continent,
      });

      // Then add the newly created quote into the Master model sub-array
      const updatedMaster = await Master.findOneAndUpdate(
        { _id: args.masterId },
        { $addToSet: { geoArr: geo } },
        { new: true }
      )
        .populate("quotesArr")
        .populate("factsArr")
        .populate("vocabArr")
        .populate("geoArr");

      return { updatedMaster, geo };
    },

    removeItem: async (parent, args) => {
      const updateArr = await Master.findOneAndUpdate(
        { _id: args.masterId },
        {
          // Args.arr returns the (array) paramater we are pushing into
          $pull: { [args.arr]: args.itemId },
        },
        { new: true }
      );
      return updateArr;
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    addAdmin: async (parent, args) => {
      const admin = await Admin.create(args);
      const token = signToken(admin);

      return { token, admin };
    },
  },
};

module.exports = resolvers;
