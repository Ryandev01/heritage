
import { Box, Grid } from '@mui/material';
import YellowStar from '../../../../assets/images/searchResults/YellowStar.svg'
import styles from './index.module.css';
// import { useState } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MediaDetailsPageProps } from '../../../../types/SearchResultsTabsProps';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveMediaItemIndex, setActiveMediaItem, toggleDeleteConfirmationWindowOpen, setDeleteItemType, setDeletePayload, setMedia, setFetchLimit } from '../../../../store/reducers/searchResultsReducer';
import RenderFileData from '../../../RenderFileData';
import { CustomMoreOptionsComponent } from '../../../CustomMoreOptionsComponent';
import { useEffect } from 'react';
import useMediaDetails from '../../../../hooks/useMediaDetails';
import { baseUrl, baseUrlS3, MEDIA_TYPE_IMAGE, MEDIA_TYPE_VIDEO, MEDIA_TYPE_3D, NO_LOCATION, detectMediaRecordApiType, NO_IMAGE, toFixedFromString, MEDIA_TAB_NAME, isRecordHavingAssociations, itemAddEditAccess, itemDeleteAccess, copyToClipboard, MAX_FETCH_LIMIT, limit, detectMediaTypeFromMediaDetailPage } from '../../../../utils/services/helpers';

import NoMapPresent from '../../../NoDataScreens/NoMapPresent';
import NoImagePresent from '../../../NoDataScreens/NoImagePresent';
import parse from 'html-react-parser';
import MapView from '../../GoogleMap/MapView';
import { useHistory } from '../../../../hooks/useHistory';
import TextualContent from './TextualContent';
import useMedia from '../../../../hooks/useMedia';
import { useNavigate } from 'react-router-dom';
import { Media, MediaApi } from '../../../../types/Media';
import { MediaAssociateObj } from '../../../../types/Place';

const MediaDetailsPage = ({
    currentItemIndex,
    handleClose
}: MediaDetailsPageProps) => {

    type handleAction = {
        e: React.MouseEvent<HTMLElement>
        action: string
    }
    const { media, activeMediaItemIndex, places, totalCounts, openGalleryView, fetchLimit } = useSelector(
        (state: RootState) => state.searchResults
    );
    const [isFilter, setIsFilter] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { navigateTo } = useHistory()
    const { fetchMediaItems } = useMedia();

    const { data: mediaDetails, setEdit } = useMediaDetails();

    let [mediaType, setMediaType] = useState<"image" | "video" | "3d">("image")

    useEffect(() => {
        /** To-do: make this flag based on a api variable */
        // setMediaType("image")
        // setMediaType("video")
        // setMediaType("3d")

        if (mediaDetails && (Object.keys(mediaDetails).length !== 0)) {
            if (
                detectMediaRecordApiType(mediaDetails) === MEDIA_TYPE_VIDEO
            ) {
                setMediaType(MEDIA_TYPE_VIDEO)
            } else if (detectMediaRecordApiType(mediaDetails) === MEDIA_TYPE_IMAGE) {
                setMediaType(MEDIA_TYPE_IMAGE)
            } else if (detectMediaRecordApiType(mediaDetails) === MEDIA_TYPE_3D) {
                setMediaType(MEDIA_TYPE_3D)
            }
        }


    }, [mediaDetails])

    useEffect(() => {

        if(openGalleryView.flag) {
            setListToBeReferred(openGalleryView.galleryViewItemList)
        } else {
            setListToBeReferred(media)
        }
    }, [ openGalleryView])

    const [listToBeReferred, setListToBeReferred] = useState<any>(media)

    if (!mediaDetails) {
        return <>Cant display Media Details</>
    }

    const {
        description, title, id, objectURL, featuredImage, referenceURL, citation,
        categoryType, Author, bearing, latitude, longitude
    } = mediaDetails


    const handleNextOrPrevious = (e: handleAction['e'], action: handleAction['action']) => {
        e.preventDefault()
        let newIndex = activeMediaItemIndex

        const TotalCountToRefer = openGalleryView.flag ? openGalleryView.galleryViewItemList.length :
            totalCounts ? totalCounts.media : 0

        if (action === 'next') {
            if (newIndex + 1 < TotalCountToRefer) {
                newIndex = newIndex + 1
                dispatch(setActiveMediaItem(listToBeReferred[newIndex]))
                dispatch(setActiveMediaItemIndex(newIndex))
                navigate(`/Media/${listToBeReferred[newIndex].attributes.uniqueId}`, { replace: true, state: null })
                // navigateTo(`/Media/${listToBeReferred[newIndex].attributes.uniqueId}`)
            }

            /** when you are on 9th item, fetch further set of 10 items */
            if (
                (newIndex + 1 === listToBeReferred.length) &&
                (listToBeReferred.length <= TotalCountToRefer)
            ) {
                fetchMediaItems(newIndex + 1)
            }

        }

        if (action === 'previous') {
            if (newIndex - 1 >= 0) {
                newIndex = newIndex - 1

                dispatch(setActiveMediaItem(listToBeReferred[newIndex]))
                dispatch(setActiveMediaItemIndex(newIndex))
                navigate(`/Media/${listToBeReferred[newIndex].attributes.uniqueId}`, { replace: true, state: null })
                // navigateTo(`/Media/${media[newIndex].attributes.uniqueId}`)

            }

        }
    }

    const handleImageUrl = (url: string, size: string) => {
        let imagePath = url.split("/");
        // return `${baseUrl}/${imagePath[1]}/${size}${imagePath[2]}`;
        return `${baseUrlS3}/${size}${imagePath[3]}`;
    }

    const menuItems = [
        {
            label: "Edit",
            action: () => {
                setEdit({ record: mediaDetails, type: "Media" });
                // handleClose()
            },
        }
    ]
    if (itemDeleteAccess) {
        
        menuItems.push({
            label: "Delete",
            action: () => {
                dispatch(toggleDeleteConfirmationWindowOpen({
                    flag: true,
                    isAssociatedToPlacesOrEvents: listToBeReferred ? isRecordHavingAssociations(
                        listToBeReferred.filter((item: any) => parseInt(item?.id) === mediaDetails?.id)[0]
                    ) : false,
                }))
                dispatch(setDeleteItemType(MEDIA_TAB_NAME))
                dispatch(setDeletePayload({
                    id: typeof mediaDetails.id === 'string' ? parseInt(mediaDetails.id) : mediaDetails.id
                }))
            },
        })
    }

    return <>
        <Box component="div" className={`${styles['details-page-wrapper']}`}>
            <Box component="div" className={`${styles['img-wrapper']}`} >
                <Box component="div" className={`${styles['arrow-icon']} ${styles['arrow-prev']}`}
                    onClick={e => handleNextOrPrevious(e, 'previous')}
                >
                    <ArrowBackIosNewIcon className={`${styles['']}`} sx={{ color: '#fff' }} />
                </Box>
                <Box component="div" className={`${styles['arrow-icon']} ${styles['arrow-next']}`}
                    onClick={e => handleNextOrPrevious(e, 'next')}
                >
                    <ArrowForwardIosIcon className={`${styles['']}`} sx={{ color: '#fff' }} />
                </Box>

                <Box component="div" className={`${styles['media-player-wrapper']}`}>
                    {/* to-do: api parameter based conditions */}
                    {
                        mediaType === MEDIA_TYPE_IMAGE &&
                        <>
                            {
                                mediaDetails?.object?.url ?
                                    <Box className={`${styles['image']}`} component="img" alt={""} src={
                                        handleImageUrl(mediaDetails.object.url, mediaDetails?.formats?.large ?  "large_" : mediaDetails?.formats?.small ? "small_" : "")
                                    }
                                        style={{
                                            objectFit: (mediaDetails && (mediaDetails?.object.width / mediaDetails?.object.height > 1.5)) ? 'cover' : 'contain'
                                        }}
                                    /> :
                                    <NoImagePresent
                                        className="light-version"
                                        message={NO_IMAGE}
                                        style={{
                                            backgroundColor: 'var(--blank-doc-bg)',
                                            color: 'var(--no-map-bg)',
                                            minHeight: '400px',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    />
                            }
                        </>
                    }
                    {
                        mediaType === MEDIA_TYPE_VIDEO &&
                        <RenderFileData
                            fileData={{
                                alt: "",
                                src: mediaDetails?.object?.url ? (
                                  detectMediaTypeFromMediaDetailPage(mediaDetails) === "image" ?
                                    handleImageUrl(mediaDetails?.object.url, "small_") :
                                    `${mediaDetails?.object.url}`
                                ) : undefined,
                                className: styles['image'],
                                objectURL: mediaDetails?.objectURL || '',
                                videoType: mediaDetails?.videoType,
                                iframeVideoLink: (mediaDetails?.videoType === "url") ? mediaDetails?.referenceURL : undefined,
                                staticVideoLink: (
                                  (detectMediaTypeFromMediaDetailPage(mediaDetails) === "video" || mediaDetails?.videoType === "video") &&
                                  mediaDetails?.object?.url
                                ) ? `${mediaDetails?.object?.url}` : undefined,
                                isOpened: true
                              }}
                            fileType="video"
                        />
                    }
                    {
                        mediaType === MEDIA_TYPE_3D &&
                        <Box component="div" className={`${styles['threeD-model-wrapper']}`}>
                            {/* <ModelViewer
                            /> */}
                            {mediaDetails.objectURL ? parse(mediaDetails.objectURL) : ''}
                        </Box>
                    }
                </Box>
            </Box>
            <Box component="div" className={`${styles['desc']}`} >
                {
                    mediaType === 'image' &&
                    <Grid container className={`${styles['bottom-desc-main-grid']}`}>
                        <Grid container className={`${styles['bottom-desc-row-1']}`} style={{
                            justifyContent: 'space-between'
                        }}>
                            <Grid item sm={12} >
                                <Grid container className={`${styles['title-grid']}`} >
                                    <Grid item>
                                        <Box component="div" className={`${styles['overview-title']}`}>
                                            {title}
                                        </Box>
                                    </Grid>
                                    {featuredImage && <Grid item>
                                        <Box component="div">
                                            <Box component="div" className={`${styles['star-icon-box']}`}>
                                                <Box
                                                    component="img"
                                                    alt={""}
                                                    src={YellowStar}
                                                ></Box>
                                                <Box component="div">Featured</Box>
                                            </Box>
                                        </Box>
                                    </Grid>}
                                    <Grid item sm={1} className={`${styles['more-icon-grid-item']}`} style={{
                                        marginLeft: 'auto'
                                    }}>
                                        {itemAddEditAccess && <CustomMoreOptionsComponent
                                            moreIconClassName={`${styles['more-icon']}`}
                                            menuActions={menuItems}
                                        />}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Box component="div" className={`${styles[`bottom-grid`]} ${styles[`id-row`]}`} >
                                <p>ID: {id}</p>
                                <br />
                                <div>{description}</div>
                            </Box>
                        </Grid>
                        <Grid container style={{
                            justifyContent: 'space-between'
                        }}>
                            <Grid item sm={6} lg={7}>
                                <TextualContent
                                    mediaDetails={mediaDetails}
                                />
                            </Grid>
                            <Grid item sm={6} lg={5} className={`${styles[`map-wrapper`]}`}>
                                {(latitude && longitude) ? <>
                                    <MapView filterId={setIsFilter} key={4} marker={[{
                                        id: 0,
                                        name: `${mediaDetails?.media_associate?.data?.attributes?.place_unique_ids.data !== null ?
                                            mediaDetails?.media_associate?.data?.attributes?.place_unique_ids?.data[0]?.attributes.placeNameEnglish
                                            : ''}`,
                                        position: {
                                            lat: latitude || 24.11,
                                            lng: longitude || 34.98
                                        }
                                    }]}
                                        zoom={10}
                                    />
                                    <Grid container className={`${styles['map-loctn-details']}`} >
                                        <Grid item lg={5} md={5} sm={5}>
                                            <Grid container className={`${styles['map-loctn-line']}`}>
                                                <Grid item style={{ fontWeight: 'bold' }} >Latitude</Grid>
                                                <Grid item>{`${toFixedFromString(latitude, 6)}`}</Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item lg={5} md={5} sm={6}>
                                            <Grid container className={`${styles['map-loctn-line']}`}>
                                                <Grid item style={{ fontWeight: 'bold' }} >Longitude</Grid>
                                                <Grid item>{`${toFixedFromString(longitude, 6)}`}</Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid> </>
                                    :
                                    <NoMapPresent
                                        className="light-version"
                                        message={NO_LOCATION}
                                        style={{
                                            backgroundColor: 'var(--blank-doc-bg)',
                                            color: 'var(--no-map-bg)'
                                        }}
                                    />}
                            </Grid>
                        </Grid>
                    </Grid>
                }
                {
                    mediaType === 'video' &&
                    <Box component="div" className={`${styles[`line-height-1dot5`]}`}>
                        <Grid container className={`${styles[`video-title-grid`]}`} style={{
                            alignItems: 'start'
                        }}>
                            <Grid item sm={9} className={`${styles[`video-title`]}`}>
                                {title}
                            </Grid>
                            <Grid item sm={1} className={`${styles['more-icon-grid-item']}`} style={{
                                marginLeft: 'auto'
                            }}>

                                {itemAddEditAccess && <CustomMoreOptionsComponent
                                    moreIconClassName={`${styles['more-icon']}`}
                                    menuActions={menuItems}
                                />}
                            </Grid>
                        </Grid>
                        <Box component="div" className={`${styles[`video-desc`]}`}>
                            {description}
                        </Box>
                        <Grid container style={{
                            justifyContent: 'space-between'
                        }}>
                            <Grid item sm={6} lg={7}>
                                <TextualContent
                                    mediaDetails={mediaDetails}
                                />
                            </Grid>
                            <Grid item sm={6} lg={5} className={`${styles[`map-wrapper`]}`}>
                                {(latitude && longitude) ? <>
                                    <MapView filterId={setIsFilter} key={4} marker={[{
                                        id: 0,
                                        name: `${mediaDetails?.media_associate?.data?.attributes?.place_unique_ids.data !== null ?
                                            mediaDetails?.media_associate?.data?.attributes?.place_unique_ids?.data[0]?.attributes.placeNameEnglish
                                            : ''}`,
                                        position: {
                                            lat: latitude || 24.11,
                                            lng: longitude || 34.98
                                        }
                                    }]}
                                        zoom={10}
                                    />
                                    <Grid container className={`${styles['map-loctn-details']}`} >
                                        <Grid item lg={5} md={5} sm={5}>
                                            <Grid container className={`${styles['map-loctn-line']}`}>
                                                <Grid item style={{ fontWeight: 'bold' }} >Latitude</Grid>
                                                <Grid item>{`${toFixedFromString(latitude, 6)}`}</Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item lg={5} md={5} sm={6}>
                                            <Grid container className={`${styles['map-loctn-line']}`}>
                                                <Grid item style={{ fontWeight: 'bold' }} >Longitude</Grid>
                                                <Grid item>{`${toFixedFromString(longitude, 6)}`}</Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid> </>
                                    :
                                    <NoMapPresent
                                        className="light-version"
                                        message={NO_LOCATION}
                                        style={{
                                            backgroundColor: 'var(--blank-doc-bg)',
                                            color: 'var(--no-map-bg)'
                                        }}
                                    />}
                            </Grid>
                        </Grid>
                    </Box>
                }
                {
                    mediaType === '3d' &&
                    <Box component="div" className={`${styles[`line-height-1dot5`]}`}>
                        <Grid container className={`${styles[`three-d-model-title-grid`]}`} style={{
                            alignItems: 'start'
                        }}>
                            <Grid item sm={9} className={`${styles[`three-d-model-title`]}`}>
                                {title}
                            </Grid>
                            <Grid item sm={1} className={`${styles['more-icon-grid-item']}`} style={{
                                marginLeft: 'auto'
                            }}>
                                {itemAddEditAccess && <CustomMoreOptionsComponent
                                    moreIconClassName={`${styles['more-icon']}`}
                                    menuActions={menuItems}
                                />}
                            </Grid>
                        </Grid>
                        <Box component="div" className={`${styles[`three-d-modeldesc`]}`}>
                            {description}
                        </Box>
                        <Box component="div">
                            <TextualContent
                                mediaDetails={mediaDetails}
                            />
                        </Box>
                    </Box>
                }

            </Box>
        </Box>
    </>
}

export default MediaDetailsPage