import { gql } from "@apollo/client";

export const GET_USER = gql`
  {
    user {
      _id
      username
      email
    }
  }
`;

export const GET_ADMIN = gql`
  query admin($id: ID!) {
    admin(_id: $id) {
      email
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
        author
        text
      }
      factsArr {
        genre
        text
      }
      vocabArr {
        text
        definition
        typeOfSpeech
      }
    }
  }
`;

export const GET_MASTERS = gql`
  {
    masters {
      _id
      quotesArr {
        author
        text
      }
      factsArr {
        genre
        text
      }
      vocabArr {
        text
        definition
        typeOfSpeech
      }
    }
  }
`;
