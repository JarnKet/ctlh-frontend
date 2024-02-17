import { gql } from "@apollo/client";


export const CREATE_PRODUCT = gql`
mutation CreateProduct($data: ProductWhereCreateInput) {
  createProduct(data: $data) {
    id
  }
}
 `

export const UPDATE_PRODUCT = gql`
mutation UpdateProduct($where: ProductWhereInputId!, $data: ProductWhereInput) {
  updateProduct(where: $where, data: $data) {
    id
  }
}
 `

export const DELETE_PRODUCT = gql`
mutation DeleteProduct($where: ProductWhereInputId!) {
  deleteProduct(where: $where) {
    id
  }
}
 `
