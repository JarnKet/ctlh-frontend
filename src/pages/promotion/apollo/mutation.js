
import { gql } from 'apollo-boost'

export const CREATE_PROMOTION = gql`
mutation CreatePromotion($data: PromotionWhereCreateInput) {
  createPromotion(data: $data) {
    id
  }
}
`;
export const UPDATE_PROMOTION = gql`
mutation UpdatePromotion($where: PromotionWhereInputId!, $data: PromotionWhereInput) {
  updatePromotion(where: $where, data: $data) {
    id
  }
}
`;
export const DELETE_PROMOTION = gql`
mutation DeletePromotion($where: PromotionWhereInputId!) {
  deletePromotion(where: $where) {
    id
  }
}
`;