const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Admin {
    _id: ID
    username: String
    email: String
  }

  type Master {
    _id: ID
    notesArr: [Note]
    labelArr: [String]
  }

  type User {
    _id: ID
    username: String
    email: String
  }

  type Note {
    _id: ID
    masterId: String
    text: String
  }

  type Query {
    user: User
    users: [User]
    admin(_id: ID!): Admin
    admins: [Admin]
    notes: [Note]
    masters: [Master]
    master(_id: ID!): Master
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    loginAdmin(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addAdmin(username: String!, email: String!, password: String!): Auth
    removeAdmin(id: String!): Auth
    addMaster(company: String): Master
    addNote(text: String!, masterId: String!): Note
  }

  type Auth {
    token: ID!
    user: User
    admin: Admin
  }
`;

module.exports = typeDefs;
