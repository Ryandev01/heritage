
import { Box, Grid, Button } from '@mui/material';
import YellowStar from '../../../../assets/images/searchResults/YellowStar.svg'
import styles from './index.module.css';
// import { useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { CustomModal } from '../../../CustomModal';
import { tabNameProps } from '../../../../types/SearchResultsTabsProps';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveMediaItemIndex, setActiveMediaItem, toggleGalleryView} from '../../../../store/reducers/searchResultsReducer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useHistory } from '../../../../hooks/useHistory';
import MediaDetailsPage from './Details';

export const MediaDetailsModal = () => {

    const [isModalOpen, setModalOpen] = useState<boolean>(true)

    const { media, activeMediaItem, activeMediaItemIndex, activeEventItem, totalCounts, openGalleryView, placeMetaData } = useSelector(
        (state: RootState) => state.searchResults
    )
    let { tabName } = useParams<{ tabName?: tabNameProps }>();

    const location = useLocation()

    const dispatch = useDispatch();
    const {goBack} = useHistory();
    const navigate = useNavigate();

    // const TotalMediaCount= (activeEventItem && activeEventItem?.visit_unique_id) ? activeEventItem.visit_unique_id.media_associates: 0
    const TotalMediaCount = openGalleryView.flag ? openGalleryView.galleryViewItemList.length :
        totalCounts ? totalCounts?.media :
            (activeEventItem && activeEventItem?.visit_unique_id) ? activeEventItem.visit_unique_id.media_associates
                : media ? media.length : 0


    const handleClose = () => {
        setModalOpen(false)
        dispatch(setActiveMediaItem(null))
        dispatch(setActiveMediaItemIndex(0))
        // navigate(`/Media`, { replace: true, state: null })
        goBack()
    }

    const showVisitCount = (location.state && location.state.from === 'events') && activeMediaItem

    return <>
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
                    <Grid item sm={6}>
                        {/* {mediaDetails?.attributes?.title.substring(0, 30)} {
                            showVisitCount ? '- static count 1' : ''
                        } */}
                        <Button variant="text" type="button"
                            className={`${styles["back-nav"]}`}
                            startIcon={<KeyboardArrowLeftIcon fontSize="small" />}
                            style={{
                                color: 'var(--medium-gray',
                                textTransform: 'none'
                            }}
                            onClick={e => {
                                e.preventDefault()
                                setModalOpen(false)
                                /** resetters */
                                dispatch(setActiveMediaItem(null))
                                dispatch(setActiveMediaItemIndex(0))
                                // navigate(`/${tabName}`, { replace: true })
                                goBack()

                                if(openGalleryView.flag) {
                                    /**reset item list */
                                    dispatch(toggleGalleryView({
                                        flag: openGalleryView.flag,
                                        galleryViewItemList: []
                                    }))
                                }
                            }}
                        >
                            Back
                        </Button>
                    </Grid>
                    <Grid
                        item
                        style={{
                            position: "absolute",
                            left: "50%",
                            right: "50%",
                        }}
                    >
                        {`${activeMediaItemIndex + 1}/${TotalMediaCount}`}
                    </Grid>
                </Grid>
            }
            handleClose={() => handleClose()}
        >
            <MediaDetailsPage
                currentItemIndex={activeMediaItemIndex}
                handleClose={handleClose}
            />
        </CustomModal>
    </>
}