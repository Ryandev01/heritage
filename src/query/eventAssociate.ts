import { gql } from "@apollo/client";

export const createVisitAssociate = gql`
mutation CreateVisitAssociate(
  $place_unique_id: ID
  $visit_unique_id: ID
) {
  createVisitAssociate(
    data: {
      place_unique_id: $place_unique_id
      visit_unique_id: $visit_unique_id
    }
  ) {
    data {
      id
      attributes {
        place_unique_id {
          data {
            id
            attributes {
              uniqueId
            }
          }
        }
        visit_unique_id {
          data {
            id
            attributes {
              uniqueId
            }
          }
        }
      }
    }
  }
}
`
