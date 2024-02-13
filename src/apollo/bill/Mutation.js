
import { gql } from "@apollo/client";

export const OPEN_BILL = gql`
mutation CreateBill($data: BillWhereCreateInput) {
    createBill(data: $data) {
      id
    }
  }
  `;

export const CREATE_ORDER_BILL = gql`
mutation CreateOrderBill($data: OrderBillWhereCreateInput) {
  createOrderBill(data: $data) {
    id
    serviceName
    serviceId {
      id
      name
    }
    billId {
      id
      numberTable
    }
  }
}
  `;

export const DELETE_BILL = gql`
mutation DeleteBill($where: BillWhereInputId!) {
  deleteBill(where: $where) {
    id
  }
}
  `;
export const DELETE_ORDER_BILL = gql`
mutation DeleteOrderBill($where: BillWhereInputId!) {
  deleteOrderBill(where: $where) {
    id
  }
}
  `;

export const UPDATE_ORDER_BILL = gql`
mutation UpdateOrderBill($where: BillWhereInputId!, $data: OrderBillWhereCreateInput) {
  updateOrderBill(where: $where, data: $data) {
    id
  }
}
  `;

export const CHECK_BILL = gql`
mutation CheckOutBill($where: BillWhereInputId, $data: BillCheckOutWhereInputId) {
  checkOutBill(where: $where, data: $data) {
    id
  }
}
  `;

export const UPDATE_ORDER_COURSE = gql`
  mutation UpdateOrderCourse($where: OrderCourseWhereInputId!, $data: OrderCourseWhereCreateInput) {
    updateOrderCourse(where: $where, data: $data) {
      id
    }
  }
`;