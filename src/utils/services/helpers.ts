import dayjs from "dayjs";
import styled from "styled-components";
import * as Yup from "yup";
import { ColumnType } from "antd/lib/table";
import { StyledAntTable } from "../../components/StyledAntTable";
import {
  MediaAssociateObj,
  MediaAssociates2,
  Place,
  PlaceApi,
} from "../../types/Place";
import {
  InventoryAssociationType,
  InventoryAssociationType_Event,
  tabNameProps,
} from "../../types/SearchResultsTabsProps";
import { Event, EventApi } from "../../types/Event";
import { Media, MediaApi, MediaApi2 } from "../../types/Media";
import { Options } from "../../types/RefinedSeachTypes";
import { getRole, getLimit } from "../storage/storage";

export const baseUrl = `${process.env.REACT_APP_STRAPI_BASE_URL}`;

export const baseUrlS3 = `${process.env.REACT_APP_STRAPI_S3_BASE_URL}`;

export const webUrl = `${process.env.REACT_APP_STRAPI_WEB_URL}`;

export const limit = Number(getLimit()) || 20;
export const MAX_FETCH_LIMIT = 10000;

export const itemAddEditAccess = getRole() === 'SuperEditor' ? true : getRole() === 'Editor' ? true : false;
export const itemDeleteAccess = getRole() === 'SuperEditor';
export const remarksDeleteAccess = getRole() === 'SuperEditor';
// export const remarkAddEditAccess = getRole() === 'SuperEditor' || getRole() === 'Editor' || getRole() === 'Admin'  ? true : getRole() === 'Consumer' ? true: false;
export const remarkAddEditAccess = true;

export const formatWebDate = (value: string) => {
  if (Date.parse(value)) {
    return dayjs(value).format("ddd, DD MMM, hh:mm A");
  }
  return "";
};
export const formatDate = (value: string) => {
  if (Date.parse(value)) {
    return dayjs(value).format("MM/DD/YY");
  }
  return "";
};
export const formatDateTime = (value: string) => {
  if (Date.parse(value)) {
    return dayjs(value).format("MM/DD/YY hh:mm:ss A");
  }
  return "";
};
export const formatDateTimeZone = (value: string) => {
  if (Date.parse(value)) {
    return dayjs(value).format("MM/DD/YYYY hh:mm:ss A EST");
  }
  return "";
};
export const formatTime = (value: string) => {
  if (Date.parse(value)) {
    return dayjs(value).format("hh:mm A");
  }
  return "";
};

export const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export const validateEmail = (s: string) => {
  const email_regex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return email_regex.test(s);
};
export const validateNumber = (s: string) => {
  const regex = new RegExp(/^[0-9]*\.?[0-9]*$/);
  return regex.test(s);
}

export const invalidChars = [
  "-",
  "+",
  "e",
];

export const validateNumberField = (e: React.KeyboardEvent<HTMLInputElement>) => {
  /** ignore typing in of these characters in number type input */
  const invalidChars = [
    "-",
    "+",
    "e",
  ];

  if (
    invalidChars.some(item => e.key === item)
  ) {
    e.preventDefault()
  } 

}

/**
 * Password must contain min 8 letter with at least a symbol, upper and lower case letters and a number
 * @param s
 * @returns
 */
export const validatePassword = (s: string) => {
  const password_regex =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return password_regex.test(s);
};

export function stringAvatar(name: string) {
  return `${name.split(" ")[0][0] ?? ''}${name.split(" ")[1][0] ?? ''}`;
}

export function passwordGenerator() {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const passwordLength = 12;
  let password = "";
  for (let i = 0; i <= passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
}

const unsecuredCopyToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Unable to copy to clipboard", err);
  }
  document.body.removeChild(textArea);
};

export async function copyToClipboard(str: string) {
  if (window.isSecureContext && navigator.clipboard) {
    await navigator.clipboard.writeText(str);
  } else {
    await unsecuredCopyToClipboard(str);
  }
}

export const staticValidationScheme = [
  {
    name: "8 characters",
    rule: /^.{8,}$/,
    fulfilled: false,
  },
  {
    name: "1 uppercase letter",
    rule: /^(?=.*?[A-Z]).{1,}$/,
    fulfilled: false,
  },
  {
    name: "1 special character",
    rule: /^(?=.*?[#?!@$%^&*-]).{1,}$/,
    fulfilled: false,
  },
];

export const antTablePaginationCss = `
  .ant-pagination {
    font-family: 'Roboto-Regular';
  }

  .ant-pagination-item {
    border-color: var(--light-grey-border);
  }

  .ant-pagination-item a {
    color: var(--focused-black-text);

  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background-color: transparent;
  }
`;

export const PLACES_TAB_NAME = "Places";
export const EVENTS_TAB_NAME = "Events";
export const LIBRARY_TAB_NAME = "Library";
export const MEDIA_TAB_NAME = "Media";

export const tabIndexBasedOnName = (tabName: tabNameProps) => {
  switch (tabName) {
    case PLACES_TAB_NAME:
      return 0;
    case EVENTS_TAB_NAME:
      return 1;
    case LIBRARY_TAB_NAME:
      return 2;
    case MEDIA_TAB_NAME:
      return 3;
  }
};

export const tabNameBasedOnIndex = (tabIndex: number) => {
  switch (tabIndex) {
    case 0:
      return PLACES_TAB_NAME;
    case 1:
      return EVENTS_TAB_NAME;
    case 2:
      return LIBRARY_TAB_NAME;
    case 3:
      return MEDIA_TAB_NAME;
    default:
      return PLACES_TAB_NAME;
  }
};

export const addItemDefaultSteps = ["Item Details", "Keywords"];

export const addItemLibrarySteps = ["Item Details", "Associations", "Keywords"];
export const addItemMediaSteps = [
  "Media",
  "Item Details",
  "Associations",
  "Keywords",
];

export const StyledTableWrapper = styled(StyledAntTable)`
  .ant-table-container {
  }
  .ant-table {
    margin-block: 2em;
  }

  .ant-table-thead > tr > th:not(.ant-table-thead > tr > th.more-menu-ant-cell),
  .ant-table-tbody
    > tr
    > td:not(.ant-table-tbody > tr > td.more-menu-ant-cell) {
    min-width: 50px;
  }

  th.ant-table-cell {
    white-space: break-spaces;
  }
  .ant-table-cell.more-menu-ant-cell {
    vertical-align: middle;
    min-width: 20px;
    width: 20px;
  }
  .more-menu-div {
    vertical-align: middle;
  }
  .ant-table-thead > tr > th.ant-table-cell-fix-right,
  .ant-table-cell-fix-right {
    background: var(--off-white-background-color);
  }

  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table
    > thead
    > tr
    > th.more-menu-ant-cell.ant-table-cell-fix-right {
    border-left: 1px solid #f0f0f0;
  }

  .ant-table-cell.cell-image {
    width: 15vw;
  }
  .media-table-image {
    object-fit: cover;
    width: 100%;
    aspect-ratio: 3/2;
  }
  .ant-table-cell {
    vertical-align: middle;
  }

  @media (min-width: 575px) and (max-width: 1025px) {
    .ant-table-thead
      > tr
      > th:not(.ant-table-thead > tr > th.more-menu-ant-cell),
    .ant-table-tbody
      > tr
      > td:not(.ant-table-tbody > tr > td.more-menu-ant-cell) {
      min-width: 90px;
    }

    .ant-table-thead > tr > th.more-menu-ant-cell.ant-table-cell-fix-right,
    .ant-table-tbody > tr > td.more-menu-ant-cell.ant-table-cell-fix-right {
      right: -5vw !important;
    }

    th.ant-table-cell,
    th.ant-table-cell * {
    }
    td.ant-table-cell {
    }

    .cell-image {
      min-width: 20ch !important;
    }

    .cell-description {
      min-width: 20ch !important;
    }
  }
  ${antTablePaginationCss}
`;

export const commonSelectSxStyles = {
  textAlign: "left",
  "& .MuiSelect-select": {
    padding: "0.5em 1em",
    color: "var(--grey-text)",
  },
};
export const textInputSxStyles = {
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    border: "none",
  },
  "& .MuiFormLabel-root.MuiInputLabel-root ": {},
  "& .MuiInputBase-input.MuiOutlinedInput-input ": {
    lineHeight: "1.2",
    border: "1.4px solid #fff",
    padding: "0.5em 1em",
    height: "1.4em",
  },
  "& .MuiOutlinedInput-notchedOutline span": {
    opacity: 1,
  },
  "& .MuiOutlinedInput-notchedOutline legend": {
    color: "transparent",
  },
};
export const commonFormControlSxStyles = {
  width: "100%",
  flexGrow: 0,
  "& .MuiInputBase-root": {
    backgroundColor: "#fff",
  },
};
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function zerofill(i: number) {
  return (i < 10 ? "0" : "") + i;
}
export function formatStrapiDate(date: Date) {
  const newDate = new Date(date);
  if (newDate) {
    return `${newDate?.getFullYear()}-${zerofill(
      newDate?.getMonth() + 1
    )}-${zerofill(newDate?.getDate())}`;
  }
  return null;
}

export const getQueryObj = (search: string) => {
  const searchParams = decodeURIComponent(search).replace("?", "");
  if (Boolean(searchParams)) {
    return JSON.parse(searchParams);
  }
  return null;
};

export const computeArrayFromDelimiter = (
  wholeString: string,
  delimiter: string
) => {
  return wholeString.split(delimiter);
};

export const shallRenderMedia = (
  mediaNo: number,
  mediaArray: MediaAssociates2
) => {
  if (!mediaArray) return false;

  if (mediaNo <= mediaArray.length) {
    return true;
  } else return false;
};

function randomString(len: number) {
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)]
    .reduce((a) => a + p[~~(Math.random() * p.length)], "")
    .toUpperCase();
}

export const generateUniqueId = () => {
  return `${randomString(8)}-${randomString(4)}-${randomString(
    4
  )}-${randomString(4)}-${randomString(12)}`;
};

export const AddPlaceFormSchema = Yup.object().shape({
  placeNumber: Yup.string().required(),
});

export const handleEnter = (
  e: React.KeyboardEvent<HTMLInputElement>,
  callback?: () => void
) => {
  if (e.key === "Enter") {
    e.preventDefault();

    if (callback) callback();
  }
};

type isEmptyType = (value: any) => boolean;

export const isEmptyValue: isEmptyType = (value: any) => {
  if (value === null || value === undefined) return true;

  if (typeof value === "string") return value === "";

  if (typeof value === "object" && Array.isArray(value) && value.length === 0)
    return true;

  if (typeof value === "object" && Array.isArray(value) && value.length === 1)
    return isEmptyValue(value[0]);

  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
    return isEmptyValue(value[0]);

  return false;
};

export const NO_TEXT = "No data available";
export const NO_MEDIA = "No media items to display";
export const NO_TABLE_ROWS = "No items to display";
export const NO_LOCATION = "No location available";
export const NO_DESCRIPTION = "No description available";
export const NO_IMAGE = "No image available";

export const checkIsNew = (updatedDate: string) => {
  const expDate = dayjs(updatedDate).add(30, "d").toDate();
  return dayjs().isBefore(expDate);
};

export const ATTACH_ICON_CLASSNAME = "attach-icon";
export const DETACH_ICON_CLASSNAME = "detached-icon";

export const shouldAddAtttachColumnHeader = (item: ColumnType<any>) => {
  return (
    !item.className || item.className?.indexOf(ATTACH_ICON_CLASSNAME) === -1
  );
};

export const isRecordAttached = (
  record: Place | Event,
  list: Array<InventoryAssociationType>,
  type: string = ""
) => {
  if (!list || !record) return false;

  return list.some((item) => {
    return item.id === parseInt(record.id);
  });
};
export const isEventRecordAttached = (
  record: Place | Event,
  list: Array<InventoryAssociationType_Event>,
  type: string = ""
) => {

  if (!list || list.length < 1 || !record) return false;

  return list.some((item) => {
    return parseInt(item.id) === parseInt(record.id);
  });
};
export const isEventDetailAttached = (
  record: EventApi,
  list: Array<InventoryAssociationType_Event>,
  type: string = ""
) => {
  if (!list || !record) return false;

  if (!record.id) return false;

  return list.some((item) => {
    return record.id && item.id === record.id.toString();
  });
};

export const isPlaceDetailAttached = (
  record: PlaceApi,
  list: Array<InventoryAssociationType>,
  type: string = ""
) => {
  if (!list || !record) return false;

  return list.some((item) => {
    return item.id === parseInt(record.id);
  });
};

export const detectLowerCaseStringInArray = (
  sourceString: string,
  destArr: string[]
) => {
  if (destArr.length === 0) return false;

  return destArr.some(
    (item) => item.toLowerCase() === sourceString.toLowerCase()
  );
};

export const detectMediaRecordApiType = (detailObj: MediaApi) => {
  return detailObj.media_type[0].typeCode === "VIDEO"
    ? MEDIA_TYPE_VIDEO
    : detailObj.media_type[0].typeCode === "IMAGE"
    ? MEDIA_TYPE_IMAGE
    : detailObj.media_type[0].typeCode === "3DMODEL"
    ? MEDIA_TYPE_3D
    : MEDIA_TYPE_IMAGE;
};
export const detectLibraryRecordApiType = (detailObj: MediaApi2) => {
  if (!detailObj.media_type) return MEDIA_TYPE_IMAGE;

  return detailObj.media_type[0].typeCode === "VIDEO"
    ? MEDIA_TYPE_VIDEO
    : detailObj.media_type[0].typeCode === "IMAGE"
    ? MEDIA_TYPE_IMAGE
    : MEDIA_TYPE_3D;
};

export const MEDIA_TYPE_IMAGE = "image";
export const MEDIA_TYPE_VIDEO = "video";
export const MEDIA_TYPE_3D = "3d";

export const detectMediaRecordType = (record: Media) => {
  return record.attributes.media_type.data[0].attributes.typeCode === "VIDEO"
    ? MEDIA_TYPE_VIDEO
    : record.attributes.media_type.data[0].attributes.typeCode === "IMAGE"
    ? MEDIA_TYPE_IMAGE
    : MEDIA_TYPE_3D;
};

export const isImagePathInvalid = (value: string | undefined) => {

  if(!value) return true
  return (
    value.toLowerCase().indexOf("undefined") !== -1 ||
    value.toLowerCase().indexOf("null") !== -1
  );
};

export const detectMediaTypeFromMediaAssociate = (obj: MediaAssociateObj) => {
  if (obj.media_unique_id.media_type[0].typeCode === "IMAGE") {
    return MEDIA_TYPE_IMAGE;
  } else if (obj.media_unique_id.media_type[0].typeCode === "VIDEO") {
    return MEDIA_TYPE_VIDEO;
  } else if (obj.media_unique_id.media_type[0].typeCode === "3DMODEL") {
    return MEDIA_TYPE_3D;
  } else return MEDIA_TYPE_IMAGE;
};

export const detectMediaTypeFromPlace = (obj: Place) => {
  if (obj.attributes?.media_associates?.data[0]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "IMAGE") {
    return MEDIA_TYPE_IMAGE;
  } else if (obj.attributes?.media_associates?.data[0]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "VIDEO") {
    return MEDIA_TYPE_VIDEO;
  } else if (obj.attributes?.media_associates?.data[0]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "3DMODEL") {
    return MEDIA_TYPE_3D;
  } else return MEDIA_TYPE_IMAGE;
};

export const detectMediaTypeFromEvent = (obj: Event) => {
  if (obj.attributes?.media_associates?.data[0]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "IMAGE") {
    return MEDIA_TYPE_IMAGE;
  } else if (obj.attributes?.media_associates?.data[0]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "VIDEO") {
    return MEDIA_TYPE_VIDEO;
  } else if (obj.attributes?.media_associates?.data[0]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "3DMODEL") {
    return MEDIA_TYPE_3D;
  } else return MEDIA_TYPE_IMAGE;
};

export const detectMediaTypeFromMediaDetailPage = (obj: MediaApi) => {
  if (obj.media_type[0].typeCode === "IMAGE") {
    return MEDIA_TYPE_IMAGE;
  } else if (obj.media_type[0].typeCode === "VIDEO") {
    return MEDIA_TYPE_VIDEO;
  } else if (obj.media_type[0].typeCode === "3DMODEL") {
    return MEDIA_TYPE_3D;
  } else return MEDIA_TYPE_IMAGE;
};

export const detectMediaTypeFromMediaAssociateGraphQlRes = (obj: any) => {
  if (
    obj.media_unique_id?.data?.attributes?.media_type?.data[0].attributes
      .typeCode === "IMAGE"
  ) {
    return MEDIA_TYPE_IMAGE;
  } else if (
    obj?.media_unique_id?.data?.attributes?.media_type?.data[0].attributes
      .typeCode === "VIDEO"
  ) {
    return MEDIA_TYPE_VIDEO;
  } else if (
    obj?.media_unique_id?.data?.attributes?.media_type?.data[0].attributes
      .typeCode === "3DMODEL"
  ) {
    return MEDIA_TYPE_3D;
  } else return MEDIA_TYPE_IMAGE;
};

export const detectMediaTypeFromMediaList = (obj: Media) => {
  // attributes.media_type.data[0].attributes.typeCode
  if (obj.attributes.media_type.data[0].attributes.typeCode === "IMAGE") {
    return MEDIA_TYPE_IMAGE;
  } else if (
    obj.attributes.media_type.data[0].attributes.typeCode === "VIDEO"
  ) {
    return MEDIA_TYPE_VIDEO;
  } else if (
    obj.attributes.media_type.data[0].attributes.typeCode === "3DMODEL"
  ) {
    return MEDIA_TYPE_3D;
  } else return MEDIA_TYPE_IMAGE;
};

export const toFixedFromString = (value: string | number, decimals: number) => {
  if (typeof value === "string") return parseFloat(value).toFixed(decimals);
  if (typeof value === "number") return value.toFixed(decimals);
  return "";
};

export const getSingleInventoryNameFromTabName = (value: tabNameProps | null) => {
  let newValue: string | null = value;

  if(!newValue) {
    newValue = ''
  } else if (newValue.charAt(newValue.length - 1).toLowerCase() === "s") {
    newValue = newValue.substring(0, newValue.length - 1);
  }

  return newValue;
};

export const isRecordHavingAssociations = (record: Media) => {

  if(!record) return false
  
  if(
    record?.attributes?.media_associate?.data?.attributes?.place_unique_ids &&
    record?.attributes?.media_associate?.data?.attributes?.place_unique_ids
      ?.data &&
    record?.attributes?.media_associate?.data?.attributes?.place_unique_ids
      ?.data?.length > 0
  ) {
    return true;
  } else if(
    record?.attributes?.media_associate?.data?.attributes?.visit_unique_ids &&
    record?.attributes?.media_associate?.data?.attributes?.visit_unique_ids
      ?.data &&
    record?.attributes?.media_associate?.data?.attributes?.visit_unique_ids
      ?.data?.length > 0
  ) {
    return true;
  } else return false;
};

export const checkSearchParameter = (searchText: string, selectedValues: Options) => {
  const copiedValue = JSON.parse(JSON.stringify(selectedValues));
    copiedValue?.length > 0 && Object.keys(copiedValue)?.map(x => {
      if (copiedValue && (copiedValue[x]?.length === 0 || copiedValue[x] === false)) {
        delete copiedValue[x];
      }
      return x;
    });
  if (Object.keys(copiedValue)?.length === 0 && searchText?.length === 0) {
    return false;
  } else { 
    return true
  }
}

export const ASSOCIATIONS_MANDATORY_ERR_MESSAGE = `*Please associate at least one Place or Event`

export const replaceWatchWithEmbed = (str: string) => str.replace('watch', 'embed')

export const get_youtube_thumbnail = (url: string, quality: "high" | 'low' | 'medium') => {
  if(url){
      var video_id, thumbnail, result;
      if(result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))
      {
          video_id = result.pop();
      }
      else if(result = url.match(/youtu.be\/(.{11})/))
      {
          video_id = result.pop();
      }

      if(video_id){
          if(typeof quality == "undefined"){
              quality = 'high';
          }
      
          var quality_key = 'maxresdefault'; // Max quality
          if(quality === 'low'){
              quality_key = 'sddefault';
          }else if(quality === 'medium'){
              quality_key = 'mqdefault';
          } else if (quality === 'high') {
              quality_key = 'hqdefault';
          }

          thumbnail = "http://img.youtube.com/vi/"+video_id+"/"+quality_key+".jpg";
          return thumbnail;
      }
  }
  return false;
}

export const convertKbtoMb = (num: number) => (num/1000).toFixed(5)

export const allowedVideoFormats = ['webm', 'mp4', 'ogg']

export const handleImageUrl = (url: string, size: string) => {
    let imagePath = url.split("/");
    return `${baseUrlS3}/${size}${imagePath[3]}`;
}