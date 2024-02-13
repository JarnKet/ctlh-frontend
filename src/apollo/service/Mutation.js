import { gql } from "@apollo/client";

export const CREATE_CATEGORY_SERVICE = gql`
mutation CreateCategoryService($data: CategoryServiceWhereCreateInput) {
  createCategoryService(data: $data) {
    id
  }
}
 `

export const UPDATE_CATEGORY_SERVICE = gql`
mutation UpdateCategoryService($where: CategoryServiceWhereInputId!, $data: CategoryServiceWhereInput) {
  updateCategoryService(where: $where, data: $data) {
    id
  }
}
 `

export const DELETE_CATEGORY_SERVICE = gql`
mutation DeleteCategoryService($where: CategoryServiceWhereInputId!) {
  deleteCategoryService(where: $where) {
    id
  }
}
 `

export const CREATE_SERVICE = gql`
mutation CreateService($data: ServiceWhereCreateInput) {
  createService(data: $data) {
    id
  }
}
 `

export const UPDATE_SERVICE = gql`
mutation UpdateService($where: ServiceWhereInputId!, $data: ServiceWhereInput) {
  updateService(where: $where, data: $data) {
    id
  }
}
 `

export const DELETE_SERVICE = gql`
mutation DeleteService($where: ServiceWhereInputId!) {
  deleteService(where: $where) {
    id
  }
}
 `