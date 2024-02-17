import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
query Products($skip: Int, $limit: Int, $where: ProductWhereInput) {
  products(skip: $skip, limit: $limit, where: $where) {
    total
    data {
      id
      image
      name
      qty
      barcode
      categoryId {
        id
        name
      }
      buyPrice
      sellPice
      detail
      note
      typeMoney
      storeId {
        id
        name
      }
      createdAt
      createdBy {
        id
        fullName
      }
      updatedAt
      updatedBy {
        id
        fullName
      }
    }
  }
}
`

export const GET_PRODUCT = gql`
query Product($where: ProductWhereInputId!) {
  product(where: $where) {
    id
    image
    name
    qty
    barcode
    categoryId {
      id
      name
    }
    buyPrice
    sellPice
    detail
    typeMoney
    note
    storeId {
      id
      name
    }
    createdAt
    createdBy {
      id
      fullName
    }
    updatedAt
    updatedBy {
      id
      fullName
    }
  }
}
`