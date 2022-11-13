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
  query master($id: ID!) {
    master(_id: $id) {
      company
      notesArr {
        text
      }
    }
  }
`;

export const GET_MASTER = gql`
  {
    masters {
      company
      notesArr {
        text
      }
    }
  }
`;

export const GET_MASTERS = gql`
  {
    masters {
      company
      notesArr {
        text
      }
    }
  }
`;
