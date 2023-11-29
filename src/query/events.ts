import { gql } from "@apollo/client";

export const eventByEventNumber = gql`
  query SearchEvents(
    $visitNumber: String
    $limit: Int
  ) {
    visits(
      pagination: { limit: $limit, start: 0 }
      filters: {
        or: [
      { visitNumber: { contains: $visitNumber } }
        ]
      }
    ) {
      meta {
        pagination {
          total
          pageCount
          pageSize
          page
        }
      }
      data {
        id
      }
    }
  }
`;

export const refineEvents = gql`
query RefineSearchEvent(
  $search_one: String
  $search_two: String
  $search_three: String
  $text: JSON
  $researchValue: JSON
  $tourismValue: JSON
  $stateOfConservation: JSON
  $recommendation: JSON
  $risk: JSON
  $period: JSON
  $siteType: JSON
  $assessmentType: JSON
  $otherAssessment: String
  $latitude: Float
  $longitude: Float
  $artifacts: JSON
  $keywords: JSON
  $limit: Int
  $skip: Int
  $startDate: Date
  $endDate: Date
  $sortBy: [String!]
)
{
  visits(
    pagination: { limit: $limit, start: $skip }
    filters: {
      or: [
        { siteDescription: { contains: $search_one } }
        { recordingTeam: { contains: $search_one } }
        { fieldNarrative: { contains: $search_one } }
        { siteDescription: { contains: $search_two } }
        { recordingTeam: { contains: $search_two } }
        { fieldNarrative: { contains: $search_two } }
        { siteDescription: { contains: $search_three } }
        { recordingTeam: { contains: $search_three } }
        { fieldNarrative: { contains: $search_three } }
        { keywords: { contains: $text } }
        { siteType: { containsi: $text } }
      ]
      and: [
        { stateOfConservation: { containsi: $stateOfConservation } }
        { period: { containsi: $period } }
        { researchValue: { containsi: $researchValue } }
        { tourismValue: { containsi: $tourismValue } }
        { recommendation: { containsi: $recommendation } }
        { risk: { containsi: $risk } }
        { artifacts: { containsi: $artifacts } }
        { siteType: { containsi: $siteType } }
        { assessmentType: { containsi: $assessmentType } }
        { otherAssessment: { containsi: $otherAssessment } }
        { latitude: { gte: $latitude } }
        { longitude: { lte: $longitude } }
        { visitDate: { gte: $startDate }}
        { visitDate: { lte: $endDate }}
        { keywords: { containsi: $keywords } }
        {
          deleted: {
            eq: false
          }
        }
      ]
    }
    sort: $sortBy
  ) {
    meta {
      pagination {
        total
        pageCount
        pageSize
        page
      }
    }
    data {
      id
      attributes {
        visitDate
        visitNumber
        recordingTeam
        siteDescription
        updatedAt
        createdAt
        keywords
        latitude
        longitude
        uniqueId
        period
        researchValue
        tourismValue
        stateOfConservation
        recommendation
        risk
        media_associates {
          data {
            attributes {
              media_unique_id {
                data {
                  attributes {
                    videoType
                    deleted
                    media_type {
                      data {
                        attributes {
                          typeCode
                          categoryCode
                        }
                      }
                    }
                    featuredImage
                    objectURL
                    object {
                      data {
                        attributes {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        visit_associate {
          data {
            id
            attributes {
              place_unique_id {
                data {
                id
                  attributes {
                    placeNumber
                    placeNameEnglish
                    placeNameArabic
                    siteType
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const refineEventsMap = gql`
query RefineSearchEventMap(
  $search_one: String
  $search_two: String
  $search_three: String
  $text: JSON
  $researchValue: JSON
  $tourismValue: JSON
  $stateOfConservation: JSON
  $recommendation: JSON
  $risk: JSON
  $period: JSON
  $siteType: JSON
  $assessmentType: JSON
  $otherAssessment: String
  $latitude: Float
  $longitude: Float
  $artifacts: JSON
  $keywords: JSON
  $startDate: Date
  $endDate: Date
  $limit: Int
)
{
  visits(
    pagination: { limit: $limit, start: 0 }
    filters: {
      or: [
        { siteDescription: { contains: $search_one } }
        { recordingTeam: { contains: $search_one } }
        { fieldNarrative: { contains: $search_one } }
        { siteDescription: { contains: $search_two } }
        { recordingTeam: { contains: $search_two } }
        { fieldNarrative: { contains: $search_two } }
        { siteDescription: { contains: $search_three } }
        { recordingTeam: { contains: $search_three } }
        { fieldNarrative: { contains: $search_three } }
        { keywords: { contains: $text } }
        { siteType: { containsi: $text } }
      ]
      and: [
        { stateOfConservation: { containsi: $stateOfConservation } }
        { period: { containsi: $period } }
        { researchValue: { containsi: $researchValue } }
        { tourismValue: { containsi: $tourismValue } }
        { recommendation: { containsi: $recommendation } }
        { risk: { containsi: $risk } }
        { artifacts: { containsi: $artifacts } }
        { siteType: { containsi: $siteType } }
        { assessmentType: { containsi: $assessmentType } }
        { otherAssessment: { containsi: $otherAssessment } }
        { latitude: { gte: $latitude } }
        { longitude: { lte: $longitude } }
        { visitDate: { gte: $startDate }}
        { visitDate: { lte: $endDate }}
        { keywords: { containsi: $keywords } }
        {
          deleted: {
            eq: false
          }
        }
      ]
    }
    sort: "createdAt:desc"
  ) {
    meta {
      pagination {
        total
        pageCount
        pageSize
        page
      }
    }
    data {
      id
      attributes {
        uniqueId
        latitude
        longitude
        visit_associate {
          data {
            id
            attributes {
              place_unique_id {
                data {
                id
                  attributes {
                    placeNameEnglish
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const addEvent = gql`
  mutation CreateEvent(
    $visitDate: Date
    $uniqueId: String
    $recordingTeam: String
    $fieldNarrative: String
    $visitUIPath: String
    $visitNumber: Int
    $asset_config_id: ID
    $siteDescription: String
    $siteType: JSON
    $researchValue: JSON
    $tourismValue: JSON
    $stateOfConservation: JSON
    $recommendation: JSON
    $risk: JSON
    $period: JSON
    $latitude: Float
    $longitude: Float
    $artifacts: JSON
    $keywords: JSON
    $assessmentType: JSON
    $otherAssessment: String
  ) {
    createVisit(
      data: {
        uniqueId: $uniqueId
        visitNumber: $visitNumber
        visitDate: $visitDate
        recordingTeam: $recordingTeam
        fieldNarrative: $fieldNarrative
        siteDescription: $siteDescription
        latitude: $latitude
        longitude: $longitude
        deleted: false
        keywords: $keywords
        visitUIPath: $visitUIPath
        asset_config_id: $asset_config_id
        siteType: $siteType
        recommendation: $recommendation
        tourismValue: $tourismValue
        stateOfConservation: $stateOfConservation
        risk: $risk
        researchValue: $researchValue
        period: $period
        artifacts: $artifacts
        assessmentType: $assessmentType
        otherAssessment: $otherAssessment
      }
    ) {
      data {
        id
        attributes {
          uniqueId
          asset_config_id {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const updateEvent = gql`
  mutation UpdateEvent(
    $id: ID!
    $visitDate: Date
    $recordingTeam: String
    $fieldNarrative: String
    $visitUIPath: String
    $visitNumber: Int
    $asset_config_id: ID
    $visit_associate: ID
    $media_associates: [ID]
    $siteDescription: String
    $siteType: JSON
    $researchValue: JSON
    $tourismValue: JSON
    $stateOfConservation: JSON
    $recommendation: JSON
    $risk: JSON
    $period: JSON
    $latitude: Float
    $longitude: Float
    $artifacts: JSON
    $keywords: JSON
    $assessmentType: JSON
    $otherAssessment: String
    $deleted: Boolean
  ) {
    updateVisit(
      id: $id,
      data: {
        visitNumber: $visitNumber
        visitDate: $visitDate
        recordingTeam: $recordingTeam
        fieldNarrative: $fieldNarrative
        siteDescription: $siteDescription
        latitude: $latitude
        longitude: $longitude
        deleted: $deleted
        keywords: $keywords
        visitUIPath: $visitUIPath
        asset_config_id: $asset_config_id
        visit_associate: $visit_associate
        media_associates: $media_associates
        siteType: $siteType
        recommendation: $recommendation
        tourismValue: $tourismValue
        stateOfConservation: $stateOfConservation
        risk: $risk
        researchValue: $researchValue
        period: $period
        artifacts: $artifacts
        assessmentType: $assessmentType
        otherAssessment: $otherAssessment
      }
    ) {
      data {
        id
        attributes {
          uniqueId
          asset_config_id {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const eventsKeyWords = gql`
query EventsKeyWordsSearch(
  $text: JSON
  ){
  visits(
    pagination: { limit: 10, start: 0}
    filters: {
      and: [
        { keywords: { containsi: $text } }
      ]
    }
  ) {
    data {
      id
      attributes {
        keywords
      }
    }
  }
}
`;
export const eventsAddKeyWords = gql`
query EventsKeyWordsSearch(
  $text: JSON
  ){
  visits(
    pagination: { limit: 100, start: 0}
    filters: {
      and: [
        { keywords: { containsi: $text } }
      ]
    }
  ) {
    data {
      id
      attributes {
        keywords
      }
    }
  }
}
`;
