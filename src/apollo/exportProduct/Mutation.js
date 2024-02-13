import { gql } from "@apollo/client";


export const CREATE_EXPORT = gql`
mutation ExportReceive($data: [ReceiveWhereCreateInput]) {
  exportReceive(data: $data) {
    message
  }
}
 `

export const DELETE_EXPORT = gql`
mutation DeleteReceive($where: ReceiveWhereInputId!) {
  deleteReceive(where: $where) {
    id
  }
}
 `