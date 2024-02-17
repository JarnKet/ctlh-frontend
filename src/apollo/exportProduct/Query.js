import { gql } from "@apollo/client";

export const GET_EXPORTS = gql`
query Receives($where: ReceiveWhereInput, $skip: Int, $limit: Int) {
  receives(where: $where, skip: $skip, limit: $limit) {
    total
    data {
      id
      productId {
        id
        name
      }
      productName
      productType
      qty
      userExportId {
        id
        gender
        fullName
      }
      createdAt
    }
  }
}
`