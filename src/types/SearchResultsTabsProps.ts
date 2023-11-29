import React, { ChangeEvent } from "react";
import { DashboardResponse } from "./dashboard";
import { Place, Meta, PlaceApi, MediaAssociateObj, MediaAssociates2_MediaObject, DirectGalleryViewSteps } from "./Place";
import { Event, EventApi } from "./Event";
import { Media } from "./Media";
import { RemarksPayload, Remark, ChildRemark, RemarkDetails, RemarksEditPayload } from "./Remarks";
import { DeleteRecordReduxPayload, DeleteUserReduxPayload } from "./User";

export type SearchResultTabsProps = {
  tabIndex?: number;
  handleSubmit?: () => void;
};

export type LabelProps = {
  img: string;
  label: string;
};

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  className: string;
}

export type tabNameProps = "Places" | "Events" | "Library" | "Media";

export type GridViewCard_Media = {
  itemIndex?: number;
  img?: string;
  title: string;
  subTitle: string;
  period?: string[] | null;
  onClick?: ((e: React.MouseEvent<Element, React.MouseEvent>) => void) &
    React.MouseEvent<Element, React.MouseEvent>;
    setEdit: (payload: Media) => void;
  record: Media
};
export type GridViewCard_Places = {
  itemIndex?: number;
  img?: string;
  title: string;
  subTitle: string;
  dateString: string;
  period?: string[] | null;
  onClick?: ((e: React.MouseEvent<Element, React.MouseEvent>) => void) &
    React.MouseEvent<Element, React.MouseEvent>;
  setEdit: (payload: {record: Place | PlaceApi | Media | Event, type: tabNameProps}) => void;
  record: Place
};
export type GridViewCard_Events = {
  // key?: number
  img?: string;
  title: string;
  subTitle: string;
  dateString: string;
  isNew: boolean;
  handleClick: (item: Event, index: number) => void
  setEdit: (payload: {record: Media | Event | MediaAssociateObj, type: tabNameProps}) => void
  record: Event;
  id: string;
};

export type InventoryAssociationType = {
  id: number
  placeNameEnglish: string
  placeNameArabic: string
  placeNumber: string | null
  keywords: string[] | []
  previousMediaPresent?: boolean
}
export type InventoryAssociationType_Event = {
  id: string
  visitNumber: string
  placeNameEnglish: string
  placeNameArabic: string
  placeNumber: string | null
  fieldNarrative?: string
  visit_associate?: {
    place_unique_id: {
      placeNameEnglish: string
      placeNameArabic: string
      placeNumber: string
    }
  }
  keywords: string[] | []
  previousMediaPresent?: boolean
}

export type ToggledStateTypes = {
  states: null | Array<boolean>,
  tabName: tabNameProps
}

export type SearchResultsState2 = {
  selectedCardIndex: number;
  searchApply: boolean;
  totalCounts: DashboardResponse | null;
  searchText: string;
  places: Place[] | [];
  events: Event[] | [];
  library: Media[] | [];
  media: Media[] | [];
  placeMetaData: Meta | null;
  eventMetaData: Meta | null;
  libararyMetaData: Meta | null;
  mediaMetaData: Meta | null;
  activeTab: tabNameProps | "";
  toggledStates: ToggledStateTypes;
  newItemWindowOpen: boolean;
  showAddSuccess: boolean;
  showEditSuccess: boolean;
  // activePlaceItem: Place | null;
  activePlaceItem: PlaceApi | null;
  activePlaceItemIndex: number;
  activeEventItem: EventApi | null;
  activeEventItemIndex: number;
  activeMediaItem: Media | null;
  activeMediaItemIndex: number;
  activeLibraryItem: Media | null;
  activeLibraryItemIndex: number;
  openGalleryView: {
    flag: DirectGalleryViewSteps | false,
    galleryViewIdList: string[] | []
    galleryViewItemList: MediaAssociateObj[] | []
  }
  addNewItemWindowType: tabNameProps | null
  successInventoryName: tabNameProps | null
  isAssociationsStepOpen: boolean
  associatedPlaces: InventoryAssociationType[] | []
  associatedEvents: InventoryAssociationType_Event[] | []
  addItemWindowMinimized: boolean | null
  addItemProgressState: null | addItemProgressPayload
  isAssociationsIconsDisabled: boolean,
  isEditConfirmationWindowOpen: boolean
  confirmOpenEdit: boolean,
  editPayload: any
  isDeleteConfirmationWindowOpen: DeleteRecordReduxPayload
  confirmDelete : boolean
  itemAboutToDelete: tabNameProps | null
  shallUpdateKeywords: boolean
  deleteItemType: null | tabNameProps
  deleteItemSuccess: boolean,
  isDeleteUserWindowOpen: DeleteUserReduxPayload
  deleteUserSuccess: boolean,
  deletePayload: DeletePayloadType,
  history: Array<string> | []
  isLogoutConfirmationWindowOpen: boolean
  isAssociationStepInvalid: boolean,
  isSelect:boolean,
  selectedKey:[],
  fetchLimit: number,
  allPlaces: Place[] | []
};

export type DeletePayloadType = {
  id: number
} | null

export type addItemProgressPayload = addItemProgressStateType | addPlaceProgressStateType | 
  addEventProgressStateType | addMediaProgressStateType

export type addItemProgressStateType = {
  activeStep :number,
  formData: {
    place: string
    eventDate?: Date
    recordingTeam?: string
    siteDescription?: string
    fieldNarrative?: string
    siteType?: string
    keywords: Array<string>,
  }
}
export type addPlaceProgressStateType = {
  activeStep :number
  formData: {
    placeNumber: string
    placeNameEnglish: string
    placeNameArabic: string
    siteDescription: string
    siteType: string[],
    period: string[],
    stateOfConservation: string
    risk: string
    tourismValue: string
    researchValue: string
    artifacts: string
    recommendation: string
    latitude: number | null,
    longitude: number | null,
    keywords: string[],
  }
}
export type addEventProgressStateType = {
  activeStep :number
  formData: {
    place: string,
    eventDate: Date | undefined,
    recordingTeam: string
    visitNumber: string | Number | null
    siteDescription: string
    fieldNarrative: string
    artifacts: string
    latitude: number | null,
    longitude: number | null,
    assessmentType: string
    stateOfConservation: string
    siteType: string | never[]
    risk: string
    tourismValue: string
    researchValue: string
    recommendation: string
    period: string[]
    keywords: string | never[]
  }
}
export type addMediaProgressStateType = {
  activeStep :number
  formData: {
    media_type: string
    title: string
    bearing: string
    description: string
    Author: string
    categoryType: string[]
    latitude: null,
    longitude: null,
    referenceURL: string
    keywords: string[]
  }
}

export type FileDataType = {
  src?: string;
  alt?: string;
  className: string;
  thumbNail?: string;
  thumbnailClassname?: string;
  isOpened?: boolean; // to directly render video or embedded code, instead of displaying play icon
  objectURL?: string
  iframeVideoLink?: string
  staticVideoLink?: string
  videoType?: "video" | "url" | "embededCode";
  noVideoStyles?: React.CSSProperties
  fileObject?: MediaAssociates2_MediaObject
};

export type RenderFileDataProps = {
  fileType: "image" | "video" | "3d";
  fileData: FileDataType;
};

export type CommentSectionProps = {
  id: string;
  type: "Place" | "Visit";
  SelfIcon: () => JSX.Element;
  addRemarks: (payload: RemarksPayload) => void;
  updateRemarks: (payload: RemarksEditPayload) => void;
  remarks?: Remark[]
};

export type commentType = {
  commentor: string;
  comment: string;
  timeStamp: string;
  nestedCommentsCount: number;
  nestedComments?: Array<commentType>;
  nestingLevel: number;
};
export type SingleCommentProps = {
  SelfIcon: () => JSX.Element;
  openReply?: (id: number) => void;
  setChildInput?: (e: string) => void;
  addRemarks: (id: number) => void;
  handleAction: (type: "edit" | "delete" | "support", remark: any, childType?: "child") => void;
  childInputs?: string;
  showInput?: number | null;
  commentObj?: commentType;
  remark: Remark | ChildRemark | RemarkDetails | any;
  type?: "child";
};

export type VideoModalProps = {
  videoSrc: string;
  isModalOpen: boolean;
  toggleModal: () => void;
};

export type MediaDetailsPageProps = {
  currentItemIndex: any;
  handleClose: () => any
};
export type LibraryDetailsPageProps = {
  currentItemIndex: any;
  data: any;
  currentRecord: any;
  handleClose: () => any
};

export type menuAction = {
  label: string;
  action: (data?: any) => void;
};

export type CustomMoreOptionsComponentProps = {
  menuActions: Array<menuAction>;
  moreIconClassName?: string
  data?: any
};

export type DetachedIconTypes ={
  className?: string
  style?: React.CSSProperties
  onClick: (e: React.MouseEvent<HTMLImageElement>) => void
  shouldShowAttachIcon?: boolean
}
