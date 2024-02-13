import { gql } from "@apollo/client";

export const GET_CATEGORY = gql`
query Category($where: CategoryWhereInput, $skip: Int, $limit: Int) {
    categorys(where: $where, skip: $skip, limit: $limit) {
      data {
        id
        name
        # image
        note
        detail
      }
      total
    }
  }
  `