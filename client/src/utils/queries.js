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
    }
  }
`;
