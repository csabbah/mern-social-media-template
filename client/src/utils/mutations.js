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

export const ADD_MASTER = gql`
  mutation addMaster($company: String!) {
    addMaster(company: $company) {
      company
    }
  }
`;

export const ADD_NOTE = gql`
  mutation addNote($text: String!, $masterId: String!) {
    addNote(text: $text, masterId: $masterId) {
      _id
    }
  }
`;
