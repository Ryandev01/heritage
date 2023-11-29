
import { Box, Grid } from '@mui/material';
import styles from './index.module.css';
// import { useState } from 'react';
import { InventoryAssociationType, InventoryAssociationType_Event } from '../../../../types/SearchResultsTabsProps';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useState } from 'react';
import { copyToClipboard, convertKbtoMb } from '../../../../utils/services/helpers';
import dayjs from 'dayjs';
import { MediaApi } from '../../../../types/Media';
import RenderValueWithDefault from '../../../NoDataScreens/DefaultText';
import PositionedSnackbar from '../../../Snackbar';


const TextualContent = ({
    mediaDetails
}: { mediaDetails: MediaApi }) => {
    const locationRef = window.location.href
    const { places } = useSelector(
        (state: RootState) => state.searchResults
    );
    const {
        referenceURL, citation,
        categoryType, Author, bearing
    } = mediaDetails
    const [isCopyDone, setCopyDone] = useState<boolean>(false);

    return <>
        <Box component="div" className={`${styles[`bottom-grid`]}`} >
            <p>Details</p>
            <div>Author: {RenderValueWithDefault(Author)}</div>
            <div>Category Type: {RenderValueWithDefault(categoryType)}</div>
            <div>Bearing: {RenderValueWithDefault(bearing)}</div>
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
        {
            (mediaDetails.object || mediaDetails.media_type) && <Box component="div" className={`${styles[`bottom-grid`]}`} >
                <p>Metadata</p>
                <div>File Name: {RenderValueWithDefault(mediaDetails?.object?.name)}</div>
                <div>
                    <span>Created: <span>{RenderValueWithDefault(`${dayjs(mediaDetails?.createdAt).format("MM/DD/YYYY")}`)}</span></span>
                </div>
                <div>
                    <span>Modified: <span>{RenderValueWithDefault(`${dayjs(mediaDetails?.updatedAt).format("MM/DD/YYYY")}`)}</span></span>
                </div>
                <div>Size: {
                    mediaDetails?.object?.size ?
                        RenderValueWithDefault(convertKbtoMb(mediaDetails?.object?.size)) :
                        RenderValueWithDefault(mediaDetails?.object?.size)
                } {mediaDetails?.object?.size ? 'MB' : ''}</div>

                <div>Storage: {RenderValueWithDefault('')}</div>
                <div>Depth: {RenderValueWithDefault('')}</div>
                <div>Dimensions: {
                    mediaDetails?.object?.width && mediaDetails?.object?.height ?
                        `${mediaDetails?.object?.width} x ${mediaDetails?.object?.height}` :
                        RenderValueWithDefault('')
                }</div>
                <div>Make: {RenderValueWithDefault('')}</div>
                <div>Model: {RenderValueWithDefault('')}</div>
                <div>Extensions: {RenderValueWithDefault(mediaDetails?.object?.ext && mediaDetails?.object?.ext?.replace('.', ''))}</div>
            </Box>
        }
        <Box component="div">
            <p>Associations</p>
            <p>Places</p>
            <Box component="div" className={`${styles[`bottom-grid`]}`}>
                {
                    (mediaDetails.media_associate?.place_unique_ids && (mediaDetails.media_associate?.place_unique_ids?.length > 0)) ?
                        (
                            mediaDetails.media_associate?.place_unique_ids?.map((placeObj: InventoryAssociationType, index: number) => (
                                <div key={index}>
                                    {`${placeObj.placeNameEnglish}${
                                        placeObj.placeNameArabic ? ` ${placeObj.placeNameArabic}` : ''
                                    }${
                                        !placeObj.placeNameEnglish && !placeObj.placeNameEnglish && placeObj.placeNumber ?
                                        `${placeObj.placeNumber}` : ''
                                    }`}
                                </div>
                            ))
                        ) :
                        RenderValueWithDefault('')
                }
            </Box>
            <p>Events</p>
            <Box component="div" className={`${styles[`bottom-grid`]}`}>
                {
                    (mediaDetails.media_associate?.visit_unique_ids && mediaDetails.media_associate?.visit_unique_ids.length > 0) ?
                        (
                            mediaDetails.media_associate?.visit_unique_ids?.map((visitObj: InventoryAssociationType_Event, index: number) => (
                                <>
                                    {
                                        visitObj &&
                                            <div key={index}>
                                                {
                                                    `${visitObj?.visit_associate?.place_unique_id?.placeNameEnglish ?
                                                        visitObj?.visit_associate?.place_unique_id?.placeNameEnglish :
                                                        ""
                                                    }${visitObj?.visit_associate?.place_unique_id?.placeNameArabic ?
                                                        `  ${visitObj?.visit_associate?.place_unique_id?.placeNameArabic}` :
                                                        ""
                                                    }${mediaDetails.media_associate?.visit_unique_ids[index].visitNumber ?
                                                        `  Visit ${mediaDetails.media_associate?.visit_unique_ids[index].visitNumber}` :
                                                        ''
                                                    }`
                                                }
                                            </div>
                                    }
                                </>
                            ))
                        ) :
                        RenderValueWithDefault('')
                }
            </Box>
        </Box>
    </>
}

export default TextualContent
