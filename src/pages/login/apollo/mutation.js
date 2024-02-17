
import { gql } from 'apollo-boost'

export const LOGIN_USER = gql`
mutation LoginUser($data: LoginUserInput!) {
  loginUser(data: $data) {
    data {
      id
      fullName
      gender
      userId
      role
      manageFuntion
      phone
      storeId {
        id
        name
      }
    }
    accessToken
  }
}
`;