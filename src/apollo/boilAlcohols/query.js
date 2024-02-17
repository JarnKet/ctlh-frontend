import { gql } from "@apollo/client";

export const BOIL_ALCOHOLS = gql`
query BoilAlcohols($where: BoilAlcoholWhereInput) {
  boilAlcohols(where: $where) {
    data {
      id
      amountFlour
      amountRice
      amountCalculatedAlcohol
      boilRiceTime
      member {
        id
        code
        fullName
        province
        district
        village
        group
      }
      realEndSoakRiceDate
      startBoilRiceDate
      startSoakRiceDate
      status
      createdAt
    }
  }
}
`;

export const BOIL_ALCOHOL = gql`
query BoilAlcohol($where: BoilAlcoholWhereOneInput!) {
  boilAlcohol(where: $where) {
    amountRice
    amountFlour
    amountCalculatedAlcohol
    startBoilRiceDate
    startSoakRiceDate
    endBoilRiceDate
    endSoakRiceDate
    boilRiceTime
    realEndSoakRiceDate
    status
    id
    member {
      code
      fullName
      id
      province
      district
      village
    }
  }
}
 `