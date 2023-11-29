import { Box, Grid, Button } from "@mui/material";
import styles from "./index.module.css";
import { CustomModal } from "../../../CustomModal";
import {
  InventoryAssociationType,
  InventoryAssociationType_Event,
  LibraryDetailsPageProps,
  tabNameProps,
} from "../../../../types/SearchResultsTabsProps";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setActiveLibraryItem,
  setActiveLibraryItemIndex,
  setDeleteItemType,
  setDeletePayload,
  toggleDeleteConfirmationWindowOpen,
} from "../../../../store/reducers/searchResultsReducer";
import { useParams } from "react-router-dom";
import { CustomMoreOptionsComponent } from "../../../CustomMoreOptionsComponent";
import useMediaDetails from "../../../../hooks/useMediaDetails";
import Loader from "../../../Common/Loader";
import useLibraryDetails from "../../../../hooks/useLibraryDetails";
import {
  baseUrl,
  copyToClipboard,
  detectLibraryRecordApiType,
  formatBytes,
  isRecordHavingAssociations,
  itemAddEditAccess,
  itemDeleteAccess,
  LIBRARY_TAB_NAME,
  MEDIA_TYPE_IMAGE,
} from "../../../../utils/services/helpers";
import dayjs from "dayjs";
import BlankDocImage from "../../../../assets/images/searchResults/BlankDocument.svg";
import type { UploadProps } from "antd";
import RenderValueWithDefault from "../../../NoDataScreens/DefaultText";
import { useHistory } from "../../../../hooks/useHistory";
import PositionedSnackbar from "../../../Snackbar";
// import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
// import { Document, Page } from 'react-pdf';
// import DocViewer from "react-doc-viewer";
// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';

const LibraryDetailsPage = ({
  currentItemIndex,
  data,
  currentRecord,
  handleClose,
}: LibraryDetailsPageProps) => {
  const { library } = useSelector((state: RootState) => state.searchResults);
  const dispatch = useDispatch();
  const { data: libraryDetails, setEdit } = useLibraryDetails();
  const [isCopyDone, setCopyDone] = useState<boolean>(false);

  const locationRef = window.location.href;

  if (!libraryDetails) {
    return <>Cant display Library Details</>;
  }

  const { description, title, id, referenceURL, citation } = libraryDetails;

  const menuItems = [
    {
      label: "Edit",
      action: () => {
        setEdit({ record: libraryDetails, type: "Library" });
        // handleClose();
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
            isAssociatedToPlacesOrEvents: library
              ? isRecordHavingAssociations(
                  library.filter(
                    (item) =>
                      item?.id === data?.id?.toString()
                  )[0]
                )
              : false,
          })
        );
        dispatch(setDeleteItemType(LIBRARY_TAB_NAME));
        dispatch(
          setDeletePayload({
            id: parseInt(libraryDetails.id),
          })
        );
      },
    });
  }
  const props: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    // customRequest: uploadImage,
    // onChange: handleChange,
    // defaultFileList: defaultImages
  };

  return (
    <>
      <Box component="div" className={`${styles["details-page-wrapper"]}`}>
        <Box component="div">
          <Box component="div" className={`${styles["img-wrapper"]}`}>
            {detectLibraryRecordApiType(libraryDetails) === MEDIA_TYPE_IMAGE ? (
              <>
                {libraryDetails.object && (
                  <Box
                  className={`${styles["image-bg"]}`}
                  component="div"
                >
                  <Box
                    className={`${styles["image"]}`}
                    component="img"
                    alt={""}
                    src={`${baseUrl}${libraryDetails?.object?.url}`}
                  />
                  <a className={`${styles['anchor']}`} href={`${baseUrl}${libraryDetails?.object?.url}`} target="_blank" 
                    rel="noreferrer">{libraryDetails?.object?.name}</a>
                  </Box>
                )}
              </>
            ) : libraryDetails?.object?.url &&
              libraryDetails?.object?.url.indexOf(".pdf") !== -1 ? (
              <>
                {/* For now, show blank document
                                    Need to find how to render pdf preview */}
                {/* <embed
                                        type="application/pdf"
                                        src={`${baseUrl}${libraryDetails.object.url}`}
                                        style={{
                                            width: '100%'
                                        }}
                                      
                                    /> */}
                                    <Box
                  className={`${styles["blank-doc-image"]}`}
                  component="div"
                  display="grid"
                >
                <Box
                  component="img"
                  src={BlankDocImage}
                  alt={""}
                  className={`${styles["image"]}`}
                />
                <a className={`${styles['anchor']}`} href={`${baseUrl}${libraryDetails?.object?.url}`} target="_blank" 
                    rel="noreferrer">{libraryDetails?.object?.name}</a>
                    </Box>
                {/* <div
                                        style={{
                                            height: '750px',
                                        }}
                                    >
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                                            <div style={{ height: "720px" }}>
                                                <Viewer fileUrl={`${baseUrl}${libraryDetails.object.url}`} />
                                            </div>
                                        </Worker>

                                    </div> */}
                {/* <Document file={`${baseUrl}${libraryDetails.object.url}`} onLoadSuccess={() => {}}>
                                    {/* <DocViewer documents={[
                                        { uri: `${baseUrl}${libraryDetails.object.url}` }
                                    ]} /> */}
                {/* <Upload {...props} >
                                        <AntdButton icon={<UploadOutlined />}>
                                            Select file...
                                        </AntdButton >
                                    </Upload> */}
              </>
            ) : (
              <Box
                  className={`${styles["blank-doc-image"]}`}
                  component="div"
                  display="grid"
                >
                <Box
                  component="img"
                  src={BlankDocImage}
                  alt={""}
                  className={`${styles['image']}`}
                />
                <a className={`${styles['anchor']}`} href={`${baseUrl}${libraryDetails?.object?.url}`} target="_blank" 
                    rel="noreferrer">{libraryDetails?.object?.name}</a>
                    </Box>
            )}
          </Box>
        </Box>
        <Box component="div" className={`${styles["desc"]}`}>
          <Grid container className={`${styles["bottom-desc-main-grid"]}`}>
            <Grid
              container
              className={`${styles["bottom-desc-row-1"]}`}
              style={{
                justifyContent: "space-between",
              }}
            >
              <Grid item sm={12}>
                <Grid container style={{ gap: "2em", alignItems: "center" }}>
                  <Grid item>
                    <Box
                      component="div"
                      className={`${styles["overview-title"]}`}
                    >
                      {title}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    sm={1}
                    className={`${styles["more-icon-grid-item"]}`}
                    style={{
                      marginLeft: "auto",
                    }}
                  >
                    {itemAddEditAccess && (
                      <CustomMoreOptionsComponent
                        moreIconClassName={`${styles["more-icon"]}`}
                        menuActions={menuItems}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item sm={12}>
                <Box component="div" className={`${styles[`bottom-grid`]}`}>
                  <p>ID: {id}</p>
                  <br />
                  <div>{description}</div>
                </Box>
                <Box component="div" className={`${styles[`bottom-grid`]}`}>
                  <p>Details</p>
                  <div>Reference URL: {RenderValueWithDefault(referenceURL)}</div>
                  <div>Citation: {RenderValueWithDefault(citation)}</div>
                  <Grid container style={{
                    gap: '10px'
                  }}>
                    <Grid item sm={2} style={{
                      maxWidth: 'fit-content'
                    }}>
                      Item URL:
                    </Grid>
                    <Grid item sm={10}>
                      <Box
                        component="div"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          setCopyDone(true);
                          copyToClipboard(locationRef ?? "");
                        }}
                      >
                        {RenderValueWithDefault(locationRef)}

                      </Box>
                    </Grid>
                  </Grid>
                  <PositionedSnackbar
                    message={"Copied to clipboard"}
                    severity={"success"}
                    open={isCopyDone}
                    handleClose={() => setCopyDone(false)}
                  />
                </Box>

                {libraryDetails.object && (
                  <Box component="div" className={`${styles[`bottom-grid`]}`}>
                    <p>Metadata</p>
                    <div>
                      File Name:{" "}
                      {RenderValueWithDefault(libraryDetails?.object?.name)}
                    </div>
                    <div>
                      Size:{" "}
                      {formatBytes(libraryDetails?.object?.size || 0, 2)}{" "}
                      {/* {(libraryDetails?.object?.size) ? "MB" : ""} */}
                    </div>
                    <div>
                      <span>
                        Created:{" "}
                        <span>
                          {RenderValueWithDefault(
                            `${dayjs(libraryDetails?.createdAt).format(
                              "MM/DD/YYYY"
                            )}`
                          )}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span>
                        Modified:{" "}
                        <span>
                          {RenderValueWithDefault(
                            `${dayjs(libraryDetails?.updatedAt).format(
                              "MM/DD/YYYY"
                            )}`
                          )}
                        </span>
                      </span>
                    </div>
                    <div>
                      Extensions:{" "}
                      {RenderValueWithDefault(
                        libraryDetails?.object?.ext &&
                          libraryDetails?.object?.ext?.replace(".", "")
                      )}
                    </div>
                  </Box>
                )}
                <Box component="div" className={`${styles[`bottom-grid`]}`}>
                  <p>Associations</p>
                  <p>Places</p>
                  <Box component="div" className={`${styles[`bottom-grid`]}`}>
                    {libraryDetails.media_associate?.place_unique_ids &&
                    libraryDetails.media_associate?.place_unique_ids?.length > 0
                      ? libraryDetails.media_associate?.place_unique_ids?.map(
                          (placeObj: InventoryAssociationType) => (
                            <div>
                              {placeObj.placeNameEnglish}{" "}
                              {placeObj.placeNameArabic}
                            </div>
                          )
                        )
                      : RenderValueWithDefault("")}
                  </Box>
                  <p>Events</p>
                  <Box component="div" className={`${styles[`bottom-grid`]}`}>
                    {libraryDetails.media_associate?.visit_unique_ids &&
                    libraryDetails.media_associate?.visit_unique_ids?.length > 0
                      ? libraryDetails.media_associate?.visit_unique_ids?.map(
                          (visitObj: InventoryAssociationType_Event, index: number) => {

                            return  <>
                              {visitObj &&
                                <div>
                                  {
                                    `${visitObj?.visit_associate?.place_unique_id?.placeNameEnglish ?
                                      visitObj?.visit_associate?.place_unique_id?.placeNameEnglish :
                                      ""
                                    }${visitObj?.visit_associate?.place_unique_id?.placeNameArabic ?
                                      `  ${visitObj?.visit_associate?.place_unique_id?.placeNameArabic}` :
                                      ""
                                    }${libraryDetails.media_associate?.visit_unique_ids[index]?.visitNumber
                                      ? `  Visit ${libraryDetails.media_associate?.visit_unique_ids[index]?.visitNumber}`
                                      : ""}`
                                  }

                                </div>
                              }
                            </>
                          }
                        )
                      : RenderValueWithDefault("")}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export const LibraryDetailsModal = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(true);

  const { activeMediaItemIndex } = useSelector(
    (state: RootState) => state.searchResults
  );
  let { tabName } = useParams<{ tabName?: tabNameProps }>();

  const dispatch = useDispatch();
  const { goBack } = useHistory()

  const { loading: libraryLoading, data: libraryDetails } = useMediaDetails();

  if (libraryLoading) {
    return <Loader />;
  }

  if (!libraryLoading && !libraryDetails) {
    return <div>Cant fetch library item details</div>;
  }

  if (!libraryDetails) {
    return null;
  }

  const handleClose = () => {
    setModalOpen(false);
    dispatch(setActiveLibraryItem(null));
    dispatch(setActiveLibraryItemIndex(0));
    // navigate(`/Library`, { replace: true, state: null });
    goBack()

  };

  return (
    <>
      <CustomModal
        open={isModalOpen}
        titleContent={
          <Grid
            container
            className={`${styles["modal-title"]}`}
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Grid item>
              <Button
                variant="text"
                type="button"
                startIcon={<KeyboardArrowLeftIcon fontSize="small" />}
                style={{
                  color: "var(--medium-gray",
                  textTransform: "none",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  /** resetters */
                  handleClose();
                }}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        }
        handleClose={() => handleClose()}
      >
        <LibraryDetailsPage
          data={libraryDetails}
          currentItemIndex={activeMediaItemIndex}
          currentRecord={libraryDetails}
          handleClose={handleClose}
        />
      </CustomModal>
    </>
  );
};
