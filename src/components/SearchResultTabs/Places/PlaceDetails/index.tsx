import { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  InventoryAssociationType,
  tabNameProps,
} from "../../../../types/SearchResultsTabsProps";
import styles from "./index.module.css";
import gridStyles from "../GridView/index.module.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import RenderFileData from "../../../RenderFileData";
import { MediaAssociateObj, Place } from "../../../../types/Place";
import { StyledAntTable } from "../../../StyledAntTable";
import { ColumnsType } from "antd/lib/table";
import {
  antTablePaginationCss,
  baseUrl,
  baseUrlS3,
  copyToClipboard,
  formatBytes,
  formatWebDate,
  isEmptyValue,
  NO_DESCRIPTION,
  NO_MEDIA,
  NO_LOCATION,
  NO_TABLE_ROWS,
  NO_TEXT,
  shallRenderMedia,
  checkIsNew,
  isPlaceDetailAttached,
  detectMediaTypeFromMediaAssociate,
  itemAddEditAccess,
  webUrl,
} from "../../../../utils/services/helpers";
import { Tooltip } from "antd";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Media } from "../../../../types/Media";
import { Event } from "../../../../types/Event";
import styled from "styled-components";
import { format } from "date-fns";
import useMedia from "../../../../hooks/useMedia";
import CommentsSection from "../../../CommentsSection";
import RenderInitials from "../../../RenderInitials";
import { useDispatch } from "react-redux";
import {
  modifyAssociatedPlaces,
  setActiveEventItem,
  setActiveEventItemIndex,
  setActiveLibraryItem,
  setActiveLibraryItemIndex,
  setActiveMediaItem,
  setActiveMediaItemIndex,
  setActivePlaceItem,
  setActivePlaceItemIndex,
  setSearchApply,
  toggleGalleryView,
} from "../../../../store/reducers/searchResultsReducer";
import PositionedSnackbar from "../../../Snackbar";
import usePlaceDetails from "../../../../hooks/usePlaceDetails";
import Loader from "../../../Common/Loader";
import MapView from "../../GoogleMap/MapView";
import NoImagePresent from "../../../NoDataScreens/NoImagePresent";
import NoTextPresent from "../../../NoDataScreens/NoText";
import { isEmpty } from "lodash";
import NoMapPresent from "../../../NoDataScreens/NoMapPresent";
import DetachedIcon from "../../../Icons/DetachedIcon";
import MoreOption from "../ListView/MoreOption";
import useRemarks from "../../../../hooks/useRemarks";
import { useHistory } from "../../../../hooks/useHistory";

const StyledTableWrapper = styled(StyledAntTable)`
  .ant-table-container {
  }
  .ant-table {
    margin-block: 2em;
  }
  td
  {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }

  .ant-table-thead > tr > th:not(.ant-table-thead > tr > th.more-menu-ant-cell),
  .ant-table-tbody
    > tr
    > td:not(.ant-table-tbody > tr > td.more-menu-ant-cell) {
    min-width: 50px;
    max-width: 150px;
  }

  th.ant-table-cell {
    white-space: break-spaces;
  }
  .cell-citation {
    min-width: 18ch !important;
  }

  .ant-table-cell.more-menu-ant-cell {
    vertical-align: middle;
    min-width: 20px;
    width: 20px;
  }

  .ant-table-cell {
    vertical-align: middle;
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

  .events-table-more-menu > div:nth-child(1) {
    text-align: right;
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
    .cell-research {
      min-width: 16ch !important;
    }
    .cell-tourism {
      min-width: 14ch !important;
    }
    .cell-recommend {
      min-width: 20ch !important;
    }

    .cell-conserve {
      min-width: 15ch !important;
    }

    .cell-name {
      min-width: 25ch !important;
    }
  }
  ${antTablePaginationCss}
`;
const PlaceDetailsPage = () => {
  let { tabName, uniqueId } = useParams<{
    tabName?: tabNameProps;
    uniqueId: string;
  }>();
  const navigate = useNavigate();
  const [isFilter, setIsFilter] = useState(null);

  const { places, media, isAssociationsStepOpen, associatedPlaces } =
    useSelector((state: RootState) => state.searchResults);
  const { data } = useSelector((state: RootState) => state.login);

  let selectedPlaceObjIndex: number = 0;
  let selectedPlaceObj: Place = places[0];

  useEffect(() => {
    if (selectedPlaceObj) {
      dispatch(setActivePlaceItem(selectedPlaceObj));
      dispatch(setActivePlaceItemIndex(selectedPlaceObjIndex));
    }
  }, []);

  const handleImageUrl = (url: string, size: string) => {
    let imagePath = url.split("/");
    return `${baseUrlS3}/${size}${imagePath[3]}`;
  }

  places.forEach((placeItem: Place, inx: number) => {
    if (placeItem.attributes.uniqueId === uniqueId) {
      selectedPlaceObj = placeItem;
      selectedPlaceObjIndex = inx;
    }
  });

  const [isSeeMoreHidden, toggleSeeMoreHidden] = useState<boolean>(false);
  const [isCopyDone, setCopyDone] = useState<boolean>(false);
  // const { fetchLibraryItems, hasMoreData, loading } = useLibrary();

  const tableHeaderJson: ColumnsType<any> = [
    {
      title: "NAME",
      key: "attributes",
      dataIndex: "media_unique_id",
      sorter: (a, b) => {
        if (
          a?.media_unique_id?.fileName && b?.media_unique_id?.fileName
        ) {
          return a?.media_unique_id?.fileName?.localeCompare(b?.media_unique_id?.fileName)
        } else if (
          a?.media_unique_id?.object?.name && b?.media_unique_id?.object?.name
        ) {
          return a?.media_unique_id?.object?.name?.localeCompare(b?.media_unique_id?.object?.name)
        } else return true

      },
      defaultSortOrder: "ascend",
      className: "name-column",
      render: (value: any, record: any) => {
        return <Box
          component="div"
          sx={{
            display: "flex",
            gap: "1em",
          }}
        >
          <InsertDriveFileOutlinedIcon fontSize="small" />
          <Box component="div">{value?.title}</Box>
        </Box>
      },
    },
    {
      title: "DESCRIPTION",
      key: "attributes",
      className: "description-column",
      dataIndex: "media_unique_id", // temporary
      render: (value: any, index) => {
        return value?.description || "-";
      },
    },
    {
      title: "CITATION",
      className: "citation-column cell-citation",
      dataIndex: "media_unique_id", // temporary
      render: (value: any, index) => {
        return value.citation ? value?.citation : "";
      },
    },
    {
      title: "URL",
      key: "attributes",
      dataIndex: "media_unique_id", // temporary
      render: (value, index) => (
        <Box
          component={"a"}
          sx={{
            color: "initial",
            textDecoration: "underline",
          }}
        >
          <Tooltip>{value?.referenceURL || ""}</Tooltip>
        </Box>
      ),
    },
    {
      title: "SIZE",
      key: "attributes",
      dataIndex: "media_unique_id",
      render: (value, index) =>
        value.object?.size ? formatBytes(value.object.size) : "",
    },
    {
      title: "UPDATED",
      key: "media_unique_id",
      dataIndex: "media_unique_id",
      render: (value, index) => formatWebDate(value?.updatedAt),
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      className: "more-menu-ant-cell",
      render: (value: any, record: Media) => (
        // <MoreOptionsComponent id={record.id} record={record} setEdit={setEdit} />
        <>{itemAddEditAccess ? <MoreOption type="Library" setEdit={setEdit} record={record} /> : null}</>
      ),
    },
  ];

  const tableHeaderJson_events: ColumnsType<any> = [
    {
      title: "",
      key: "visit_unique_id",
      dataIndex: "visit_unique_id",
      className: "cell-image",
      render: (value: any, index: any) => {
        return (
          <>
            {value?.media_associates[0] &&
              value?.media_associates[0]?.media_unique_id?.media_type[0]
                .categoryCode === "MEDIA" ? (
              <RenderFileData
                fileData={{
                  alt: "",
                  src: value?.media_associates[0]?.media_unique_id?.object?.url
                    ? handleImageUrl(value.media_associates[0].media_unique_id.object.url, "thumbnail_")
                    : undefined,
                  className:
                    value?.media_associates[0]?.media_unique_id?.media_type[0]
                      .typeCode === "VIDEO"
                      ? `${gridStyles["video-card-parent"]}`
                      : value?.media_associates[0]?.media_unique_id
                        ?.media_type[0].typeCode === "IMAGE"
                        ? `${gridStyles["card-image"]}`
                        : `${gridStyles["three-d-card-parent"]}`,
                  objectURL:
                    value?.media_associates[0]?.media_unique_id?.objectURL ||
                    "",
                  videoType:
                    value?.media_associates[0]?.media_unique_id?.videoType,
                  iframeVideoLink:
                    value?.media_associates[0]?.media_unique_id?.videoType ===
                      "url"
                      ? value?.media_associates[0]?.media_unique_id
                        ?.referenceURL
                      : undefined,
                  staticVideoLink:
                    value?.media_associates[0]?.media_unique_id?.videoType ===
                      "video"
                      ? `${value?.media_associates[0]?.media_unique_id?.object?.url}`
                      : undefined,
                }}
                fileType={detectMediaTypeFromMediaAssociate(
                  value?.media_associates[0]
                )}
              />
            ) : (
              <NoImagePresent message="No media items to display" />
            )}
          </>
        );
      },
    },
    {
      title: "",
      key: "visit_unique_id",
      dataIndex: "visit_unique_id",
      className: "cell-new",
      render: (value: any, index: any) => (
        <>
          {checkIsNew(value?.visitDate) ? <div className={`${gridStyles["card-new-flag"]}`}>
            NEW!
          </div> : null}</>
      ),
    },
    {
      title: "Type",
      key: "visit_unique_id",
      dataIndex: "visit_unique_id",
      render: (value, index) => value?.asset_config_id.typeCode,
    },
    {
      title: "Date of Event",
      key: "visit_unique_id",
      dataIndex: "visit_unique_id",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        const first = (new Date(a?.visit_unique_id?.visitDate)).getTime()
        const second = (new Date(b?.visit_unique_id?.visitDate)).getTime()

        return first < second ? 0 : 1
      },
      render: (value, index) =>
        value?.visitDate
          ? format(
            new Date(
              // item.attributes.updatedAt
              value?.visitDate
            ),
            "MM-dd-yyyy"
          )
          : "-",
    },
    {
      title: "Participants",
      key: "visit_unique_id",
      dataIndex: "visit_unique_id",
      className: "cell-bearing",
      // render: (value: any, index: any) => "Adam Biernaski, Julian Jansen van Rensburg",
      render: (value: any, index: any) => value?.recordingTeam || "",
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      className: "more-menu-ant-cell events-table-more-menu",
      render: (value: any, record: Event) => (
        <>{itemAddEditAccess ? <MoreOption type="Events" setEdit={setEdit} record={record} /> : null}</>
      ),
    },
  ];
  const { navigateTo, goBack } = useHistory()

  const { loading } = useMedia();
  const {
    loading: placeLoading,
    error,
    data: placeData,
    setEdit,
  } = usePlaceDetails();
  const {
    loading: loadingRemarks,
    data: remarks,
    addRemarksMutation,
    updateRemarksMutation,
  } = useRemarks();

  const dispatch = useDispatch();


  useEffect(() => {
    if (placeData && placeData?.siteDescription?.length < 100) {
      toggleSeeMoreHidden(true);
    }

    if (placeData) {
      dispatch(setActivePlaceItem(placeData));
    }
  }, [placeData]);

  if (placeLoading) {
    return <Loader />;
  }

  if (!placeLoading && !placeData) {
    return <div>Cant fetch places</div>;
  }

  if (!placeData) {
    return null;
  }

  const handleClickMediaItem = (
    e: React.MouseEvent,
    itemIndex: number,
    uniqueId: string
  ) => {
    /** itemIndex used to track which item being clicked out of 5;
     * 1st , 2nd etc.
     */
    e.preventDefault();
    // if (placeData?.mediaItems.length >= itemIndex) {

    let newList: any = []

    placeData.mediaItems.forEach((item: MediaAssociateObj, index: number) => {
      newList.push({
        id: item.id.toString(),
        attributes: {
          ...item.media_unique_id
        }
      })
    })

    dispatch(toggleGalleryView({
      flag: "from-place-details",
      galleryViewItemList: newList
    }))

    navigateTo(`/Media/${uniqueId}`)

    dispatch(setActiveMediaItem(placeData.mediaItems[itemIndex - 1]));
    dispatch(setActiveMediaItemIndex(itemIndex - 1));
    // }
  };


  const handleSearch = (searchData: any) => {
    dispatch(setSearchApply(true));
    navigateTo({
      pathname: `/Places`,
      search: decodeURIComponent(
        JSON.stringify({
          refinedSearch: searchData,
        })
      )
    });

  };

  const {
    placeNameEnglish,
    placeNameArabic,
    placeNumber,
    siteDescription,
    previousNumber,
    siteType,
    period,
    stateOfConservation,
    artifacts,
    risk,
    tourismValue,
    researchValue,
    recommendation,
    placeUIPath,
    media_associates,
    mediaItems : unsortedMediaItems,
    libraryItems,
    visit_associates,
  } = placeData;

  const { latitude, longitude } = placeData;

  const mediaItems: MediaAssociateObj[]  = []

  /**detect first featured image */
  let flag = false

  unsortedMediaItems.forEach((item: MediaAssociateObj) => {

    /** if found featuredFlag, unshift / add element to start of array;
     * else do normal push
     */
    if(!flag && item.media_unique_id.featuredImage) {
      mediaItems.unshift(item)
      flag = true
    } else {
      mediaItems.push(item)
    }
  
  })

  return (
    <Box component="div" className={`${styles["details-container"]}`}>
      <Grid
        className={`${styles["image-grid-gap"]}`}
        container
        style={{
          flexDirection: "column",
        }}
      >
        <Grid
          item
          style={{
            width: "fit-content",
            float: "left",
          }}
        >
          <Button
            variant="text"
            type="button"
            className={`${styles["back-nav"]}`}
            startIcon={<KeyboardArrowLeftIcon fontSize="small" />}
            style={{
              color: "var(--table-black-text)",
              textTransform: "none",
            }}
            sx={{
              "& .MuiButton-startIcon": {
                marginRight: "4px",
              },
            }}
            onClick={(e) => {
              e.preventDefault();
              /** resetters */
              dispatch(setActivePlaceItem(null));
              dispatch(setActivePlaceItemIndex(0));
              dispatch(setActiveMediaItem(null));
              dispatch(setActiveMediaItemIndex(0));
              // navigate(-1);
              // navigate(`/${tabName}`, { replace: true });
              goBack()
            }}
          >
            Back to search results
          </Button>
        </Grid>
        <Box component="div" className={`${styles["content-section"]}`}>
          {
            // If you dont 1 image also, show placeholder section
            !mediaItems ||
              (media_associates && media_associates.length < 1) ? (
              <Box component="div" className={`${styles["no-images-section"]}`}>
                <NoImagePresent message={NO_MEDIA} />
              </Box>
            ) : (
              <Box component="div" className={`${styles["images-section"]}`}>
                <Box
                  component="div"
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                  }}
                >
                  {mediaItems && mediaItems.length >= 2 && (
                    <Button
                      variant="contained"
                      type="button"
                      style={{
                        color: "#fff",
                        backgroundColor: "var(--black-90-pct)",
                        borderRadius: "2em",
                        margin: "1em",
                        padding: "0.4em 1.2em",
                        boxShadow: 'rgb(255 255 255 / 62%) 0px 0px 5px 5px'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(toggleGalleryView({
                          flag: "from-place-details-gallery",
                          galleryViewItemList: mediaItems && mediaItems.length > 0 ?
                            mediaItems : []
                        }));
                      }}
                    >
                      View all
                    </Button>
                  )}
                </Box>
                <Grid
                  container
                  className={`${styles["justify-center"]} ${styles["image-grid-gap"]} ${styles["images-grid-container"]}`}
                >
                  <Grid
                    item
                      sm={6}
                      className={`${styles["grid-item"]} ${styles["main-grid-item"]}`}
                      onClick={(e) => {
                        handleClickMediaItem(
                          e,
                          1,
                          mediaItems[0]?.media_unique_id.uniqueId
                        );
                      }}
                    >
                    {shallRenderMedia(1, mediaItems) && (
                      <RenderFileData
                          fileData={{
                            alt: "",
                            src: mediaItems[0]?.media_unique_id?.object?.url ? (
                              detectMediaTypeFromMediaAssociate(mediaItems[0]) === "image" ?
                                handleImageUrl(mediaItems[0].media_unique_id?.object.url, "large_") :
                                `${mediaItems[0].media_unique_id?.object.url}`
                            ) : undefined,
                            className: `${styles['image']}  ${styles['main-image']}${
                              detectMediaTypeFromMediaAssociate(mediaItems[0]) === "3d" ? 
                                ` ${styles['three-d-card-parent']}` : ''
                            }`,
                            objectURL: mediaItems[0]?.media_unique_id?.objectURL || '',
                            videoType: mediaItems[0]?.videoType,
                            iframeVideoLink: (mediaItems[0]?.media_unique_id?.videoType === "url") ? mediaItems[0]?.media_unique_id?.referenceURL : undefined,
                            staticVideoLink: (
                              (detectMediaTypeFromMediaAssociate(mediaItems[0]) === "video" || mediaItems[0]?.media_unique_id?.videoType === "video") &&
                              mediaItems[0]?.media_unique_id?.object?.url
                            ) ? `${mediaItems[0]?.media_unique_id?.object?.url}` : undefined,
                            isOpened: false
                          }}
                        fileType={detectMediaTypeFromMediaAssociate(
                          mediaItems[0]
                        )}
                        />
                      )}
                    </Grid>
                    <Grid
                      item
                      sm={6}
                      className={`${styles["main-grid-item"]}`}
                    >
                      <Grid container
                        spacing={1}
                        className= {`${styles['row-1']} ${styles["side-grid-row"]}`}
                        sx={{
                          '& .MuiGrid-root': {
                            marginLeft: 0
                          }
                        }}
                      >
                        <Grid item
                          className={`${styles["grid-item"]}`}
                          sm={6}
                          sx={{
                            '& .MuiGrid-root': {
                              marginLeft: 0
                            }
                          }}
                          onClick={(e) => {
                            handleClickMediaItem(
                              e,
                              2,
                              mediaItems[1]?.media_unique_id.uniqueId
                            );
                          }}
                        >
                          {shallRenderMedia(2, mediaItems) && (
                            <RenderFileData
                              fileData={{
                                alt: "",
                                src: mediaItems[1]?.media_unique_id?.object?.url ? (
                                  detectMediaTypeFromMediaAssociate(mediaItems[1]) === "image" ?
                                    handleImageUrl(mediaItems[1].media_unique_id?.object.url, "medium_") :
                                    `${mediaItems[1].media_unique_id?.object.url}`
                                ) : undefined,
                                className: `${styles['image']} ${styles['side-grid-image']}${detectMediaTypeFromMediaAssociate(mediaItems[0]) === "3d" ?
                                  ` ${styles['three-d-card-parent']}` : ''
                                  }`,
                                objectURL: mediaItems[1]?.media_unique_id?.objectURL || '',
                                videoType: mediaItems[1]?.videoType,
                                iframeVideoLink: (mediaItems[1]?.media_unique_id?.videoType === "url") ? mediaItems[1]?.media_unique_id?.referenceURL : undefined,
                                staticVideoLink: (
                                  (detectMediaTypeFromMediaAssociate(mediaItems[1]) === "video" || mediaItems[1]?.media_unique_id?.videoType === "video") &&
                                  mediaItems[1]?.media_unique_id?.object?.url
                                ) ? `${mediaItems[1]?.media_unique_id?.object?.url}` : undefined,
                                isOpened: false
                              }}
                              fileType={detectMediaTypeFromMediaAssociate(
                                mediaItems[1]
                              )}
                            />
                          )}
                        </Grid>
                        <Grid item
                          sm={6}
                          className={`${styles["grid-item"]}`}
                          onClick={(e) => {
                            handleClickMediaItem(
                              e,
                              3,
                              mediaItems[2]?.media_unique_id.uniqueId
                            );
                          }}
                        >
                          {shallRenderMedia(3, mediaItems) && (
                            <RenderFileData
                              fileData={{
                                alt: "",
                                src: mediaItems[2]?.media_unique_id?.object?.url ? (
                                  detectMediaTypeFromMediaAssociate(mediaItems[2]) === "image" ?
                                    handleImageUrl(mediaItems[2].media_unique_id?.object.url, "small_") :
                                    `${mediaItems[2].media_unique_id?.object.url}`
                                ) : undefined,
                                className: `${styles['image']} ${styles['side-grid-image']}${detectMediaTypeFromMediaAssociate(mediaItems[0]) === "3d" ?
                                  ` ${styles['three-d-card-parent']}` : ''
                                  }`,
                                objectURL: mediaItems[2]?.media_unique_id?.objectURL || '',
                                videoType: mediaItems[2]?.videoType,
                                iframeVideoLink: (mediaItems[2]?.media_unique_id?.videoType === "url") ? mediaItems[2]?.media_unique_id?.referenceURL : undefined,
                                staticVideoLink: (
                                  (detectMediaTypeFromMediaAssociate(mediaItems[2]) === "video" || mediaItems[2]?.media_unique_id?.videoType === "video") &&
                                  mediaItems[2]?.media_unique_id?.object?.url
                                ) ? `${mediaItems[2]?.media_unique_id?.object?.url}` : undefined,
                                isOpened: false
                              }}
                              fileType={detectMediaTypeFromMediaAssociate(
                                mediaItems[2]
                              )}
                            />
                          )}
                        </Grid>

                      </Grid>
                      <Grid container
                      className={`${styles["side-grid-row"]}`}
                        spacing={1}
                        sx={{
                          '& .MuiGrid-root': {
                            marginLeft: 0
                          }
                        }}
                      >
                        <Grid item
                          className={`${styles["grid-item"]}`}
                          sx={{
                            '& .MuiGrid-root': {
                              paddingLeft: 0
                            }
                          }}
                          sm={6}
                          onClick={(e) => {
                            handleClickMediaItem(
                              e,
                              4,
                              mediaItems[3]?.media_unique_id.uniqueId
                            );
                          }}
                        >
                          {shallRenderMedia(4, mediaItems) && (
                            <RenderFileData
                              fileData={{
                                alt: "",
                                src: mediaItems[3]?.media_unique_id?.object?.url ? (
                                  detectMediaTypeFromMediaAssociate(mediaItems[3]) === "image" ?
                                    handleImageUrl(mediaItems[3].media_unique_id?.object.url, "small_") :
                                    `${mediaItems[3].media_unique_id?.object.url}`
                                ) : undefined,
                                className: `${styles['image']} ${styles['side-grid-image']}${detectMediaTypeFromMediaAssociate(mediaItems[0]) === "3d" ?
                                  ` ${styles['three-d-card-parent']}` : ''
                                  }`,
                                objectURL: mediaItems[3]?.media_unique_id?.objectURL || '',
                                videoType: mediaItems[3]?.videoType,
                                iframeVideoLink: (mediaItems[3]?.media_unique_id?.videoType === "url") ? mediaItems[3]?.media_unique_id?.referenceURL : undefined,
                                staticVideoLink: (
                                  (detectMediaTypeFromMediaAssociate(mediaItems[3]) === "video" || mediaItems[3]?.media_unique_id?.videoType === "video") &&
                                  mediaItems[3]?.media_unique_id?.object?.url
                                ) ? `${mediaItems[3]?.media_unique_id?.object?.url}` : undefined,
                                isOpened: false
                              }}
                              fileType={detectMediaTypeFromMediaAssociate(
                                mediaItems[3]
                              )}
                            />
                          )}
                        </Grid>
                        <Grid item
                        className={`${styles["grid-item"]}`}
                          sm={6}
                          onClick={(e) => {
                            handleClickMediaItem(
                              e,
                              5,
                              mediaItems[4]?.media_unique_id.uniqueId
                            );
                          }}
                        >
                          {shallRenderMedia(5, mediaItems) && (
                            <RenderFileData
                              fileData={{
                                alt: "",
                                src: mediaItems[4]?.media_unique_id?.object?.url ? (
                                  detectMediaTypeFromMediaAssociate(mediaItems[4]) === "image" ?
                                    handleImageUrl(mediaItems[4].media_unique_id?.object.url, "small_") :
                                    `${mediaItems[4].media_unique_id?.object.url}`
                                ) : undefined,
                                className: `${styles['image']} ${styles['side-grid-image']}${detectMediaTypeFromMediaAssociate(mediaItems[0]) === "3d" ?
                                  ` ${styles['three-d-card-parent']}` : ''
                                  }`,
                                objectURL: mediaItems[4]?.media_unique_id?.objectURL || '',
                                videoType: mediaItems[4]?.videoType,
                                iframeVideoLink: (mediaItems[4]?.media_unique_id?.videoType === "url") ? mediaItems[4]?.media_unique_id?.referenceURL : undefined,
                                staticVideoLink: (
                                  (detectMediaTypeFromMediaAssociate(mediaItems[4]) === "video" || mediaItems[4]?.media_unique_id?.videoType === "video") &&
                                  mediaItems[4]?.media_unique_id?.object?.url
                                ) ? `${mediaItems[4]?.media_unique_id?.object?.url}` : undefined,
                                isOpened: false
                              }}
                              fileType={detectMediaTypeFromMediaAssociate(
                                mediaItems[4]
                              )}
                            />
                          )}
                        </Grid>

                      </Grid>
                    </Grid>
                  {/* <Grid
                    item
                    sm={6}
                    className={`${styles["image-grid-gap"]} ${styles["image-side-grid"]}`}
                  >
                    <Grid
                      container
                      className={`${styles["image-grid-gap"]} ${styles["row-1"]}`}
                      spacing={1}
                    >
                      <Grid
                        item
                        sm={6}
                        className={`${styles["side-grid-image"]} ${styles["grid-item"]}`}
                        onClick={(e) => {
                          handleClickMediaItem(
                            e,
                            2,
                            mediaItems[1]?.media_unique_id.uniqueId
                          );
                        }}
                      >
                        {shallRenderMedia(2, mediaItems) && (
                          <RenderFileData
                            fileData={{
                              alt: "",
                              src: `${baseUrl}${mediaItems[1].media_unique_id?.object?.url}`,
                              className: `${styles["single-image"]} ${styles["right-image"]}`,
                              videoType:
                              mediaItems[1].media_unique_id.videoType,
                              iframeVideoLink:
                              mediaItems[1].media_unique_id
                                  .videoType === "url"
                                  ? mediaItems[1].media_unique_id
                                      .referenceURL
                                  : undefined,
                              staticVideoLink:
                                detectMediaTypeFromMediaAssociate(
                                  mediaItems[0]
                                ) === "video" &&
                                mediaItems[1].media_unique_id
                                  .videoType === "video"
                                  ? `${baseUrl}${mediaItems[1].media_unique_id.object?.url}`
                                  : undefined,
                            }}
                            fileType={detectMediaTypeFromMediaAssociate(
                              mediaItems[1]
                            )}
                          />
                        )}

                      </Grid>
                      <Grid
                        item
                        sm={6}
                        className={`${styles["side-grid-image"]} ${styles["grid-item"]}`}
                        onClick={(e) => {
                          handleClickMediaItem(
                            e,
                            3,
                            mediaItems[2]?.media_unique_id.uniqueId
                          );
                        }}
                      >
                        {shallRenderMedia(3, mediaItems) && (
                          <RenderFileData
                            fileData={{
                              alt: "",
                              src: `${baseUrl}${mediaItems[2].media_unique_id?.object?.url}`,
                              className: `${styles["single-image"]} ${styles["right-image"]}`,
                              videoType:
                              mediaItems[2].media_unique_id.videoType,
                              iframeVideoLink:
                              mediaItems[2].media_unique_id
                                  .videoType === "url"
                                  ? mediaItems[2].media_unique_id
                                      .referenceURL
                                  : undefined,
                              staticVideoLink:
                                detectMediaTypeFromMediaAssociate(
                                  mediaItems[2]
                                ) === "video" &&
                                mediaItems[2].media_unique_id
                                  .videoType === "video"
                                  ? `${baseUrl}${mediaItems[2].media_unique_id.object?.url}`
                                  : undefined,
                            }}
                            fileType={detectMediaTypeFromMediaAssociate(
                              mediaItems[2]
                            )}
                          />
                        )}
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      className={`${styles["image-grid-gap"]}`}
                      spacing={1}
                    >
                      <Grid
                        item
                        sm={6}
                        className={`${styles["side-grid-image"]} ${styles["grid-item"]}`}
                        onClick={(e) => {
                          handleClickMediaItem(
                            e,
                            4,
                            mediaItems[3]?.media_unique_id.uniqueId
                          );
                        }}
                      >
                        {shallRenderMedia(4, mediaItems) && (
                          <RenderFileData
                            fileData={{
                              alt: "",
                              src: `${baseUrl}${mediaItems[3].media_unique_id?.object?.url}`,
                              className: `${styles["single-image"]} ${styles["right-image"]}`,
                              objectURL:
                              mediaItems[3].media_unique_id.objectURL ||
                                "",

                              videoType:
                              mediaItems[3].media_unique_id.videoType,
                              iframeVideoLink:
                              mediaItems[3].media_unique_id
                                  .videoType === "url"
                                  ? mediaItems[3].media_unique_id
                                      .referenceURL
                                  : undefined,
                              staticVideoLink:
                                detectMediaTypeFromMediaAssociate(
                                  mediaItems[3]
                                ) === "video" &&
                                mediaItems[3].media_unique_id
                                  .videoType === "video"
                                  ? `${baseUrl}${mediaItems[3].media_unique_id.object?.url}`
                                  : undefined,
                            }}
                            fileType={detectMediaTypeFromMediaAssociate(
                              mediaItems[3]
                            )}
                          />
                        )}

                      </Grid>
                      <Grid
                        item
                        sm={6}
                        className={`${styles["side-grid-image"]} ${styles["grid-item"]}`}
                        onClick={(e) => {
                          handleClickMediaItem(
                            e,
                            5,
                            mediaItems[4]?.media_unique_id.uniqueId
                          );
                        }}
                      >
                        {shallRenderMedia(5, mediaItems) && (
                          <RenderFileData
                            fileData={{
                              alt: "",
                              src: `${baseUrl}${mediaItems[4].media_unique_id?.object?.url}`,
                              className: `${styles["single-image"]} ${styles["right-image"]}`,
                              objectURL:
                              mediaItems[4].media_unique_id.objectURL ||
                                "",
                              videoType:
                              mediaItems[4].media_unique_id.videoType,
                              iframeVideoLink:
                              mediaItems[4].media_unique_id
                                  .videoType === "url"
                                  ? mediaItems[4].media_unique_id
                                      .referenceURL
                                  : undefined,
                              staticVideoLink:
                                detectMediaTypeFromMediaAssociate(
                                  mediaItems[4]
                                ) === "video" &&
                                mediaItems[4].media_unique_id
                                  .videoType === "video"
                                  ? `${baseUrl}${mediaItems[4].media_unique_id.object?.url}`
                                  : undefined,
                            }}
                            fileType={detectMediaTypeFromMediaAssociate(
                              mediaItems[4]
                            )}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid> */}
                </Grid>
              </Box>
            )
          }
          <Box component="div" className={`${styles["title-section"]}`}>
            <Grid container className={`${styles["title-section-grid"]}`}>
              <Grid
                item
                sm={11}
                className={`${styles["title-section-left-item"]}`}
              >
                {/* to-do:  Make these true && dependent on incoming API variable.
                                If it exists, render the jsx */}
                <Grid container>
                  {placeNameEnglish && (
                    <Grid item>
                      <Box component="div" className={`${styles["item-name"]}`}>
                        {placeNameEnglish}
                      </Box>
                    </Grid>
                  )}
                  {!placeNameEnglish && !placeNameArabic && (
                    <Grid item>
                      <Box component="div" className={`${styles["item-name"]}`}>
                        {placeNumber}
                      </Box>
                    </Grid>
                  )}
                  {placeNameArabic && (
                    <Grid item>
                      <Box
                        component="div"
                        className={`${styles["item-name-arabic"]}`}
                      >
                        {placeNameArabic}
                      </Box>
                    </Grid>
                  )}
                </Grid>
                {(placeNameEnglish || placeNameArabic) &&
                  <Box component="div" className={`${styles["item-number"]}`}
                    style={{
                      fontWeight: 'bold',
                      lineHeight: 1.5,
                      fontSize: 'large'
                    }}
                  >
                    {placeNumber}
                  </Box>}
                <Box component="div" className={`${styles["item-number"]}`}
                  style={{
                    lineHeight: 1.5,
                    fontSize: 'medium'
                  }}
                >
                  ID {placeData.id}
                </Box>
              </Grid>
              <Grid item sm={1}>
                <Box component="div" className={`${styles["more-icon-box"]}`}>
                  {isAssociationsStepOpen ? (
                    <DetachedIcon
                      style={
                        {
                          // height: '18px',
                          // position: 'relative',
                          // top: '3px',
                        }
                      }
                      shouldShowAttachIcon={isPlaceDetailAttached(
                        placeData,
                        associatedPlaces
                      )}
                      onClick={(e) => {

                        if (isPlaceDetailAttached(placeData, associatedPlaces)) return

                        const data: InventoryAssociationType = {
                          id: Number(placeData.id),
                          placeNameEnglish: placeData.placeNameEnglish,
                          placeNameArabic: placeData.placeNameArabic,
                          placeNumber: placeData.placeNumber,
                          keywords: placeData.keywords ? [...placeData.keywords] : [],
                          previousMediaPresent: placeData.media_associates && (placeData.media_associates?.length > 0)
                        };

                        dispatch(
                          modifyAssociatedPlaces({
                            newItem: data,
                            removeId: null,
                          })
                        );
                      }}
                    />
                  ) : (
                    // <></>:
                    <>{itemAddEditAccess ? <MoreOption
                      type="Places"
                      setEdit={setEdit}
                      record={placeData}
                    /> : null}</>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box component="div" className={`${styles["details-section"]}`}>
            <Grid
              container
              className={`${styles["details-section-main-grid"]}`}
              rowSpacing={2}
            >
              <Grid
                item
                sm={7}
                className={`${styles["text-left"]} ${styles["section-left"]}`}
              >
                {
                  <Box component="div" className={`${styles["site-desc"]}`}>
                    {siteDescription ? (
                      <>
                        <Box
                          component="div"
                          className={`${styles["site-desc-condensed"]} ${isSeeMoreHidden ? styles["see-more-active"] : ""
                            }`}
                        >
                          {siteDescription.substring(
                            0,
                            !isSeeMoreHidden ? 500 : siteDescription.length
                          )}
                        </Box>
                        {!isSeeMoreHidden && (
                          <Box
                            component="div"
                            className={`${styles["see-more-box"]}`}
                            onClick={(e) => {
                              toggleSeeMoreHidden((state) => !state);
                            }}
                          >
                            {!isSeeMoreHidden ? "...See More" : ""}
                          </Box>
                        )}
                      </>
                    ) : (
                      <NoTextPresent message={NO_DESCRIPTION} />
                    )}
                  </Box>
                }
                <Box component="div" className={`${styles["table"]}`}>
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={5}
                      md={4}
                      className={`${styles["table-parameter"]} `}
                    >
                      Site Type
                    </Grid>
                    <Grid item
                      sm={7}
                      md={8}
                    >
                      <Box
                        component={"div"}
                        className={`${styles["text-anchors-parent"]}`}
                      >
                        {!isEmpty(siteType) ? (
                          siteType.map((item: string, index: number) => (
                            <Box
                              key={index}
                              component="div"
                              className={`${styles["text-anchor"]}`}
                              onClick={() => handleSearch({ siteType: [item] })}
                            >
                              {item}
                            </Box>
                          ))
                        ) : (
                          <NoTextPresent message={NO_TEXT} />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={5}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Artifacts
                    </Grid>
                    {!isEmptyValue(artifacts) ? (
                      artifacts.map((item: string, index: number) => (
                        <Grid
                          item
                          key={index}
                          onClick={() =>
                            handleSearch({ artifacts: [item] })
                          }
                        >
                          {item}
                        </Grid>
                      ))
                    ) : (
                      <Grid item>
                        <NoTextPresent message={NO_TEXT} />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={5}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Period
                    </Grid>
                    <Grid item
                      sm={7}
                      md={8}
                    >
                      {/* 
                                            to-do::
                                            Site type and period will act as a link to a quick search. For example if 
                                            the Site Type says  “Building”, when the user clicks on it, the user will 
                                            be redirected to the search results page where they will see the list of 
                                            all places where the site type = building. */}
                      <Box
                        component={"div"}
                        className={`${styles["text-anchors-parent"]}`}
                      >
                        {!isEmpty(period) ? (
                          period.map((item, index) => (
                            <Box
                              key={index}
                              component="div"
                              className={`${styles["text-anchor"]}`}
                              onClick={() => handleSearch({ period: [item] })}
                            >
                              {item}
                            </Box>
                          ))
                        ) : (
                          <NoTextPresent message={NO_TEXT} />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  {
                    previousNumber &&
                    <Grid container className={`${styles["table-row"]}`}>
                      <Grid
                        item
                        sm={5}
                        md={4}
                        className={`${styles["table-parameter"]} `}
                      >
                        Previous Number
                      </Grid>
                      <Grid item>
                        <Box
                          component={"div"}
                          className={`${styles["text-anchors-parent"]}`}
                        >
                          {!isEmpty(previousNumber) ? (
                            `${previousNumber}`
                          ) : (
                            <NoTextPresent message={NO_TEXT} />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  }
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={5}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      State of Conservation
                    </Grid>
                    {!isEmptyValue(stateOfConservation) ? (
                      stateOfConservation.map((item: string, index: number) => (
                        <Grid
                          item
                          key={index}
                          onClick={() =>
                            handleSearch({ stateOfConservation: [item] })
                          }
                        >
                          {item}
                        </Grid>
                      ))
                    ) : (
                      <Grid item>
                        <NoTextPresent message={NO_TEXT} />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={5}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Risk
                    </Grid>
                    {!isEmptyValue(risk) ? (
                      risk.map((item: string, index: number) => (
                        <Grid
                          item
                          key={index}
                          onClick={() => handleSearch({ risk: [item] })}
                        >
                          {item}
                        </Grid>
                      ))
                    ) : (
                      <Grid item>
                        <NoTextPresent message={NO_TEXT} />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={5}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Tourism Value
                    </Grid>
                    {!isEmptyValue(tourismValue) ? (
                      tourismValue.map((item: string, index: number) => (
                        <Grid
                          item
                          key={index}
                          onClick={() => handleSearch({ tourismValue: [item] })}
                        >
                          {item}
                        </Grid>
                      ))
                    ) : (
                      <Grid item>
                        <NoTextPresent message={NO_TEXT} />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={5}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Research Value
                    </Grid>
                    {!isEmptyValue(researchValue) ? (
                      researchValue.map((item: string, index: number) => (
                        <Grid
                          item
                          key={index}
                          onClick={() =>
                            handleSearch({ researchValue: [item] })
                          }
                        >
                          {item}
                        </Grid>
                      ))
                    ) : (
                      <Grid item>
                        <NoTextPresent message={NO_TEXT} />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={5}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Recommendation
                    </Grid>
                    {!isEmptyValue(recommendation) ? (
                      recommendation.map((item: string, index: number) => (
                        <Grid
                          item
                          key={index}
                          onClick={() => handleSearch({ tourismValue: [item] })}
                        >
                          {item}
                        </Grid>
                      ))
                    ) : (
                      <Grid item>
                        <NoTextPresent message={NO_TEXT} />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={5}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      URL
                    </Grid>
                    <Grid item sm={7} md={8}>
                      <Box
                        component="div"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          setCopyDone(true);
                          copyToClipboard(`${webUrl}/${placeUIPath}` ?? "");
                        }}
                      >
                        {`${webUrl}/${placeUIPath}`}
                      </Box>
                      <PositionedSnackbar
                        message={"Copied to clipboard"}
                        severity={"success"}
                        open={isCopyDone}
                        handleClose={() => setCopyDone(false)}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item sm={5}>
                {latitude && longitude ? (
                  <>
                    <Box component="div" style={{
                      height: '94%'
                    }}>
                      <MapView
                        filterId={setIsFilter}
                        key={4}
                        marker={[
                          {
                            id: 0,
                            uniqueId: placeData.uniqueId,
                            name: `${placeNameEnglish}`,
                            position: {
                              lat: latitude,
                              lng: longitude,
                            },
                          },
                        ]}
                        zoom={10}
                      />
                    </Box>
                    <Grid
                      container
                      className={`${styles["map-loctn-details"]}`}
                    >
                      <Grid item lg={4} md={5} sm={5}>
                        <Grid
                          container
                          className={`${styles["map-loctn-line"]}`}
                        >
                          <Grid item style={{ fontWeight: "bold" }}>
                            Latitude
                          </Grid>
                          <Grid item>{`${latitude}`}</Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={5} md={5} sm={6}>
                        <Grid
                          container
                          className={`${styles["map-loctn-line"]}`}
                        >
                          <Grid item style={{ fontWeight: "bold" }}>
                            Longitude
                          </Grid>
                          <Grid item>{`${longitude}`}</Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <NoMapPresent message={NO_LOCATION} />
                )}
              </Grid>
            </Grid>
          </Box>
          <Box
            component="div"
            className={`${styles["heading"]} ${styles["text-left"]}`}
          >
            <Box component="div" className={`${styles["heading-title"]}`}>
              <Box component="div">Library</Box>
              {!isEmpty(libraryItems) && (
                <Box component="div">{libraryItems.length} Items</Box>
              )}
            </Box>
            <Box component="div" className={`${styles["table-wrapper"]}`}>
              {!isEmpty(libraryItems) ? (
                <StyledTableWrapper
                  className={`${styles["table-container"]}`}
                  rowKey={"id"}
                  size="small"
                  columns={tableHeaderJson}
                  dataSource={libraryItems ? libraryItems : []}
                  pagination={false}
                  loading={false}
                  bordered
                  scroll={{ x: 'max-content', y: 300 }}
                  style={{
                    background: "transparent",
                  }}
                  onRow={(record: any, rowIndex: number | undefined) => {
                    return {
                      onClick: (library) => {
                        if (typeof rowIndex === "number") {
                          dispatch(setActiveLibraryItem(record));
                          dispatch(setActiveLibraryItemIndex(rowIndex));
                          navigateTo(`/Library/${record.media_unique_id.uniqueId}`)
                        }
                      },
                    };
                  }}
                ></StyledTableWrapper>
              ) : (
                <NoTextPresent message={NO_TABLE_ROWS} />
              )}
            </Box>
          </Box>
          {/* Currently showing only 1 events oit of available list */}
          <Box
            component="div"
            className={`${styles["events-section"]} ${styles["heading"]} ${styles["text-left"]}`}
          >
            <Box component="div" className={`${styles["heading-title"]}`}>
              <Box component="div">Events</Box>
              {!isEmpty(visit_associates) && (
                <Box component="div">{visit_associates.length} Items</Box>
              )}
            </Box>
            <Box component="div" className={`${styles["table-wrapper"]}`}>
              {!isEmpty(visit_associates) ? (
                <StyledTableWrapper
                  rowKey={"id"}
                  size="small"
                  columns={tableHeaderJson_events}
                  // dataSource={events.slice(0,1)}
                  dataSource={visit_associates}
                  pagination={false}
                  loading={loading ? loading : false}
                  bordered
                  scroll={{ y: 500, scrollToFirstRowOnChange: true }}
                  style={{
                    background: "transparent",
                  }}
                  onRow={(record: any, rowIndex: number | undefined) => {
                    return {
                      onClick: (event) => {
                        if (typeof rowIndex === "number") {
                          dispatch(setActiveEventItem(record));
                          dispatch(setActiveEventItemIndex(rowIndex));
                          // navigate(
                          //   `/Events/${record.visit_unique_id.uniqueId}`,
                          //   { replace: true }
                          // );
                          navigateTo(`/Events/${record.visit_unique_id.uniqueId}`)
                        }
                      },
                    };
                  }}
                ></StyledTableWrapper>
              ) : (
                <NoTextPresent message={NO_TABLE_ROWS} />
              )}
            </Box>
          </Box>
          <Box
            component="div"
            className={`${styles["remarks-section"]}  ${styles["heading"]} ${styles["text-left"]}`}
          >
            <Box component="div" className={`${styles["heading-title"]}`}>
              <Box component="div">Remarks</Box>
            </Box>
            <CommentsSection
              id={placeData?.id}
              type={"Place"}
              remarks={remarks}
              addRemarks={addRemarksMutation}
              updateRemarks={updateRemarksMutation}
              SelfIcon={() => (
                <RenderInitials
                  firstName={data?.firstName}
                  lastName={data?.lastName}
                />
              )}
            />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default PlaceDetailsPage;
