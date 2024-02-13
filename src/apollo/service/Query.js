import { gql } from "@apollo/client";

export const GET_CATEGORY_SERVICE = gql`
query CategoryService($where: CategoryServiceWhereInputId!) {
  categoryService(where: $where) {
    id
      name
      detail
      isCourse
      note
      storeId {
        id
        name
        number
        phone
        whatsapp
        detail
        image
        note
        province
        district
        village
      }
      createdBy {
        id
        gender
        fullName
      }
      updatedBy {
        id
        gender
        fullName
      }
      createdAt
      updatedAt
  }
}`
export const GET_CATEGORY_SERVICES = gql`
query CategoryServices($where: CategoryServiceWhereInput, $skip: Int, $limit: Int) {
    categoryServices(where: $where, skip: $skip, limit: $limit) {
      total
      data {
        id
        name
        image
        isCourse
        detail
        note
        storeId {
          id
          name
          number
          phone
          whatsapp
          detail
          image
          note
          province
          district
          village
        }
        createdBy {
          id
          gender
          fullName
        }
        updatedBy {
          id
          gender
          fullName
        }
        createdAt
        updatedAt
      }
    }
}`

export const GET_SERVICE = gql`
query Service($where: ServiceWhereInputId!) {
  service(where: $where) {
    id
    name
    amount
    image
    detail
    note
    storeId {
      id
      name
    }
    serviceCategory {
      id
      name
    }
    createdAt
    createdBy {
      id
      gender
      fullName
    }
    updatedAt
    updatedBy {
      id
      gender
      fullName
    }
  }
}
`
export const GET_SERVICES = gql`
query Services($where: ServiceWhereInput, $skip: Int, $limit: Int) {
  services(where: $where, skip: $skip, limit: $limit) {
    total
    data {
      id
      name
      amount
      image
      detail
      note
      popular
      storeId {
        id
        name
      }
      serviceCategoryId {
        id
        name
      }
      createdAt
      createdBy {
        id
        gender
        fullName
      }
      updatedAt
      updatedBy {
        id
        gender
        fullName
      }
    }
  }
}
`