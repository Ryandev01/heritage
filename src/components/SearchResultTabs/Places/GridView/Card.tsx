import React, {useState} from 'react';
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
/** indicating that we can send html later on wherever we parse */
import parse from "html-react-parser";
import { GridViewCard_Places, InventoryAssociationType } from "../../../../types/SearchResultsTabsProps";
import gridStyles from "./index.module.css";
import { baseUrl, baseUrlS3, detectMediaTypeFromMediaAssociateGraphQlRes, detectMediaTypeFromPlace, isImagePathInvalid, isRecordAttached, itemAddEditAccess } from "../../../../utils/services/helpers";
import MoreOptionsComponent from "../ListView/MoreOption";
import { useSelector } from "react-redux";
import DetachedIcon from "../../../Icons/DetachedIcon";
import { modifyAssociatedPlaces } from "../../../../store/reducers/searchResultsReducer";
import { RootState } from "../../../../store";
import { useDispatch } from "react-redux";
import RenderFileDataForGrid from "../../../RenderFileDataForGrid";
import fallBackSrc from '../../../../assets/images/NoImage.png';
import { mediaAssociate_PlaceOrEvent } from "../../../../types/Place";
import {cloneDeep} from 'lodash'

export const Card = ({
  img,
  title,
  subTitle,
  dateString,
  period,
  setEdit,
  record
}: GridViewCard_Places) => {
  const [imageError, setImageError] = useState(false);
  const { isAssociationsStepOpen, associatedPlaces } = useSelector(
    (state: RootState) => state.searchResults
  );

  const handleImageUrl = (url: string, size: string) => {
    // let imagePath = url.split("/");
    // return `${baseUrl}/${imagePath[1]}/${size}${imagePath[2]}`;
    let imagePath = url.split("/");
    return `${baseUrlS3}/${size}${imagePath[3]}`;
  }

  const dispatch = useDispatch()

  /**detect first featured image */
  let featuredRecordIndex = 0

  let flag = false

  cloneDeep(record?.attributes?.media_associates?.data)?.forEach((item: mediaAssociate_PlaceOrEvent, index: number) => {
    if (!flag && item?.attributes?.media_unique_id?.data?.attributes?.featuredImage) {
      featuredRecordIndex = index;
      flag = true;
    }

  })
  const media = record.attributes?.media_associates?.data.filter(x => x?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.categoryCode === "MEDIA");
  const mediaImage = record.attributes?.media_associates?.data.filter(x => x?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.categoryCode === "MEDIA" && x?.attributes?.media_unique_id?.data?.attributes?.media_type?.data[0]?.attributes?.typeCode === "IMAGE");

  if (img) {
    let imagePath = img.split("/");
    img = `${imagePath[1]}/thumbnail_${imagePath[3]}`;
  }
  return (
    <>
      <Box component="div" className={`${gridStyles["card-container"]}`}>
        <Grid container spacing={1} className={`${gridStyles["card-grid"]}`}>
          <Grid
            item
            xl={5}
            lg={5}
            md={11}
            sm={11}
            className={`${gridStyles["card-image-wrapper"]}`}
            style={{
              minHeight: isImagePathInvalid(
                record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url ? `${baseUrl}${record.attributes?.media_associates?.data[0]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url}` : undefined
              ) ? '150px' : ''
            }}
          >
            {img ? 
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
            /> :
              <RenderFileDataForGrid
                fileData={{
                  alt: "",
                  // src: record.attributes?.media_associates?.data[0]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url ? (
                  src: media.length > 0 ? (
                    detectMediaTypeFromPlace(record) === "image" ?
                      handleImageUrl(mediaImage[0]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url || '', "small_") :
                      // mediaImage[0]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url :
                      `${record.attributes?.media_associates?.data[0]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url}`
                  ) : undefined,
                  className: detectMediaTypeFromPlace(record) === "video" ?
                    `${gridStyles['video-card-parent']}` : detectMediaTypeFromPlace(record) === "image" ?
                      `${gridStyles['card-image']}` : `${gridStyles['three-d-card-parent']}`,
                  objectURL: record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.objectURL || '',
                  videoType: record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.videoType,
                  iframeVideoLink: (record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.videoType === "url")
                    ? record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes.referenceURL : undefined,
                  staticVideoLink: (
                    (detectMediaTypeFromPlace(record) === "video" || record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes.videoType === "video") &&
                    record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes?.object?.data?.attributes?.url
                  ) ? `${record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes?.media_unique_id?.data?.attributes.object?.data?.attributes?.url}` : undefined,
                  isOpened: false
                }}
                fileType={detectMediaTypeFromMediaAssociateGraphQlRes(record.attributes?.media_associates?.data[featuredRecordIndex]?.attributes || record)}
              />
            }
            {/* :<NoImagePresent message={"No media item is available"} />} */}
          </Grid>
          <Grid
            item
            xl={6}
            lg={6}
            md={11}
            sm={11}
            className={`${gridStyles["content"]}`}
          >
            <div className={`${gridStyles["card-title"]}`}>{parse(title)}</div>
            <div className={`${gridStyles["card-subtitle"]}`}>{subTitle}</div>
            <div className={`${gridStyles["card-date"]}`}>{dateString}</div>
            <div className={`${gridStyles["card-keywords"]}`}>
              {period && period.length > 0 && period?.map((item, keyInx) => (
                <> {2 > keyInx ? <div key={keyInx} className={`${gridStyles["keyword-pill"]}`}>
                  {item}
                </div> : null}
                </>
              ))}
            </div>
            <Box
              className={`${gridStyles["more-icon-span"]}`}
              component={"span"}
            >
              <Box
                className={`${gridStyles["more-icon"]}`}
                component={"span"}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('click on more')
                }}
              >
                {isAssociationsStepOpen ?
                  <DetachedIcon
                    style={{
                      height: '18px',
                      position: 'relative',
                      top: '0.5em',
                    }}
                    shouldShowAttachIcon={isRecordAttached(record, associatedPlaces)}
                    onClick={e => {

                      if(isRecordAttached(record, associatedPlaces)) return
                      
                      const data: InventoryAssociationType = {
                        id: Number(record.id),
                        placeNameEnglish: record.attributes.placeNameEnglish,
                        placeNameArabic: record.attributes.placeNameArabic,
                        placeNumber: record.attributes.placeNumber,
                        keywords: record.attributes.keywords ? [...record.attributes.keywords] : [],
                        previousMediaPresent: record.attributes?.media_associates.data && (record.attributes?.media_associates.data?.length > 0)
                      }
                      dispatch(modifyAssociatedPlaces({
                        newItem: data,
                        removeId: null
                      }))
                    }}
                  /> :
                  (
                    itemAddEditAccess && <MoreOptionsComponent type="Places" setEdit={setEdit} record={record} />
                  )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
