import { gql } from "@apollo/client";


export const PRESIGNED_URL = gql`
mutation PreSignedUrl($fileName: String!, $mimeType: String!) {
  preSignedUrl(fileName: $fileName, mimeType: $mimeType) {
    url
  }
}
`;