import { dropDownItem } from "./DropdownComponent";
import { VisitAssociate } from "./Event";
import { Media, MediaApi } from "./Media";

export type PlaceApi = {
  id: string;
  latitude: number;
  longitude: number;
  thumbnailUrl?: string;
  placeNameEnglish: string;
  placeNameArabic: string;
  siteDescription: string;
  previousNumber: string;
  siteType: string[];
  updatedAt: string;
  keywords: string[] | null;
  placeNumber: string | null;
  uniqueId: string;
  period: string[];
  researchValue: string[];
  tourismValue: string[];
  artifacts: string[];
  stateOfConservation: string[];
  recommendation: string[];
  risk: string[];
  placeUIPath: string;
  // media_associates: MediaAssociates;
  media_associates: MediaAssociates2;
  visit_associates: VisitAssociate[]
  libraryItems: Media[]
  mediaItems: MediaAssociateObj[]
};
export interface Place extends dropDownItem {
  id: string;
  latitude: number;
  longitude: number;
  attributes: PlaceApiResponse;
};

export type PlaceApiResponse2 = PlaceApiResponse & {
  media_associates: MediaAssociates2;
}

export type PlaceApiResponse = {
  thumbnailUrl?: string;
  placeNameEnglish: string;
  placeNameArabic: string;
  siteDescription: string;
  updatedAt: string;
  keywords: string[] | null;
  placeNumber: string;
  latitude: number;
  longitude: number;
  uniqueId: string;
  period: string[];
  researchValue: string[];
  tourismValue: string[];
  stateOfConservation: string[];
  recommendation: string[];
  risk: string[];
  media_associates: MediaAssociates;
  siteType: string[]
  placeUIPath: string
  media_type: any[]
  id: number

}

export type mediaAssociates_objectData = {
    attributes: {
      url: string;
    };
}

export type MediaAssociates = {
  data: {
    attributes: {
      media_unique_id: {
        data: {
          attributes: {
            media_type: any;
            videoType?: 'url' | 'embededCode' | 'video';
            objectURL?: string;
            referenceURL?: string;
            object: {
              data: mediaAssociates_objectData | null;
            };
            featuredImage: boolean
          };
        };
      };
    };
  }[];
};
export type MediaAssociates_GalleryView = {
  data: {
    attributes: {
      media_unique_id: {
        data: {
          attributes: {
            media_type: MediaTypeObject_GalleryView
            videoType: 'url' | 'embededCode' | 'video'
            objectURL: string
          };
        };
      };
    };
  }[];
};

export type mediaAssociate_PlaceOrEvent = {
  attributes: {
    media_unique_id: {
      data: {
        attributes: {
          media_type: any;
          videoType?: 'url' | 'embededCode' | 'video';
          objectURL?: string;
          referenceURL?: string;
          object: {
            data: mediaAssociates_objectData | null;
          };
          featuredImage: boolean
        };
      };
    };
  };
}

export type ImageFormat = {
  ext: string
  hash: string
  height: number
  mime: string
  name: string
  path: string | null
  size: number
  url: string
  width: number
}

export type MediaAssociates2_MediaObject_Format = {
  large: ImageFormat
  medium: ImageFormat
  small: ImageFormat
  thumbnail: ImageFormat
}

export type MediaAssociates2_MediaObject = {
  alternativeText: string
  caption: string
  createdAt: string
  ext: string
  folderPath: string
  formats: MediaAssociates2_MediaObject_Format
  hash: string
  height: number
  id: number
  mime: string
  name: string
  previewUrl: string | null
  provider: string
  provider_metadata: string | null
  size: number
  updatedAt: string
  url: string
  width: number
}

export type MediaTypeObject = {
    typeCode: "VIDEO" | "IMAGE" | "3DMODEL"
}
export type MediaTypeObject_GalleryView = {
  attributes : {
    typeCode: "VIDEO" | "IMAGE" | "3DMODEL"
  }
}
export type MediaType = Array<MediaTypeObject>

export type MediaAssociateObj = {
  object: any;
  videoType: "video" | "url" | "embededCode" | undefined;
  createdAt: string
  id: number
  media_unique_id: {
    actionType: string
    bearing: string | null
    by: string | null
    citation: string | null
    createdAt: string
    deleted: string | null
    description: string
    featuredImage: string | null
    fileName: string
    id: number
    keywords: string | null
    latitude: string | null
    longitude: string | null
    videoType: "embededCode" | "url" | "video"
    mediaUIPath: string | null
    object: MediaAssociates2_MediaObject
    objectURL: string | null
    photographedBy: string | null
    referenceURL?: string
    title: string
    uniqueId: string
    updatedAt: string
    media_type: {
      typeCode?: "VIDEO" | "IMAGE" | "3DMODEL"
      categoryCode?: string
    }[]
  }
}

export type MediaAssociates2 = Array<MediaAssociateObj>

export type Meta = {
  pagination: {
    total: number;
    pageCount: number;
    pageSize: number;
    page: number;
  };
};

export type Languages = {
  data: {
    attributes: {
      name: string;
    };
  };
};
export type Locale = {
  value: string;
  languages: Languages;
};
export type Translation = {
  data: {
    id: string;
    attributes: {
      code: string;
      locale: Locale[];
    };
  };
};
export type FieldOption = {
  id: string;
  attributes: {
    name: string;
    translation: Translation;
  };
};
export type FieldOptions = {
  data: FieldOption[] | [];
};

// export type dbIdTypes = 8 | 1 | 2 | 5 
export type dbIdTypes = 'place' | 'event' | 'library' | 'media' 

export type deleteRecordPayload = {
  visit_associates_id: Array<number> | [] 
  media_associates_id: Array<number> | []
  remark_headers_id: Array<number> | []
  visit: Array<number> | []
}

export type DirectGalleryViewSteps = "from-place-details" | "from-place-details-gallery" | "from-event-details"
