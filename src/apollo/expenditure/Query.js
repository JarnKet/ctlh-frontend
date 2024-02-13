import { gql } from "@apollo/client";

export const EXPENDITURE = gql`
query Expenditure($where: ExpenditureWhereInputId!) {
  expenditure(where: $where) {
    id
      name
      paymentMethod
      paymentStatus
      status
      images
      paydate
      billNumeber
      isDeleted
      note
      amount
      categoryExpenditureId {
        id
        name
      }
      categoryExpenditureName
      createdAt
      createdBy {
        id
        fullName
      }
      detail
      payer
      storeId {
        id
        name
      }
      typeMoney
      updatedAt
      updatedBy {
        id
        fullName
      }
  }
}
 `
export const EXPENDITURES = gql`
query Expenditures($limit: Int, $skip: Int, $where: ExpenditureWhereInput) {
  expenditures(limit: $limit, skip: $skip, where: $where) {
    total
    amountLak
    amountThb
    amountUsd
    amountCny
    data {
      id
      name
      images
      isDeleted
      note
      billNumeber
      paydate
      paymentMethod
      paymentStatus
      status
      amount
      categoryExpenditureId {
        id
        name
      }
      categoryExpenditureName
      createdAt
      createdBy {
        id
        fullName
      }
      detail
      payer
      storeId {
        id
        name
      }
      typeMoney
      updatedAt
      updatedBy {
        id
        fullName
      }
    }
  }
}
 `

export const GET_CATEGORY_EXPENDITURE = gql`
query Query($where: CategoryExpenditureWhereInput) {
  categoryExpenditures(where: $where) {
    total
    data {
      id
      name
      note
      isDeleted
      detail
      createdBy {
        id
        fullName
      }
      createdAt
      updatedAt
      updatedBy {
        id
        fullName
      }
      storeId {
        block
        id
      }
    }
  }
}
 `
export const DELETE_EXPENDITURE = gql`
mutation Mutation($where: ExpenditureWhereInputId!) {
  deleteExpenditure(where: $where) {
    id
  }
}
 `



export const CREATE_EXPENDITURE = gql`
mutation Mutation($data: ExpenditureWhereCreateInput) {
  createExpenditure(data: $data) {
    id
  }
}
 `

export const GET_USERS_FOR_DROPDOWN = gql`
query Users($where: UserWhereInput, $skip: Int, $orderBy: OrderByInput, $limit: Int) {
  users(where: $where, skip: $skip, orderBy: $orderBy, limit: $limit) {
    data {
      id
      code
      fullName
    }
  }
} 
 `