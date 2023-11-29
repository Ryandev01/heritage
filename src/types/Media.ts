import { Event } from "./Event";
import { MediaAssociates2_MediaObject, Place } from "./Place";
import { InventoryAssociationType_Event, InventoryAssociationType } from "./SearchResultsTabsProps";

export type PlaceUnique = {
  place_unique_ids: {
    data: Place[] | null;
  };
};
export type VisitUnique = {
  visit_unique_ids: {
    data: Event[] | null;
  };
};

type MediaTypeObject = {
  attributes : {
    typeCode: string
  }
}

export type MediaAttributes = {
    thumbnailUrl?: string;
    title: string;
    description: string;
    referenceURL: string;
    fileName: string;
    bearing: string;
    actionType: string;
    featuredImage: boolean;
    updatedAt: Date;
    keywords: string[] | null;
    citation: string;
    latitude: number;
    longitude: number;
    imageMetadata: {
      fileSize: Number;
    };
    uniqueId: string;
    object: {
      data: {
        attributes: {
          url: string;
          
        };
      };
    };
    formats : {
      thumbnail?: any
      small?: any
      large?: any
    }
    videoType: "video" | "url" | "embededCode";
    objectURL: string | null
    media_associate: {
      data: {
      attributes: PlaceUnique & VisitUnique;
    }
    }
    media_type: {
      data: MediaTypeObject[]
    }
}

export type Media = {
  id: string;
  attributes: MediaAttributes
};
export type MediaApi = {
  categoryType: string[] | []
  Author: string
  id: number;
  createdAt: string
  thumbnailUrl?: string;
  title: string;
  description: string;
  referenceURL: string;
  videoType: "video" | "url" | "embededCode"
  objectURL: string;
  fileName: string;
  bearing: string;
  actionType: string;
  featuredImage: boolean;
  updatedAt: Date;
  keywords: string[] | null;
  citation: string;
  latitude: number;
  longitude: number;
  imageMetadata: {
    fileSize: Number;
  };
  formats : {
    thumbnail?: any
    small?: any
    large?: any
  }
  uniqueId: string;
  object: MediaAssociates2_MediaObject;
  media_unique_id: {
    id: number
  };
  media_associate: {
    visit_unique_ids: InventoryAssociationType_Event[],
    place_unique_ids: InventoryAssociationType[],
    data: {
    attributes: PlaceUnique;
  }
  }
  media_type: typeCodeArrObj[]
  mediaUIPath: string | null
};

export type MediaApi2 = {
  id: string;
  thumbnailUrl?: string;
  title: string;
  description: string;
  createdAt: string
  referenceURL: string;
  objectURL: string;
  fileName: string;
  bearing: string;
  actionType: string;
  featuredImage: boolean;
  updatedAt: Date;
  keywords: string[] | null;
  citation: string;
  latitude: number;
  longitude: number;
  imageMetadata: {
    fileSize: Number;
  };
  uniqueId: string;
  object: {
    url: string;
    name: string
    size: number
    createdAt: string
    updatedAt: string
    ext: string
  };
  media_associate: {
    visit_unique_ids: InventoryAssociationType_Event[],
    place_unique_ids: InventoryAssociationType[],
    data: {
    attributes: PlaceUnique;
  }
  }
  media_type: typeCodeArrObj[]

};

export type typeCodeArrObj = {
  categoryCode: string
  createdAt: string
  id: number
  typeCode: string
  updatedAt: string
} 
