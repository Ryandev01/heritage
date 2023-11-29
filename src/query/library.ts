import { gql } from "@apollo/client";

export const library = gql`
query librarySearchList(
  $search_one: String
  $search_two: String
  $search_three: String
  $text: JSON
  $limit: Int
  $skip: Int
  $sortBy: [String!]
) {
  medias(
    pagination: { limit: $limit, start: $skip }
    filters: {
      and: [
        
        {
          or: [
            { description: { contains: $search_one } }
            { title: { contains: $search_one } }
            { fileName: { contains: $search_one } }
            { citation: { contains: $search_one } }
            { keywords: { contains: $text } }
            { description: { contains: $search_two } }
            { title: { contains: $search_two } }
            { fileName: { contains: $search_two } }
            { citation: { contains: $search_two } }
            { description: { contains: $search_three } }
            { title: { contains: $search_three } }
            { fileName: { contains: $search_three } }
            { citation: { contains: $search_three } }
          ]
        }
        {
          media_type: {
            categoryCode: {
              containsi: "LIBRARY"
            }
          }
        }
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
        keywords
        description
        title
        fileName
        citation
        referenceURL
        uniqueId
        updatedAt
        bearing
        categoryType

        featuredImage
        media_type {
          data {
            attributes {
              typeCode
            }
          }
        }
        imageMetadata {
          fileSize
        }
        object {
          data {
            id
            attributes {
              url
              size
            }
          }
        }
        media_associate {
          data {
            attributes {
              place_unique_ids{
                data {
                  attributes {
                    placeNameArabic
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

export const refineLibrary = gql`
query RefinedLibrarySearch(
  $search_one: String
  $search_two: String
  $search_three: String
  $latitude: Float
  $longitude: Float
  $featuredImage: Boolean
  $categoryType: JSON
  $limit: Int
  $skip: Int
) {
  medias(
    pagination: { limit: $limit, start: $skip }
    filters: {
      or: [
        { description: { contains: $search_one } }
        { title: { contains: $search_one } }
        { fileName: { contains: $search_one } }
        { citation: { contains: $search_one } }
        # { keywords: { contains: $search_one } }
        { description: { contains: $search_two } }
        { title: { contains: $search_two } }
        { fileName: { contains: $search_two } }
        { citation: { contains: $search_two } }
        # { keywords: { contains: $search_two } }
        { description: { contains: $search_three } }
        { title: { contains: $search_three } }
        { fileName: { contains: $search_three } }
        { citation: { contains: $search_three } }
        # { keywords: { contains: $search_three } }
      ]
      and: [
        {	latitude: { gte: $latitude } }
        {	longitude: { lte: $longitude } }
        { featuredImage: { eq: $featuredImage } }
        { categoryType: { containsi: $categoryType } }
        {
          media_type: {
            categoryCode: {
              containsi: "LIBRARY"
            }
          }
        }
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
        keywords
        description
        title
        fileName
        citation
        referenceURL
        uniqueId
        updatedAt
        bearing
        categoryType
        latitude
        longitude
        featuredImage
        media_type {
          data {
            attributes {
              typeCode
            }
          }
        }
        imageMetadata {
          fileSize
        }
        object {
          data {
            id
            attributes {
              url
              size
            }
          }
        }
        media_associate {
          data {
            attributes {
              place_unique_ids{
                data {
                  id
                  attributes {
                    placeNameArabic
                    placeNameEnglish
                  }
                }
              }
              visit_unique_ids {
                data {
                  id
                  attributes {
                    visitDate 
                    visitNumber
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

export const addLibrary = gql`
mutation CreateLibrary(
  $uniqueId: String
  $title: String
  $bearing: String
  $Author: String
  $description: String
  $categoryType: JSON
  $fileName: String
  $latitude: Float
  $longitude: Float
  $featuredImage: Boolean
  $objectURL: String
  $referenceURL: String
  $citation: String
  $keywords: JSON
  $mediaUIPath: String
  $fileSize: String
  $storage: String
  $make: String
  $model: String
  $depth: String
  $videoType: ENUM_MEDIA_VIDEOTYPE
  $dimension: String
  $created: Date
  $modified: DateTime
  $asset_config_id: [ID]
  $object: ID
) {
  createMedia(
    data: {
      uniqueId: $uniqueId
      title: $title
      bearing: $bearing
      Author: $Author
      description: $description
      categoryType: $categoryType
      latitude: $latitude
      longitude: $longitude
      deleted: false
      keywords: $keywords
      fileName: $fileName
      media_type: $asset_config_id
      featuredImage: $featuredImage
      objectURL: $objectURL
      videoType: $videoType
      referenceURL: $referenceURL
      citation: $citation
      mediaUIPath: $mediaUIPath
      imageMetadata: {
        fileName: $fileName
        longitude: $longitude
        latitude: $latitude
        fileSize: $fileSize
        storage: $storage
        make: $make
        model: $model
        depth: $depth
        dimension: $dimension
        created: $created
        modified: $modified
      }
      object: $object
    }
  ) {
    data {
      id
      attributes {
        uniqueId
        media_associate {
          data {
            id
          }
        }
        media_type {
          data{
            attributes {
              categoryCode
              typeCode
            }
          }
        }
      }
    }
  }
}
`;

export const updateLibrary = gql`
mutation UpdateMedia(
  $id: ID!
$title: String
$bearing: String
$Author: String
$description: String
$categoryType: JSON
$fileName: String
$latitude: Float
$longitude: Float
$featuredImage: Boolean
$objectURL: String
$referenceURL: String
$citation: String
$keywords: JSON
$fileSize: String
$storage: String
$make: String
$model: String
$depth: String
$dimension: String
$created: Date
$modified: DateTime
$asset_config_id: [ID]
$object: ID
$deleted: Boolean
) {
  updateMedia(
    id: $id,
    data: {
    title: $title
    bearing: $bearing
    Author: $Author
    description: $description
    categoryType: $categoryType
    latitude: $latitude
    longitude: $longitude
    deleted: $deleted
    keywords: $keywords
    fileName: $fileName
    media_type: $asset_config_id
    featuredImage: $featuredImage
    objectURL: $objectURL
    referenceURL: $referenceURL
    citation: $citation
    object: $object
      imageMetadata: {
      fileName: $fileName
      longitude: $longitude
      latitude: $latitude
      fileSize: $fileSize
      storage: $storage
      make: $make
      model: $model
      depth: $depth
      dimension: $dimension
      created: $created
      modified: $modified
    }
    }
  ) {
    data {
    id
    attributes {
      uniqueId
      media_associate {
        data {
          id
        }
      }
      media_type {
        data{
          attributes {
            categoryCode
            typeCode
          }
        }
      }
    }
  }
  }
}
`;
