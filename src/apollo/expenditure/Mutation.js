import { gql } from "@apollo/client";


export const CREATE_EXPENDITURE_CATEGORY = gql`
mutation Mutation($data: CategoryExpenditureWhereCreateInput) {
  createCategoryExpenditure(data: $data) {
    id
  }
}
 `
export const DELETE_EXPENDITURE_CATEGORY = gql`
mutation DeleteCategoryExpenditure($where: CategoryExpenditureWhereInputId!) {
  deleteCategoryExpenditure(where: $where) {
    id
  }
}
 `
export const EDIT_EXPENDITURE_CATEGORY = gql`
mutation UpdateCategoryExpenditure($where: CategoryExpenditureWhereInputId!, $data: CategoryExpenditureWhereInput) {
  updateCategoryExpenditure(where: $where, data: $data) {
    id
  }
}
 `