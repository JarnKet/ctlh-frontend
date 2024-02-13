import { gql } from "@apollo/client";

export const GET_PROMOTION_LIST = gql`
query Data($where: PromotionWhereInput, $skip: Int, $limit: Int) {
  promotions(where: $where, skip: $skip, limit: $limit) {
    total
    data {
      id
      title
      code
      startDate
      endDate
      discount
      typePromotion
      image
      isDeleted
      detail
      createdAt
      updatedAt
    }
  }
}
 `

export const GET_PROMOTION = gql`
query Promotion($where: PromotionWhereInputId!) {
  promotion(where: $where) {
    id
    title
    code
    startDate
    endDate
    discount
    typePromotion
    image
    isDeleted
    detail
    createdAt
    updatedAt
  }
}
 `
