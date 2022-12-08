import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOGIN_ADMIN = gql`
  mutation loginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      token
      user {
        _id
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_ADMIN = gql`
  mutation addAdmin($username: String!, $email: String!, $password: String!) {
    addAdmin(username: $username, email: $email, password: $password) {
      token
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_ADMIN = gql`
  mutation removeAdmin($id: String!) {
    removeAdmin(id: $id) {
      token
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_FAVOURITE = gql`
  mutation addFavourite($postId: String!, $userId: String!) {
    addFavourite(postId: $postId, userId: $userId) {
      _id
      favouritedArr
    }
  }
`;

export const REMOVE_FAVOURITE = gql`
  mutation removeFavourite($favouriteId: String!, $userId: String!) {
    removeFavourite(favouriteId: $favouriteId, userId: $userId) {
      _id
      favouritedArr
    }
  }
`;

export const ADD_LIKE = gql`
  mutation addLike($postId: String!, $userId: String!, $conjointId: String!) {
    addLike(postId: $postId, userId: $userId, conjointId: $conjointId) {
      _id
      postId
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_LIKE = gql`
  mutation removeLike($likeId: String!, $userId: String!) {
    removeLike(likeId: $likeId, userId: $userId) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment(
    $postId: String!
    $userId: String!
    $text: String!
    $username: String!
  ) {
    addComment(
      postId: $postId
      userId: $userId
      text: $text
      username: $username
    ) {
      __typename
      _id
      postId
      userId
      text
      liked
      replies {
        _id
        updatedAt
        createdAt
        text
        username
        userId
        commentId
        replyToReply
        replyLikes
      }
      username
      createdAt
      updatedAt
      updated
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation updateComment($commentId: String!, $text: String!) {
    updateComment(commentId: $commentId, text: $text) {
      __typename
      _id
      postId
      userId
      text
      liked
      replies {
        _id
        updatedAt
        createdAt
        text
        username
        userId
        commentId
        replyToReply
        replyLikes
      }
      username
      createdAt
      updatedAt
      updated
    }
  }
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($commentId: String!, $userId: String!) {
    removeComment(commentId: $commentId, userId: $userId) {
      __typename
      _id
      postId
      userId
      text
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
        replyToReply
        replyLikes
      }
      createdAt
      updatedAt
      updated
    }
  }
`;

export const ADD_COMMENT_LIKE = gql`
  mutation addCommentLike($commentId: String!, $userId: String!) {
    addCommentLike(commentId: $commentId, userId: $userId) {
      __typename
      _id
      postId
      userId
      text
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
        replyToReply
        replyLikes
      }
      createdAt
      updatedAt
      updated
    }
  }
`;

export const REMOVE_COMMENT_LIKE = gql`
  mutation removeCommentLike($userId: String!, $commentId: String!) {
    removeCommentLike(userId: $userId, commentId: $commentId) {
      __typename
      _id
      postId
      userId
      text
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
        replyToReply
        replyLikes
      }
      createdAt
      updatedAt
      updated
    }
  }
`;

export const ADD_REPLY = gql`
  mutation addReply($replyToSave: repliesInput) {
    addReply(replyToSave: $replyToSave) {
      __typename
      _id
      postId
      userId
      text
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
        replyToReply
        replyLikes
      }
      createdAt
      updatedAt
      updated
    }
  }
`;

export const REMOVE_REPLY = gql`
  mutation removeReply($commentId: String!, $replyId: String!) {
    removeReply(commentId: $commentId, replyId: $replyId) {
      __typename
      _id
      postId
      userId
      text
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
        replyToReply
        replyLikes
      }
      createdAt
      updatedAt
      updated
    }
  }
`;

export const ADD_REPLY_TO_REPLY = gql`
  mutation addReplyToReply(
    $commentId: String!
    $replyId: String!
    $replyText: String!
    $userId: String!
    $username: String!
  ) {
    addReplyToReply(
      commentId: $commentId
      replyId: $replyId
      replyText: $replyText
      userId: $userId
      username: $username
    ) {
      __typename
      _id
      postId
      userId
      text
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
        replyToReply
        replyLikes
      }
      createdAt
      updatedAt
      updated
    }
  }
`;
// export const ADD_MASTER = gql`
//   mutation addMaster($company: String!) {
//     addMaster(company: $company) {
//       company
//     }
//   }
// `;

export const ADD_MASTER = gql`
  mutation addMaster {
    addMaster {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const ADD_QUOTE = gql`
  mutation addQuote($text: String!, $author: String!, $masterId: String!) {
    addQuote(text: $text, author: $author, masterId: $masterId) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const ADD_FACT = gql`
  mutation addFact($text: String!, $genre: String!, $masterId: String!) {
    addFact(text: $text, genre: $genre, masterId: $masterId) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const ADD_VOCAB = gql`
  mutation addVocab(
    $text: String!
    $typeOfSpeech: String!
    $definition: String!
    $masterId: String!
  ) {
    addVocab(
      text: $text
      typeOfSpeech: $typeOfSpeech
      definition: $definition
      masterId: $masterId
    ) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const ADD_GEO = gql`
  mutation addGeo(
    $country: String!
    $capital: String!
    $phoneCode: String!
    $masterId: String!
    $continent: String!
    $flag: String!
  ) {
    addGeo(
      country: $country
      capital: $capital
      phoneCode: $phoneCode
      masterId: $masterId
      continent: $continent
      flag: $flag
    ) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_GEO = gql`
  mutation removeItem($masterId: String!, $itemId: String!, $arr: String!) {
    removeItem(masterId: $masterId, itemId: $itemId, arr: $arr) {
      _id
      createdAt
      updatedAt
    }
  }
`;
