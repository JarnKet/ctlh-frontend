import { gql } from "@apollo/client";


export const CREATE_RECEIVE = gql`
mutation CreateReceive($data: ReceiveWhereCreateInput) {
  createReceive(data: $data) {
    id
  }
}
 `

export const DELETE_RECEIVE = gql`
mutation DeleteReceive($where: ReceiveWhereInputId!) {
  deleteReceive(where: $where) {
    id
  }
}
 `