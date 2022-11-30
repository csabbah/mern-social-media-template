const {
  User,
  Admin,
  Master,
  Quotes,
  Vocab,
  Facts,
  Geography,
  Likes,
} = require("../models");

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("likedArr")
          .populate("favouritedArr");

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

    addLike: async (parent, args) => {
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

    removeLike: async (parent, { likeId, userId }) => {
      // Delete the like
      await Likes.findByIdAndDelete(likeId);

      // Then remove it from the users array
      const updateUserArr = await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { likedArr: likeId },
        },
        { new: true }
      ).populate("likedArr");

      return { updateUserArr };
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
      const updatedGeoArr = await Master.findOneAndUpdate(
        { _id: args.masterId },
        {
          // Args.arr returns the (array) paramater we are pushing into
          $pull: { [args.arr]: args.itemId },
        },
        { new: true }
      );
      return updatedGeoArr;
    },

    // updateNote: async (parent, { _id, text }) => {
    //   return await Note.updateOne(
    //     { _id: _id },
    //     { $set: { text } },
    //     { new: true }
    //   );
    // },

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
