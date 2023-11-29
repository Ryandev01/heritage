import { gql } from "@apollo/client";

export const download = gql`
query searchDownloads($token: String) {
  downloads(
    filters: { token: { eq: $token } }
    sort: "createdAt:desc"
  ) {
    data {
      id
      attributes {
        title,
        filePath,
        dataCount,
        fileCount,
        libraryCount,
        visitCount,
        createdAt,
        token,
        status
      }
    }
  }
}
`;

export const addDownload = gql`
  mutation CreateDownload(
    $token: String
  ) {
    createDownload(
      data: {
        title: "Title"
        filePath: "Path"
        dataCount: 0
        fileCount: 0
        libraryCount: 0
        visitCount: 0
        token: $token
        status: "Pending"
      }
    ) {
      data {
        id
        attributes {
          title
          token
          status
        }
      }
    }
  }
`;