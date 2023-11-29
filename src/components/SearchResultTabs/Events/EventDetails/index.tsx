import { useCallback, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  InventoryAssociationType_Event,
  tabNameProps,
} from "../../../../types/SearchResultsTabsProps";
import styles from "./index.module.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import RenderFileData from "../../../RenderFileData";
import { MediaAssociateObj, Place } from "../../../../types/Place";
import { useAnchor } from "../../../../hooks/useAnchor";
import { StyledAntTable } from "../../../StyledAntTable";
import { ColumnsType } from "antd/lib/table";
// import { usePaginatedArray } from "../../../hooks/usePaginatedArray";
// import useLibrary from "../../../hooks/useLibrary";
import MoreOptionsComponent from "../ListView/MoreOption";
import {
  antTablePaginationCss,
  baseUrl,
  baseUrlS3,
  copyToClipboard,
  formatBytes,
  formatWebDate,
  isEmptyValue,
  NO_DESCRIPTION,
  NO_LOCATION,
  NO_TABLE_ROWS,
  NO_TEXT,
  isEventDetailAttached,
  detectMediaTypeFromMediaAssociate,
  EVENTS_TAB_NAME,
  itemAddEditAccess,
  itemDeleteAccess,
  webUrl
} from "../../../../utils/services/helpers";
import { Tooltip } from "antd";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Media, MediaApi } from "../../../../types/Media";
import styled from "styled-components";
import useMedia from "../../../../hooks/useMedia";
import CommentsSection from "../../../CommentsSection";
import RenderInitials from "../../../RenderInitials";
import { useDispatch } from "react-redux";
import {
  modifyAssociatedEvents,
  setActiveLibraryItem,
  setActiveLibraryItemIndex,
  setActiveMediaItem,
  setActiveMediaItemIndex,
  setActivePlaceItem,
  setActivePlaceItemIndex,
  setDeleteItemType,
  setDeletePayload,
  setSearchApply,
  toggleDeleteConfirmationWindowOpen,
  toggleGalleryView,
} from "../../../../store/reducers/searchResultsReducer";
import { CustomMoreOptionsComponent } from "../../../CustomMoreOptionsComponent";
import PositionedSnackbar from "../../../Snackbar";
import YellowStar from "../../../../assets/images/searchResults/YellowStar.svg";
import { useMediaQuery } from "react-responsive";
import useEventDetails from "../../../../hooks/useEventDetails";
import Loader from "../../../Common/Loader";
import MapView from "../../GoogleMap/MapView";
import NoTextPresent from "../../../NoDataScreens/NoText";
import { isEmpty } from "lodash";
import NoMapPresent from "../../../NoDataScreens/NoMapPresent";
import DetachedIcon from "../../../Icons/DetachedIcon";
import useRemarks from "../../../../hooks/useRemarks";
import { useHistory } from "../../../../hooks/useHistory";

const StyledTableWrapper = styled(StyledAntTable)`
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
    .ant-table {
      margin-block: 1em;
    }

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

const EventDetailsPage = () => {
  let { tabName, uniqueId } = useParams<{
    tabName?: tabNameProps;
    uniqueId: string;
  }>();
  const { goBack, navigateTo } = useHistory();
  const [isFilter, setIsFilter] = useState(null);
  const { places, isAssociationsStepOpen, associatedEvents, activeMediaItem, activeMediaItemIndex } =
    useSelector((state: RootState) => state.searchResults);
  const { data } = useSelector((state: RootState) => state.login);

  const {
    loading: eventLoading,
    data: eventDetails,
    setEdit,
    setFeaturedMedia,
  } = useEventDetails();

  let selectedPlaceObjIndex: number = 0;
  let selectedPlaceObj: Place = places[0];

  places.forEach((placeItem: Place, inx: number) => {
    if (placeItem.attributes.uniqueId === uniqueId) {
      selectedPlaceObj = placeItem;
      selectedPlaceObjIndex = inx;
    }
  });
  // get from api
  const [isCopyDone, setCopyDone] = useState<boolean>(false);

  const { } = useAnchor();

  const {
    loading: loadingRemarks,
    data: remarks,
    addRemarksMutation,
    updateRemarksMutation,
  } = useRemarks();
  const dispatch = useDispatch();

  const [mediaGridActiveItems, setMediaGridActiveItems] = useState<number>(0);

  let mediaCount = 8;
  const isTablet = useMediaQuery({
    query: "(min-width: 575px) and (max-width: 1025px)",
  });
  if (isTablet) {
    mediaCount = 6;
  }

  if (eventLoading) {
    return <Loader />;
  }

  if (!eventLoading && !eventDetails) {
    return <div>Cant fetch event</div>;
  }

  if (!eventDetails) {
    return null;
  }

  const {
    siteDescription,
    siteType,
    artifacts,
    period,
    fieldNarrative,
    stateOfConservation,
    assessmentType,
    otherAssessment,
    risk,
    tourismValue,
    researchValue,
    recommendation,
    visitUIPath,
    visitDate,
    recordingTeam,
    visitNumber,
    libraryItems,
    mediaGallery,
    visit_associate,
    id,
  } = eventDetails;

  const mediaGalleryLocal =
    mediaGallery && mediaGridActiveItems + mediaCount <= mediaGallery?.length
      ? mediaGallery?.slice(0, mediaGridActiveItems + mediaCount)
      : mediaGallery?.slice(
        0,
        mediaGridActiveItems + (mediaGallery?.length - mediaGridActiveItems)
      );

  const { latitude, longitude } = eventDetails;
  if (visit_associate?.place_unique_id) {
  }

  const menuItems = [
    {
      label: "Edit",
      action: () => {
        setEdit({ record: eventDetails, type: "Events" });
      },
    },
  ];

  if (itemDeleteAccess) {
    menuItems.push({
      label: "Delete",
      action: () => {
        dispatch(
          toggleDeleteConfirmationWindowOpen({
            flag: true,
            isAssociatedToPlacesOrEvents: false,
          })
        );
        dispatch(setDeleteItemType(EVENTS_TAB_NAME));
        dispatch(
          setDeletePayload({
            id: eventDetails.id,
          })
        );
      },
    });
  }
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
      sortDirections: ["ascend"],
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
          <Box component="div">{value?.fileName ? value?.fileName : value?.object?.name}</Box>
        </Box>
      },
    },
    {
      title: "DESCRIPTION",
      key: "attributes",
      className: "description-column",
      dataIndex: "media_unique_id", // temporary
      render: (value: any, index) => {
        return value?.description;
      },
    },
    {
      title: "CITATION",
      className: "citation-column cell-citation",
      dataIndex: "media_unique_id", // temporary
      render: (value: any, index) => {
        return value.citation ? value.citation : "";
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
          <Tooltip>{value.referenceURL ?? ""}</Tooltip>
        </Box>
      ),
    },
    {
      title: "SIZE",
      key: "attributes",
      dataIndex: "media_unique_id",
      render: (value, index) =>
        value?.object?.size ? formatBytes(value?.object?.size) : "",
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
        <>
          {itemAddEditAccess && (
            <MoreOptionsComponent
              type="Library"
              setEdit={setEdit}
              record={record}
            />
          )}
        </>
      ),
    },
  ];

  const handleClickMediaItem = (e: React.MouseEvent, itemIndex: number, uniqueId: string) => {
    /** itemIndex used to track which item being clicked out of 5;
     * 1st , 2nd etc.
     */
    e.preventDefault();
    // navigate(`/Media/${uniqueId}`, { replace: true })
    // if (media.length >= itemIndex) {

    let newList: any = []


    if (!mediaGalleryLocal) {
      dispatch(toggleGalleryView({
        flag: "from-event-details",
        galleryViewItemList: []
      }))

      return
    }

    /**load next set of items */
    /** To-do */
    // if(itemIndex + 1 === mediaGalleryLocal.length) {
    //   handleSeeMore()
    // }


    /** media details page should have all items equal to count being shown in media items section  */
    if (mediaGallery) {
      mediaGallery.forEach((item: MediaAssociateObj, index: number) => {
        newList.push({
          id: item.id.toString(),
          attributes: {
            ...item.media_unique_id
          }
        })
      })
    } else if(mediaGalleryLocal) {
      mediaGalleryLocal.forEach((item: MediaAssociateObj, index: number) => {
        newList.push({
          id: item.id.toString(),
          attributes: {
            ...item.media_unique_id
          }
        })
      })
    }


    dispatch(toggleGalleryView({
      flag: "from-event-details",
      galleryViewItemList: newList
    }))
    navigateTo(`/Media/${uniqueId}`)

    dispatch(setActiveMediaItem(mediaGallery ? mediaGallery[itemIndex - 1] : mediaGalleryLocal[itemIndex - 1]));
    dispatch(setActiveMediaItemIndex(itemIndex - 1));
    // }

  };

  const handleSearch = (searchData: any) => {
    dispatch(setSearchApply(true));
    navigateTo({
      pathname: `/Events`,
      search: decodeURIComponent(
        JSON.stringify({
          refinedSearch: searchData,
        })
      ),
    });
  };

  const handleSeeMore = () => {
    if (
      mediaGalleryLocal &&
      mediaGallery &&
      mediaGalleryLocal.length === mediaGallery.length
    ) {
      setMediaGridActiveItems(8);
    } else {
      setMediaGridActiveItems((state) => state + 8);
    }
  }

  const handleImageUrl = (url: string) => {
    let imagePath = url.split("/");
    return `${baseUrlS3}/small_${imagePath[3]}`;
  }

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
            onClick={(e) => {
              e.preventDefault();
              /** resetters */
              dispatch(setActivePlaceItem(null));
              dispatch(setActivePlaceItemIndex(0));
              dispatch(setActiveMediaItem(null));
              dispatch(setActiveMediaItemIndex(0));

              // navigate(`/${tabName}`, { replace: true })
              goBack();
            }}
          >
            Back
          </Button>
        </Grid>
        <Box component="div" className={`${styles["content-section"]}`}>
          <Box component="div" className={`${styles["title-section"]}`}>
            <Grid container>
              <Grid
                item
                sm={11}
                className={`${styles["title-section-left-item"]}`}
              >
                {/* to-do:  Make these true && dependent on incoming API variable.
                                If it exists, render the jsx */}
                <Grid container>
                  {visit_associate?.place_unique_id?.placeNameEnglish && (
                    <Grid item>
                      <Box component="div" className={`${styles["item-name"]}`}>
                        {visit_associate?.place_unique_id?.placeNameEnglish}
                      </Box>
                    </Grid>
                  )}
                  {visit_associate?.place_unique_id?.placeNameArabic && (
                    <Grid item>
                      <Box
                        component="div"
                        className={`${styles["item-name-arabic"]}`}
                      >
                        {visit_associate?.place_unique_id?.placeNameArabic}
                      </Box>
                    </Grid>
                  )}
                  {visit_associate?.place_unique_id?.placeNumber && (
                    <Grid item>
                      <Box
                        component="div"
                        className={`${styles["item-number"]}`}
                      >
                        {`${
                          visit_associate?.place_unique_id?.placeNameEnglish ||
                          visit_associate?.place_unique_id?.placeNameArabic ?
                          '-' : ''
                        } ${visit_associate?.place_unique_id?.placeNumber}`}
                      </Box>
                    </Grid>
                  )}
                </Grid>
                <Box
                  component="div"
                  className={`${styles["visited-by-main-box"]}`}
                >
                  {visitDate && (
                    <Box component="span">Visited on {visitDate} by </Box>
                  )}
                  <Box component="span">{recordingTeam}</Box>
                </Box>
                {visitNumber && (
                  <Box component="div" className={`${styles["visit-count"]}`}
                    style={{
                      fontWeight: 'bold',
                      lineHeight: 1.5,
                      fontSize: 'large'
                    }}
                  >
                    VISIT {visitNumber}
                  </Box>
                )}
                {id && (
                  <Box component="div" className={`${styles["visit-count"]}`}
                    style={{
                      lineHeight: 1.5,
                      fontSize: 'medium'
                    }}
                  >
                    ID {id}
                  </Box>
                )}
              </Grid>
              <Grid item sm={1} className={`${styles["title-section-grids"]}`}>
                <Box component="div" className={`${styles["more-icon-box"]}`}>
                  {isAssociationsStepOpen ? (
                    <DetachedIcon
                      style={{}}
                      shouldShowAttachIcon={isEventDetailAttached(
                        eventDetails,
                        associatedEvents
                      )}
                      onClick={(e) => {

                        if(isEventDetailAttached(eventDetails, associatedEvents)) return

                        const data: InventoryAssociationType_Event = {
                          id: eventDetails.id ? eventDetails.id.toString() : "",
                          visitNumber: eventDetails.visitNumber,
                          placeNameEnglish:
                            eventDetails.visit_associate?.place_unique_id
                              .placeNameEnglish ?? "",
                          placeNameArabic:
                            eventDetails.visit_associate?.place_unique_id
                              .placeNameArabic ?? "",
                          placeNumber:
                            eventDetails.visit_associate?.place_unique_id
                              .placeNumber ?? "",
                          keywords: eventDetails.keywords ? eventDetails.keywords : [],
                          previousMediaPresent: eventDetails.media_associates && (eventDetails.media_associates?.length > 0)
                        };

                        dispatch(
                          modifyAssociatedEvents({
                            newItem: data,
                            removeId: null,
                          })
                        );
                      }}
                    />
                  ) : (
                    <>
                      {itemAddEditAccess && (
                        <CustomMoreOptionsComponent menuActions={menuItems} />
                      )}
                    </>
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
                <Box component="div" className={`${styles["site-desc"]}`}>
                  {/* If needed See More functionality in future, copy from PlaceDetails */}
                  {siteDescription ? (
                    <Box
                      component="div"
                      className={`${styles["no-data-available"]} ${styles["see-more-active"]}`}
                    >
                      {siteDescription?.substring(0, 200)}
                    </Box>
                  ) : (
                    <NoTextPresent message={NO_DESCRIPTION} />
                  )}
                </Box>
                <Box component="div" className={`${styles["table"]}`}>
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]} `}
                    >
                      Site Type
                    </Grid>
                    <Grid item
                      sm={9}
                      md={8}
                    >
                      <Box
                        component={"div"}
                        className={`${styles["text-anchors-parent"]}`}
                      >
                        {!isEmpty(siteType) ? (
                          siteType.map((item: string, index: number) => (
                            <Box
                              component="div"
                              className={`${styles["text-anchor"]}`}
                              key={index}
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
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]} `}
                    >
                      Artifacts
                    </Grid>
                    <Grid item
                      sm={9}
                      md={8}
                    >
                      <Box
                        component={"div"}
                        className={`${styles["text-anchors-parent"]}`}
                      >
                        {!isEmpty(artifacts) ? (
                          artifacts.map((item: string, index: number) => (
                            <Box
                              component="div"
                              className={`${styles["text-anchor"]}`}
                              key={index}
                              onClick={() => handleSearch({ artifacts: [item] })}
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
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Period
                    </Grid>
                    <Grid item
                      sm={9}
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
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Field Narrative
                    </Grid>
                    {!isEmptyValue(fieldNarrative) ? (
                      <Grid item sm={9} md={8}>{fieldNarrative}</Grid>
                    ) : (
                      <Grid item>
                        <NoTextPresent message={NO_TEXT} />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Assesment Type
                    </Grid>
                    {!isEmptyValue(assessmentType) ? (
                      <>
                        {
                          assessmentType.map((item: string, index: number) => (
                            <Grid item key={index}>
                              {item}
                            </Grid>
                          ))

                        }
                        {
                          assessmentType &&
                          (assessmentType[0] === "Other") &&
                          otherAssessment &&
                          <>
                            &nbsp;{`(${otherAssessment})`}
                          </>
                        }
                      </>
                    ) : (
                      <Grid item>
                        <NoTextPresent message={NO_TEXT} />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container className={`${styles["table-row"]}`}>
                    <Grid
                      item
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      State of Conservation
                    </Grid>
                    {!isEmptyValue(stateOfConservation) ? (
                      stateOfConservation.map((item: string, index: number) => (
                        <Grid item key={index}>
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
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Risk
                    </Grid>
                    {!isEmptyValue(risk) ? (
                      risk.map((item: string, index: number) => (
                        <Grid item key={index}>
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
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Tourism Value
                    </Grid>
                    {!isEmptyValue(tourismValue) ? (
                      tourismValue.map((item: string, index: number) => (
                        <Grid item key={index}>
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
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Research Value
                    </Grid>
                    {!isEmptyValue(researchValue) ? (
                      researchValue.map((item: string, index: number) => (
                        <Grid item key={index}>
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
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      Recommendation
                    </Grid>
                    {!isEmptyValue(recommendation) ? (
                      recommendation.map((item: string, index: number) => (
                        <Grid item key={index}>
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
                      sm={3}
                      md={4}
                      className={`${styles["table-parameter"]}`}
                    >
                      URL
                    </Grid>
                    <Grid item sm={9} md={8}>
                      {/* to-do */}
                      {/* When clicking on the URL link, the link should be copied to the clip board. 
                                            A success message will be displayed with the message “URL copied to clipboard” */}
                      <Box
                        component="div"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          setCopyDone(true);
                          copyToClipboard(`${webUrl}/${visitUIPath}`);
                        }}
                      >
                        {`${webUrl}/${visitUIPath}`}
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
                        key={1}
                        filterId={setIsFilter}
                        marker={[
                          {
                            id: "1",
                            uniqueId:eventDetails.uniqueId,
                            name: eventDetails?.visit_associate?.place_unique_id
                              ?.placeNameEnglish,
                            position: {
                              lat: latitude ? latitude : 24.11,
                              lng: longitude ? longitude : 34.98,
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
              {libraryItems && !isEmpty(libraryItems) && (
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
                  scroll={{ x: true, y: 300 }}
                  style={{
                    background: "transparent",
                  }}
                  onRow={(record: any, rowIndex: number | undefined) => {
                    return {
                      onClick: (library) => {
                        if (typeof rowIndex === "number") {
                          dispatch(setActiveLibraryItem(record));
                          dispatch(setActiveLibraryItemIndex(rowIndex));

                          navigateTo(
                            `/Library/${record.media_unique_id.uniqueId}`
                          );
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
              <Box component="div">Media Gallery</Box>
              {mediaGallery && !isEmpty(mediaGallery) && (
                <Box component="div">{mediaGallery.length} Items</Box>
              )}
            </Box>
            <Box component="div" className={`${styles["table-wrapper"]}`}>
              {!isEmpty(mediaGalleryLocal) ? (
                <Grid container className={`${styles["media-grid"]}`}>
                  {mediaGalleryLocal &&
                    mediaGalleryLocal.map(
                      (itemObj: MediaAssociateObj, inx: number) => (
                        <Grid
                          item
                          lg={3}
                          md={4}
                          sm={4}
                          key={inx}
                          className={`${styles["media-grid-item"]}`}
                          onClick={(e) => {
                            handleClickMediaItem(
                              e,
                              inx + 1,
                              itemObj.media_unique_id.uniqueId
                            );
                          }}
                        >
                          <RenderFileData
                            fileData={{
                              alt: "",
                              // src: itemObj.attributes.media_associates.data[0].attributes.media_unique_id.data.attributes.object.data.attributes.url,
                              src: itemObj.media_unique_id?.object?.url
                                ? handleImageUrl(itemObj.media_unique_id.object.url)
                                : undefined,
                              className: styles["media-image"],
                              objectURL: itemObj.media_unique_id.objectURL
                                ? itemObj.media_unique_id.objectURL
                                : undefined,
                              videoType: itemObj.media_unique_id.videoType,
                              iframeVideoLink:
                                itemObj.media_unique_id.videoType === "url"
                                  ? itemObj.media_unique_id.referenceURL
                                  : undefined,
                              staticVideoLink:
                                itemObj.media_unique_id?.media_type[0]?.typeCode?.toLowerCase() ===
                                  "video" &&
                                  itemObj.media_unique_id.videoType === "video"
                                  ? `${itemObj.media_unique_id.object?.url}`
                                  : undefined,
                            }}
                            fileType={detectMediaTypeFromMediaAssociate(
                              itemObj
                            )}
                          />
                          <Box component="div">
                            <Grid
                              container
                              className={`${styles["media-grid-item-options-row"]}`}
                            >
                              <Grid item>
                                {/* To-do: modify featured image flag */}
                                {itemObj.media_unique_id.featuredImage && (
                                  <Box component="div">
                                    <Grid
                                      container
                                      className={`${styles["star-icon-grid"]}`}
                                    >
                                      <Grid item>
                                        <Box
                                          component="img"
                                          alt={""}
                                          src={YellowStar}
                                        ></Box>
                                      </Grid>
                                      <Grid item>Featured</Grid>
                                    </Grid>
                                  </Box>
                                )}
                              </Grid>
                              <Grid item>
                                {itemAddEditAccess && (<MoreOptionsComponent
                                  type="Media"
                                  setEdit={setEdit}
                                  record={itemObj}
                                  setFeaturedMedia={setFeaturedMedia}
                                />)}
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      )
                    )}
                </Grid>
              ) : (
                <NoTextPresent message={NO_TABLE_ROWS} />
              )}
            </Box>
            {!isEmpty(mediaGalleryLocal) &&
              mediaGalleryLocal &&
              mediaGalleryLocal.length > 6 && (
                <Grid
                  container
                  sx={{
                    justifyContent: "center",
                    "& .MuiGrid-root.MuiGrid-item:has(.Mui-disabled.MuiButtonBase-root.MuiButton-root)":
                    {
                      cursor: "not-allowed",
                    },
                    "& .MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary:hover":
                    {
                      backgroundColor: "unset",
                    },
                  }}
                >
                  <Grid
                    item
                    sx={{
                      width: "fit-content",
                      "& .MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary:hover":
                      {
                        backgroundColor: "unset",
                      },
                    }}
                  >
                    <Button
                      variant="contained"
                      type="button"
                      sx={{
                        color: "var(--black-90-pct)",
                        backgroundColor: "transparent",
                        borderRadius: "2em",
                        margin: "1em",
                        padding: "0.4em 1.2em",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSeeMore()
                      }}
                    >
                      See{" "}
                      {mediaGalleryLocal &&
                        mediaGallery &&
                        mediaGalleryLocal.length === mediaGallery.length
                        ? "Less"
                        : "More"}
                    </Button>
                  </Grid>
                </Grid>
              )}
          </Box>
          <Box
            component="div"
            className={`${styles["remarks-section"]}  ${styles["heading"]} ${styles["text-left"]}`}
          >
            <Box component="div" className={`${styles["heading-title"]}`}>
              <Box component="div">Remarks</Box>
            </Box>
            <CommentsSection
              id={eventDetails?.id.toString()}
              type={"Visit"}
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

export default EventDetailsPage;
