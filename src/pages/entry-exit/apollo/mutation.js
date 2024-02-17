
import { gql } from 'apollo-boost'

export const CREATE_ENTRY_AND_EXIT = gql`
mutation CreateEntryAndExit($data: EntryAndExitWhereCreateInput) {
  createEntryAndExit(data: $data) {
    id
  }
}
`;

export const CREATE_REQUEST_ABSENT = gql`
mutation CreateAbsent($data: AbsentWhereCreateInput) {
  createAbsent(data: $data) {
    id
  }
}
`;

export const UPDATE_ABSENTS = gql`
mutation UpdateAbsent($where: AbsentWhereInputId!, $data: AbsentWhereCreateInput) {
  updateAbsent(where: $where, data: $data) {
    id
  }
}
`