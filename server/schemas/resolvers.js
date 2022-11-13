const { User, Admin, Master, Note } = require("../models");

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

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

    admins: async (parent, args) => {
      return Admin.find();
    },
    admin: async (parent, { _id }) => {
      return Admin.findOne({ _id });
    },

    master: async (parent, args) => {
      return Master.find();
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

    addMaster: async (parent, { company }) => {
      const master = await Master.create({ company });

      return { master };
    },

    addNote: async (parent, args) => {
      const note = await Note.create({
        text: args.text,
        masterId: args.masterId,
      });

      const updatedMaster = await Master.findOneAndUpdate(
        { _id: args.masterId },
        { $addToSet: { notesArr: note } },
        { new: true }
      ).populate("notesArr");

      return { updatedMaster, note };
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
