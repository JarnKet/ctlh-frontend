import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query ProductForSales {
    productForSales {
      total
      data {
        productId {
          image
          qty
          sellPice
          typeMoney
        }
        productName
        detail
        note
      }
    }
  }
`;
