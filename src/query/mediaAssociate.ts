import { gql } from "@apollo/client";

export const createMediaAssociate = gql`
mutation CreateMediaAssociate(
  $place_unique_ids: [ID]
  $visit_unique_ids: [ID]
  $media_unique_id: ID
) {
  createMediaAssociate(
    data: {
      place_unique_ids: $place_unique_ids
      visit_unique_ids: $visit_unique_ids
      media_unique_id: $media_unique_id
    }
  ) {
    data {
      id
      attributes {
        place_unique_ids {
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
export const updateMediaAssociate = gql`
mutation UpdateMediaAssociate(
  $id: ID!
  $place_unique_ids: [ID]
  $visit_unique_ids: [ID]
) {
  updateMediaAssociate(
    id: $id,
    data: {
      place_unique_ids: $place_unique_ids
      visit_unique_ids: $visit_unique_ids
    }
  ) {
    data {
      id
      attributes {
        place_unique_ids {
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
