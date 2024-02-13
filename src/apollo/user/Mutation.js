import { gql } from "@apollo/client";


export const CREATE_USER = gql`
mutation CreateUser($data: UserWhereCreateInput!) {
  createUser(data: $data) {
    id
  }
}
 `

export const UPDATE_USER = gql`
mutation UpdateUser($data: UserWhereInput!, $where: UserWhereInputId!) {
  updateUser(data: $data, where: $where) {
    id
  }
}
 `
export const DELETE_USER = gql`
mutation DeleteUser($where: UserWhereInputId!) {
  deleteUser(where: $where) {
    id
  }
}
 `
export const UPDATE_ALL_COMMISSION = gql`
mutation UpdateAllCommission($where: CommissionWhereInputId) {
  updateAllCommission(where: $where) {
    status
  }
}
`