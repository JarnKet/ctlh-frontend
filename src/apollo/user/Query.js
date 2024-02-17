import { gql } from "@apollo/client";

export const GET_USERS = gql`
query Users($where: UserWhereInput, $skip: Int, $limit: Int) {
  users(where: $where, skip: $skip, limit: $limit) {
    total
    data {
      id
      fullName
      storeId {
        id
        name
      }
      manageFuntion
      salary
      role
      userId
      village
      province
      phone
      userNo
      image
      gender
      district
      detail
      birthday
      note
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

export const GET_USER = gql`
query User($where: UserWhereInputId!) {
  user(where: $where) {
    id
    fullName
    storeId {
      id
      name
    }
    manageFuntion
    salary
    role
    userId
    village
    province
    phone
    userNo
    image
    gender
    district
    detail
    birthday
    note
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