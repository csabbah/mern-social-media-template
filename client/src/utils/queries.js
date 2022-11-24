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
