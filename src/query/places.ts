import { gql } from "@apollo/client";

export const refinePlaces = gql`

query refinedSearch(
  $text: JSON
  $search_one: String
  $search_two: String
  $search_three: String
  $researchValue: JSON
  $tourismValue: JSON
  $stateOfConservation: JSON
  $recommendation: JSON
  $risk: JSON
  $period: JSON
  $siteType: JSON
  $latitude: Float
  $longitude: Float
  $artifacts: JSON
  $keywords: JSON
  $limit: Int
  $skip: Int
  $sortBy: [String!]
) {
  places(
    pagination: { limit: $limit, start: $skip }
    filters: {
      or: [
        { placeNameEnglish: { containsi: $search_one } }
        { placeNameEnglish: { containsi: $search_two } }
        { placeNameEnglish: { containsi: $search_three } }
        { placeNameArabic: { containsi: $search_one } }
        { placeNameArabic: { containsi: $search_two } }
        { placeNameArabic: { containsi: $search_three } }
        { siteDescription: { containsi: $search_one } }
        { siteDescription: { containsi: $search_two } }
        { siteDescription: { containsi: $search_three } }
        { placeNumber: { containsi: $search_one } }
        { placeNumber: { containsi: $search_two } }
        { placeNumber: { containsi: $search_three } }
        { keywords: { containsi: $text } }
        { siteType: { containsi: $text } }
      ]
      and: [
        { researchValue: { containsi: $researchValue } }
        { tourismValue: { containsi: $tourismValue } }
        { stateOfConservation: { containsi: $stateOfConservation } }
        { recommendation: { containsi: $recommendation } }
        { risk: { containsi: $risk } }
        { artifacts: { containsi: $artifacts } }
        { period: { containsi: $period } }
        { latitude: { gte: $latitude } }
        { longitude: { lte: $longitude } }
        { keywords: { containsi: $keywords } }
        { siteType: { containsi: $siteType } }
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
        placeNameEnglish
        placeNameArabic
        siteDescription
        updatedAt
        keywords
        placeNumber
        latitude
        longitude
        uniqueId
        period
        researchValue
        siteType
        tourismValue
        stateOfConservation
        recommendation
        risk
        remark_headers {
          data{
            id
          }
        }
        media_associates {
          data {
            attributes {
              media_unique_id {
                data {
                  id
                  attributes {
                    videoType
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
                        id
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
      }
    }
  }
}
`;

export const refinePlacesMap = gql`
query refinedSearch(
  $text: JSON
  $search_one: String
  $search_two: String
  $search_three: String
  $researchValue: JSON
  $tourismValue: JSON
  $stateOfConservation: JSON
  $recommendation: JSON
  $risk: JSON
  $period: JSON
  $siteType: JSON
  $latitude: Float
  $longitude: Float
  $artifacts: JSON
  $keywords: JSON
  $limit: Int
) {
  places(
    pagination: { limit: $limit, start: 0 }
    filters: {
      or: [
        { placeNameEnglish: { containsi: $search_one } }
        { placeNameEnglish: { containsi: $search_two } }
        { placeNameEnglish: { containsi: $search_three } }
        { placeNameArabic: { containsi: $search_one } }
        { placeNameArabic: { containsi: $search_two } }
        { placeNameArabic: { containsi: $search_three } }
        { siteDescription: { containsi: $search_one } }
        { siteDescription: { containsi: $search_two } }
        { siteDescription: { containsi: $search_three } }
        { placeNumber: { containsi: $search_one } }
        { placeNumber: { containsi: $search_two } }
        { placeNumber: { containsi: $search_three } }
        { keywords: { containsi: $text } }
        { siteType: { containsi: $text } }
      ]
      and: [
        { researchValue: { containsi: $researchValue } }
        { tourismValue: { containsi: $tourismValue } }
        { stateOfConservation: { containsi: $stateOfConservation } }
        { recommendation: { containsi: $recommendation } }
        { risk: { containsi: $risk } }
        { artifacts: { containsi: $artifacts } }
        { period: { containsi: $period } }
        { latitude: { gte: $latitude } }
        { longitude: { lte: $longitude } }
        { keywords: { containsi: $keywords } }
        { siteType: { containsi: $siteType } }
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
        placeNameEnglish
        latitude
        longitude
      }
    }
  }
}
`;

export const addPlace = gql`
  mutation CreatePlace(
    $placeNameEnglish: String
    $uniqueId: String
    $placeNameArabic: String
    $placeNumber: String!
    $previousNumber: String
    $siteDescription: String
    $placeValue: Int
    $asset_config_id: ID
    $placeUIPath: String
    $researchValue: JSON
    $tourismValue: JSON
    $stateOfConservation: JSON
    $recommendation: JSON
    $siteType: JSON
    $risk: JSON
    $period: JSON
    $latitude: Float
    $longitude: Float
    $artifacts: JSON
    $keywords: JSON
  ) {
    createPlace(
      data: {
        placeNameEnglish: $placeNameEnglish
        uniqueId: $uniqueId
        placeNameArabic: $placeNameArabic
        placeNumber: $placeNumber
        previousNumber: $previousNumber
        siteDescription: $siteDescription
        deleted: false
        keywords: $keywords
        placeUIPath: $placeUIPath
        placeValue: $placeValue
        latitude: $latitude
        longitude: $longitude
        asset_config_id: $asset_config_id
        siteType: $siteType
        researchValue: $researchValue
        artifacts: $artifacts
        tourismValue: $tourismValue
        stateOfConservation: $stateOfConservation
        recommendation: $recommendation
        risk: $risk
        period: $period
      }
    ) {
      data {
        id
        attributes {
          placeNameEnglish
          placeNameArabic
          placeNumber
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

export const updatePlace = gql`
  mutation UpdatePlace(
    $id: ID!
    $placeNameEnglish: String
    $uniqueId: String
    $placeNameArabic: String
    $placeNumber: String!
    $previousNumber: String
    $siteDescription: String
    $placeValue: Int
    $asset_config_id: ID
    $placeUIPath: String
    $researchValue: JSON
    $tourismValue: JSON
    $stateOfConservation: JSON
    $recommendation: JSON
    $siteType: JSON
    $risk: JSON
    $period: JSON
    $latitude: Float
    $longitude: Float
    $artifacts: JSON
    $keywords: JSON
  ) {
    updatePlace(
      id: $id
      data: {
        placeNameEnglish: $placeNameEnglish
        uniqueId: $uniqueId
        placeNameArabic: $placeNameArabic
        placeNumber: $placeNumber
        previousNumber: $previousNumber
        siteDescription: $siteDescription
        deleted: false
        keywords: $keywords
        placeUIPath: $placeUIPath
        placeValue: $placeValue
        latitude: $latitude
        longitude: $longitude
        asset_config_id: $asset_config_id
        siteType: $siteType
        researchValue: $researchValue
        artifacts: $artifacts
        tourismValue: $tourismValue
        stateOfConservation: $stateOfConservation
        recommendation: $recommendation
        risk: $risk
        period: $period
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

export const placesKeyWords = gql`
  query PlacesKeyWordsSearch(
    $text: JSON
  ) {
    places(
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
export const placesAddKeyWords = gql`
  query PlacesKeyWordsSearch(
    $text: JSON
  ) {
    places(
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