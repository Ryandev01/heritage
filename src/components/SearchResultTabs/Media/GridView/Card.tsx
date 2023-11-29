
import Box from '@mui/material/Box';
import { GridViewCard_Media } from '../../../../types/SearchResultsTabsProps'
import gridStyles from './index.module.css'
import styles from './index.module.css'
import { Grid } from '@mui/material';
import { MoreOptionsComponent } from "../ListView/MoreOption";
// import { usePaginatedArray } from '../../../../hooks/usePaginatedArray';
/** indicating that we can send html later on wherever we parse */
import { baseUrl, baseUrlS3, detectMediaTypeFromMediaList, itemAddEditAccess } from '../../../../utils/services/helpers';
import RenderFileData from '../../../RenderFileData';

export const Card = ({
    setEdit,
    record
}: GridViewCard_Media) => {

    const handleImageUrl = (url: string, size: string) => {
            // let imagePath = url.split("/");
            // return `${baseUrl}/${imagePath[1]}/${size}${imagePath[2]}`;
        let imagePath = url.split("/");
        // return `${baseUrl}/${imagePath[1]}/${size}${imagePath[2]}`;
        return `${baseUrlS3}/${size}${imagePath[3]}`;
    }


    return <>
        <Box component="div" className={`${gridStyles['card-container']}`} >
            <Grid container className={`${gridStyles['card-grid']}`}>
                <Grid item sm={12} className={`${gridStyles['card-image-wrapper']}`}>
                    <RenderFileData
                        fileData={{
                            alt: "",
                            src: record?.attributes?.object?.data?.attributes?.url ? (
                                detectMediaTypeFromMediaList(record) === "image" ?
                                    handleImageUrl(record.attributes.object.data.attributes.url, "small_") :
                                    `${record.attributes.object.data.attributes.url}`
                            ) : undefined,
                            className: detectMediaTypeFromMediaList(record) === "video" ?
                                `${styles['video-card-parent']}` : detectMediaTypeFromMediaList(record) === "image" ?
                                    `${gridStyles['card-image']}` : `${styles['three-d-card-parent']}`,
                            objectURL: record?.attributes.objectURL || '',
                            videoType: record?.attributes.videoType,
                            iframeVideoLink: (record?.attributes.videoType === "url") ? record?.attributes.referenceURL : undefined,
                            staticVideoLink: (
                                (detectMediaTypeFromMediaList(record) === "video" || record?.attributes.videoType === "video") &&
                                record?.attributes.object?.data?.attributes?.url
                            ) ? `${record?.attributes.object?.data?.attributes?.url}` : undefined,
                            isOpened: false
                        }}
                        fileType={detectMediaTypeFromMediaList(record)}

                    />
                </Grid>
                <Grid item sm={12} className={`${gridStyles['content']}`}>
                    <Grid container>
                        <Grid item>
                            <div className={`${gridStyles['card-title']}`}>{record.attributes.title}</div>
                        </Grid>
                        <Grid item>
                            <Box className={`${gridStyles["more-icon-span"]}`} component={"span"}>
                                <Box
                                    className={`${gridStyles["more-icon"]}`}
                                    component={"span"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('click on more')
                                    }}
                                >
                                    {itemAddEditAccess && <MoreOptionsComponent setEdit={setEdit} record={record} id={record.id} />}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </>
}