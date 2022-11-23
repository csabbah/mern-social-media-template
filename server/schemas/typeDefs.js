const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Admin {
    _id: ID
    username: String
    email: String
  }

  type Master {
    _id: ID
    quotesArr: [Quotes]
    geoArr: [String]
    vocabArr: [String]
    factsArr: [Facts]
  }

  type User {
    _id: ID
    username: String
    email: String
  }

  type Quotes {
    _id: ID
    text: String
    author: String
    masterId: String
  }

  type Facts {
    _id: ID
    text: String
    genre: String
    masterId: String
  }

  type Query {
    user: User
    users: [User]
    admin(_id: ID!): Admin
    admins: [Admin]
    quotes: [Quotes]
    facts: [Facts]
    masters: [Master]
    master(_id: ID!): Master
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    loginAdmin(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addAdmin(username: String!, email: String!, password: String!): Auth
    removeAdmin(id: String!): Auth
    addMaster: Master
    addQuote(text: String!, author: String!, masterId: String!): Quotes
    addFact(text: String!, genre: String!, masterId: String!): Facts
  }

  type Auth {
    token: ID!
    user: User
    admin: Admin
  }
`;

module.exports = typeDefs;
