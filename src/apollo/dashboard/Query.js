import { gql } from "@apollo/client";

export const DASHBOARD = gql`
query ExampleQuery($where: DashBroadWhereInput!) {
  dashBroad(where: $where) {
    product
    exportProduct
    importProduct
    productCloseToAll
    promotion
    newCustomer
    online {
      lak
      thb
      usd
      cny
    }
    onlineTotal
    tipCash
    tipOnline
    expenditure {
      all
      cash {
        lak
        thb
        usd
        cny
      }
      cashTotal
      online {
        lak
        thb
        usd
        cny
      }
      onlineTotal
    }
    staffEntryAndExit {
      entry
      exit
      absent
    }
    income {
      all
      waitingCheckout
      cashTotal
      onlineTotal
      onlineAndCash
      success
    }
  }
}
`
