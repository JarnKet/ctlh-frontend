import { gql } from "@apollo/client";


export const CREATE_CATEGORY = gql`
mutation CreateCategory($data: CategoryWhereCreateInput) {
createCategory(data: $data) {
    id
  }
}
 `
export const UPDATE_CATEGORY = gql`
mutation UpdateCategory($where: CategoryWhereInputId!, $data: CategoryWhereInput) {
  updateCategory(where: $where, data: $data) {
    id
  }
}
`

export const DELETE_CATEGORY = gql`
mutation DeleteCategory($where: CategoryWhereInputId!) {
  deleteCategory(where: $where) {
    id
  }
}
 `