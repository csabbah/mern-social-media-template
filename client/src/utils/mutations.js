import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
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
      }
    }
  }
`;

export const ADD_ADMIN = gql`
  mutation addAdmin($username: String!, $email: String!, $password: String!) {
    addAdmin(username: $username, email: $email, password: $password) {
      token
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
      }
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
    }
  }
`;

export const ADD_QUOTE = gql`
  mutation addQuote($text: String!, $author: String!, $masterId: String!) {
    addQuote(text: $text, author: $author, masterId: $masterId) {
      _id
    }
  }
`;

export const ADD_FACT = gql`
  mutation addFact($text: String!, $genre: String!, $masterId: String!) {
    addFact(text: $text, genre: $genre, masterId: $masterId) {
      _id
    }
  }
`;
