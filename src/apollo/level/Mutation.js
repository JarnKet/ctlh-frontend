import { gql } from "@apollo/client";

export const CREATE_LEVEL = gql`
mutation CreateLevel($data: LevelInput!) {
  createLevel(data: $data) {
    id
  }
}
`;