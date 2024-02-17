import { gql } from "@apollo/client";

export const GET_ENTRYS_AND_EXITS = gql`
query EntryAndExits($skip: Int, $limit: Int, $where: EntryAndExitWhereInput) {
  entryAndExits(skip: $skip, limit: $limit, where: $where) {
    total
    data {
      id
      latitude
      longitude
      locationDistance
      displayTime
      day
      digitalTime
      category
      type
      detail
      createdAt
      updatedAt
      note
      userId {
        id
        userId
        fullName
        phone
      }
      userName
      phone
    }
  }
}
 `

export const GET_ABSENTS = gql`
query Absents($where: AbsentWhereInput, $skip: Int, $limit: Int) {
  absents(where: $where, skip: $skip, limit: $limit) {
    total
    data {
      id
      userId {
        id
        fullName
        userId
        phone
      }
      status
      type
      description
      startDate
      endDate
      startTime
      endTime
      createdAt 
    }
  }
}
 `



export const GET_ABSENTS_REJECT_PRICES= gql`
query AbsentRejectPrices($where: AbsentRejectPriceWhereInput) {
  absentRejectPrices(where: $where) {
    data {
      id
      price
      staff {
        fullName
        id
      }
      status
      detail
      createdAt
      updatedAt
      note
    }
    total
  }
}
 `
