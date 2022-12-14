import { gql } from "@apollo/client";

export const GET_ME = gql`
  query get_me($id: ID!) {
    get_me(_id: $id) {
      _id
      username
      email
      favouritedArr
      likedArr {
        _id
        postId
        createdAt
        updatedAt
      }
      commentsArr {
        _id
        username
        userId
        postId
        text
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER = gql`
  {
    user {
      _id
      username
      email
      likedArr {
        _id
        postId
        createdAt
        updatedAt
      }
      commentsArr {
        _id
        username
        userId
        postId
        text
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_LIKES = gql`
  {
    likes {
      _id
      conjointId
      postId
      createdAt
      updatedAt
      userId {
        _id
      }
    }
  }
`;

export const GET_COMMENTS = gql`
  {
    comments {
      _id
      text
      postId
      userId
      username
      liked
      replies {
        _id
        updatedAt
        createdAt
        text
        username
        userId
        commentId
        replyToReply {
          replyText
          replyLikes
          commentId
          userId
          username
          _id
          createdAt
          updatedAt
          replyId
        }
        replyLikes
      }
      createdAt
      updatedAt
      updated
    }
  }
`;

export const GET_ADMIN = gql`
  query admin($id: ID!) {
    admin(_id: $id) {
      _id
      username
      email
      likedArr {
        _id
        postId
        createdAt
        updatedAt
      }
      commentsArr {
        _id
        username
        userId
        postId
        text
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ADMINS = gql`
  {
    admins {
      _id
      email
      username
    }
  }
`;

export const GET_MASTER = gql`
  query master($id: ID!) {
    master(_id: $id) {
      quotesArr {
        _id
        author
        text
      }
      factsArr {
        _id
        genre
        text
      }
      vocabArr {
        _id
        text
        definition
        typeOfSpeech
      }
      geoArr {
        _id
        country
        flag
        continent
        capital
        phoneCode
      }
    }
  }
`;

export const GET_MASTERS = gql`
  {
    masters {
      _id
      quotesArr {
        _id
        author
        text
      }
      factsArr {
        _id
        genre
        text
      }
      vocabArr {
        _id
        text
        definition
        typeOfSpeech
      }
      geoArr {
        _id
        country
        flag
        continent
        capital
        phoneCode
      }
    }
  }
`;
