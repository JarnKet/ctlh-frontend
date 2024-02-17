import { gql } from "@apollo/client";

export const GET_BILL = gql`
  query Bill($where: BillWhereInputId!) {
    bill(where: $where) {
      id
      discount
      numberTable
      code
      countService
      paymentMethod
      promotionId {
        id
      }
      customer {
        userAuth
        id
        fullName
      }
      amount
      courseAmount
      isDeleted
    }
  }
`;

export const GET_BILLS = gql`
query Bills($limit: Int, $skip: Int, $where: BillWhereInput) {
  bills(limit: $limit, skip: $skip, where: $where) {
    total
    data {
      amount
      amountCash
      amountOnline
      code
      countService
      courseAmount
      tipCash
      tipOnline
      createdAt
      createdBy {
        id
        fullName
        phone
        userAuth
      }
      customer {
        id
        fullName
        phone
      }
      customerFullName
      detail
      discount
      dutyAmount
      dutyId {
        id
        name
      }
      finalAmount
      id
      note
      numberTable
      paymentMethod
      promotionAmount
      promotionId {
        id
        title
        code
        discount
      }
      serviceId {
        id
        name
        amount
      }
      status
      tipCash
      tipOnline
      updatedAt
      updatedBy {
        id
        fullName
        phone
        userAuth
      }
    }
  }
}
`;

export const GET_ORDER_BILLS = gql`
  query OrderBills($where: OrderBillWhereInput, $orderBy: OrderByInput, $skip: Int, $limit: Int) {
    OrderBills(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      finalAmount
      data {
        id
        no
        amount
        status
        serviceCategoryId {
          id
          name
        }
        serviceCategoryName
        serviceId {
          id
          name
          amount
        }
        serviceName
        billId {
          id
          amount
          numberTable
          discount
          finalAmount
          paymentMethod
          customer {
            id
            fullName
            phone
          }
        }
        storeId {
          id
          phone
          whatsapp
          name
          number
        }
        staff {
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
`;
export const GET_COMMISSION = gql`
query Commission($where: CommissionWhereInputId!, $skip: Int, $limit: Int) {
  commission(where: $where, skip: $skip, limit: $limit) {
      summary
      orderBillCount
      summaryPrice
      orderBill {
        id
        no
        serviceName
        serviceCategoryName
        amount
        billNumber
        isCalculatedSalary
        coursePrice
        courseQty
        createdAt
        updatedAt
        billId {
          numberTable
        }
      }
    }
  }
`;

export const ORDER_COURSE = gql`
  query OrderCourse($where: OrderCourseWhereInputId!) {
    orderCourse(where: $where) {
      id
      no
      price
      customer {
        id
        fullName
        phone
      }
      status
      detail
      createdAt
      updatedAt
      note
      billId {
        id
        amount
        code
        status
        numberTable
        serviceId {
          id
          name
        }
      }
      staff {
        id
        fullName
        phone
      }
      createdBy {
        id
        fullName
        phone
      }
      updatedBy {
        id
        fullName
        phone
      }
    }
  }
`;
export const ORDER_COURSES = gql`
  query OrderCourses($where: OrderCourseWhereInput) {
    orderCourses(where: $where) {
      total
      data {
        id
        no
        price
        customer {
          id
          fullName
          phone
        }
        status
        detail
        createdAt
        updatedAt
        note
        billId {
          id
          amount
          code
          status
          numberTable
          serviceId {
            id
            name
          }
        }
        staff {
          id
          fullName
          phone
        }
        createdBy {
          id
          fullName
          phone
        }
        updatedBy {
          id
          fullName
          phone
        }
      }
    }
  }
`;
