import { gql } from "@apollo/client";

export const GET_RECEIVE = gql`
query Receives($where: ReceiveWhereInput, $skip: Int, $limit: Int) {
  receives(where: $where, skip: $skip, limit: $limit) {
    total
    data {
      brand
      createdAt
      createdBy {
        id
        fullName
      }
      qty
      storeId {
        id
      }
      detail
      isDeleted
      updatedAt
      note
      name
      productName
      productId {
        id
        name
        barcode
      }
      id
      barcode
      importNo
      categoryId {
        id
        name
      }
      categoryName
      productType
    }
  }
}
`