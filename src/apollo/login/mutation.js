import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation LoginUser($data: LoginUserInput!) {
  loginUser(data: $data) {
    data {
      id
      fullName
      gender
      userId
      storeId {
        id
        name
      }
    }
    accessToken
  }
}
`;