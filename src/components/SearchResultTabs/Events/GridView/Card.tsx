import Box from "@mui/material/Box";
/** indicating that we can send html later on wherever we parse */
import parse from "html-react-parser";
import { Grid } from "@mui/material";
import {
  GridViewCard_Events,
  InventoryAssociationType_Event,
} from "../../../../types/SearchResultsTabsProps";
import gridStyles from "./index.module.css";
import MoreIcon from "../../../../assets/images/searchResults/MoreMenu.svg";
import {
  baseUrl,
  baseUrlS3,
  detectMediaTypeFromEvent,
  detectMediaTypeFromMediaAssociateGraphQlRes,
  handleImageUrl,
  isEventRecordAttached,
  isImagePathInvalid,
  itemAddEditAccess
} from "../../../../utils/services/helpers";
import NoImagePresent from "../../../NoDataScreens/NoImagePresent";
import MoreOptionsComponent from "../ListView/MoreOption";
import DetachedIcon from "../../../Icons/DetachedIcon";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { modifyAssociatedEvents } from "../../../../store/reducers/searchResultsReducer";
import RenderFileDataForGrid from "../../../RenderFileDataForGrid";
import {cloneDeep} from 'lodash'
import { mediaAssociate_PlaceOrEvent } from "../../../../types/Place";
import fallBackSrc from '../../../../assets/images/NoImage.png';

export const Card = ({
  img,
  title,
  subTitle,
  dateString,
  isNew,
  record,
  id,
  setEdit,
}: GridViewCard_Events) => {
  const { isAssociationsStepOpen, associatedEvents } = useSelector(
    (state: RootState) => state.searchResults
  );

  if (img) {
    let imagePath = img.split("/");
    img = `${imagePath[1]}/thumbnail_${imagePath[3]}`;
  }

  const dispatch = useDispatch();

  /**detect first featured image */
  let featuredRecordIndex = 0

  let flag = false

  cloneDeep(record?.attributes?.media_associates?.data)?.forEach((item: mediaAssociate_PlaceOrEvent, index: number) => {
    if (!flag && item?.attributes?.media_unique_id?.data?.attributes?.featuredImage) {
      featuredRecordIndex = index;
      flag = true;
    }

  })


  return (
    <>
      <Box component="div" className={`${gridStyles["card-container"]}`}>
        <Grid container className={`${gridStyles["card-grid"]}`}>
          <Grid
            item
            xl={4}
            lg={4}
            md={11}
            sm={11}
            className={`${gridStyles["card-image-wrapper"]}`}
            onClick={() => { }}
            style={{
              minHeight: isImagePathInvalid(
                record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url ?
                `${baseUrl}${record.attributes?.media_associates?.data[0]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url}` : 
                undefined
              ) ? '120px' : ''
            }}
          >
            {img ? (
              <Box
                className={`${gridStyles["card-image"]}`}
                component="img"
                alt={""}
                src={`${baseUrlS3}${img}`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null; // prevents looping
                  e.currentTarget.src=fallBackSrc;
                  e.currentTarget.width=100;
                }}
                // src={record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.categoryCode === "MEDIA" &&
                //   record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "IMAGE" ?
                //   record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url : ''
                //   }
              />
            ) : (
              <>
                  {
                    record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes
                      ?.media_unique_id?.data?.attributes?.media_type?.data[featuredRecordIndex]
                      ?.attributes?.categoryCode === "MEDIA"
                      ?
                      <RenderFileDataForGrid
                        fileData={{
                          alt: "",
                          src: record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url ? (
                            detectMediaTypeFromEvent(record) === "image" ?
                              handleImageUrl(record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url ?? '', "small_") :
                              `${record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url}`
                          ) : undefined,
                          className: detectMediaTypeFromEvent(record) === "video" ?
                            `${gridStyles['video-card-parent']}` : detectMediaTypeFromEvent(record) === "image" ?
                              `${gridStyles['card-image']}` : `${gridStyles['three-d-card-parent']}`,
                          objectURL: record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.objectURL || '',
                          videoType: record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.videoType,
                          iframeVideoLink: (record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.videoType === "url")
                            ? record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes.referenceURL : undefined,
                          staticVideoLink: (
                            (detectMediaTypeFromEvent(record) === "video" || record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes.videoType === "video") &&
                            record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url
                          ) ? `${record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes.object?.data?.attributes?.url}` : undefined,
                          isOpened: false
                        }}
                        fileType={detectMediaTypeFromEvent(record)}
                      /> :
                      <NoImagePresent message={"No media item is available"} />
                  }
              </>
            )}
          </Grid>
          <Grid
            item
            xl={7}
            lg={7}
            md={11}
            sm={11}
            className={`${gridStyles["content"]}`}
          >
            <div className={`${gridStyles["card-title"]}`}>
              {parse(title)} {dateString ? `on ${dateString}` : ''}
            </div>
            <div className={`${gridStyles["card-subtitle"]}`}>{subTitle}</div>
            {isNew && (
              <div className={`${gridStyles["card-new-flag"]}`}>NEW!</div>
            )}
            <Box
              className={`${gridStyles["more-icon-span"]}`}
              component={"span"}
            >
              <Box
                className={`${gridStyles["more-icon"]}`}
                component={"span"}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("click on more");
                }}
              >
                {isAssociationsStepOpen ? (
                  <DetachedIcon
                    style={{
                      height: "18px",
                      position: "relative",
                      top: "0.5em",
                    }}
                    shouldShowAttachIcon={isEventRecordAttached(
                      record,
                      associatedEvents
                    )}
                    onClick={(e) => {

                      if(isEventRecordAttached(record, associatedEvents)) return

                      const data: InventoryAssociationType_Event = {
                        id: record.id,
                        visitNumber: record.attributes.visitNumber,
                        placeNameEnglish:
                          record.attributes.visit_associate.data.attributes
                            .place_unique_id.data.attributes.placeNameEnglish,
                        placeNameArabic:
                          record.attributes.visit_associate.data.attributes
                            .place_unique_id.data.attributes.placeNameArabic,
                        placeNumber:
                          record.attributes.visit_associate.data.attributes
                            .place_unique_id.data.attributes.placeNumber,
                        keywords: record.attributes.keywords ? record.attributes.keywords : [],
                        previousMediaPresent: record.attributes?.media_associates.data && (record.attributes?.media_associates.data?.length > 0)
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
                  itemAddEditAccess && <MoreOptionsComponent
                    type="Events"
                    setEdit={setEdit}
                    record={record}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
