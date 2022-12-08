const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Admin {
    _id: ID
    username: String
    email: String
    likedArr: [Likes]
    favouritedArr: [String]
    commentsArr: [Comments]
    createdAt: String
    updatedAt: String
  }

  type Master {
    _id: ID
    quotesArr: [Quotes]
    geoArr: [Geography]
    vocabArr: [Vocab]
    factsArr: [Facts]
    createdAt: String
    updatedAt: String
  }

  type User {
    _id: ID
    username: String
    email: String
    likedArr: [Likes]
    favouritedArr: [String]
    commentsArr: [Comments]
    createdAt: String
    updatedAt: String
  }

  type Likes {
    _id: ID
    conjointId: String
    postId: String
    createdAt: String
    updatedAt: String
    userId: User
  }

  input repliesInput {
    _id: ID
    commentId: String
    userId: String
    text: String
    username: String
    replyToReply: [String]
    replyLikes: [String]
    createdAt: String
    updatedAt: String
  }

  type replies {
    _id: ID
    commentId: String
    userId: String
    text: String
    username: String
    replyToReply: [String]
    replyLikes: [String]
    createdAt: String
    updatedAt: String
  }

  type Comments {
    _id: ID
    postId: String
    userId: String
    username: String
    createdAt: String
    updatedAt: String
    text: String
    updated: Boolean
    liked: [String]
    replies: [replies]
  }

  type Vocab {
    _id: ID
    text: String
    typeOfSpeech: String
    definition: String
    masterId: String
    createdAt: String
    updatedAt: String
  }

  type Geography {
    _id: ID
    flag: String
    country: String
    capital: String
    continent: String
    phoneCode: String
    masterId: String
    createdAt: String
    updatedAt: String
  }

  type Quotes {
    _id: ID
    text: String
    author: String
    masterId: String
    createdAt: String
    updatedAt: String
  }

  type Facts {
    _id: ID
    text: String
    genre: String
    masterId: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    get_me(_id: ID!): User
    user: User
    users: [User]
    likes: [Likes]
    comments: [Comments]
    admin(_id: ID!): Admin
    admins: [Admin]
    quotes: [Quotes]
    facts: [Facts]
    vocabs: [Vocab]
    geo: [Geography]
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
    addVocab(
      typeOfSpeech: String!
      definition: String!
      text: String!
      masterId: String!
    ): Vocab
    addGeo(
      flag: String!
      country: String!
      capital: String!
      continent: String!
      phoneCode: String!
      masterId: String!
    ): Geography
    removeItem(masterId: String!, itemId: String!, arr: String!): Master
    removeFavourite(favouriteId: String!, userId: String!): User
    addFavourite(postId: String!, userId: String!): User
    addLike(postId: String!, userId: String!, conjointId: String!): Likes
    removeLike(likeId: String!, userId: String!): Likes
    addComment(
      postId: String!
      userId: String!
      text: String!
      username: String!
    ): Comments
    updateComment(commentId: String!, text: String!): Comments
    addReply(replyToSave: repliesInput): Comments
    removeReply(replyId: String!, commentId: String!): Comments
    addReplyToReply(
      replyId: String!
      commentId: String!
      replyText: String!
      userId: String!
      username: String!
      replyToReplyId: String
    ): Comments

    addCommentLike(commentId: String!, userId: String!): Comments
    removeCommentLike(commentId: String!, userId: String!): Comments
    removeComment(commentId: String!, userId: String!): Comments
  }

  type Auth {
    token: ID!
    user: User
    admin: Admin
  }
`;

module.exports = typeDefs;
