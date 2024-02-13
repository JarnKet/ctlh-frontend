import { gql } from "@apollo/client";


export const CREATE_DUTY = gql`
mutation CreateDuty($data: DutyWhereCreateInput) {
  createDuty(data: $data) {
    id
  }
}
 `
export const GET_DUTYS = gql`
query Duties($where: DutyWhereInput, $skip: Int, $limit: Int) {
  duties(where: $where, skip: $skip, limit: $limit) {
    data {
      id
      name
      amount
      detail
      note
      typeMoney
      createdAt
    }
  }
}
`