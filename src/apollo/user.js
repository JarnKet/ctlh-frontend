import { gql } from "@apollo/client";
// users
export const USERS = gql`
query Query {
  users {
    total
    data {
      id
      username
      firstName
      lastName
      phone
      email
    }
  }
}
`;