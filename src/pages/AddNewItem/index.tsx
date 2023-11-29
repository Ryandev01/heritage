import { Box, Typography, Button as DefaultButton, Grid, Avatar } from "@mui/material";
import { AddNewItemPaneProps } from "../../types/CustomDrawerTypes";
import placeStyles from '../../components/SearchResultTabs/Places/AddNewItem/addNewItem.module.css'
import styles from './index.module.css'
import Button from "../../components/Button";
import PlacesIcon from '../../assets/images/searchResults/Places.svg'
import EventsIcon from '../../assets/images/searchResults/Events.svg'
import LibraryIcon from '../../assets/images/searchResults/Library.svg'
import MediaIcon from '../../assets/images/searchResults/Media.svg'
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";
import { resetMediaAssociation, setAddNewItemWindowType } from "../../store/reducers/searchResultsReducer";
import { EVENTS_TAB_NAME, LIBRARY_TAB_NAME, MEDIA_TAB_NAME, PLACES_TAB_NAME } from "../../utils/services/helpers";

const StepContent = () => {
    const dispatch = useDispatch()

    return <Box component="div">
        <Grid container className={`${styles['tab-name-tile-row']}`}>
            <Grid item sm={4} className={`${styles['tab-name-tile']}`}
                onClick={e => {
                    dispatch(setAddNewItemWindowType(PLACES_TAB_NAME))
                    dispatch(resetMediaAssociation(null))
                }}
            >
                <Box
                    component="img"
                    src={PlacesIcon}
                    alt="places icon"
                />
                <Box component="div">Places</Box>
            </Grid>
            <Grid item sm={4} className={`${styles['tab-name-tile']}`}
                onClick={e => {
                    dispatch(setAddNewItemWindowType(EVENTS_TAB_NAME))
                    dispatch(resetMediaAssociation(null))
                }}
            >
                <Box
                    component="img"
                    src={EventsIcon}
                    alt="Events icon"
                />
                <Box component="div">Events</Box>
            </Grid>
            <Grid item sm={4} className={`${styles['tab-name-tile']}`}
                onClick={e => {
                    dispatch(setAddNewItemWindowType(LIBRARY_TAB_NAME))
                    dispatch(resetMediaAssociation(null))
                }}
            >
                <Box
                    component="img"
                    src={LibraryIcon}
                    alt="Library icon"
                />
                <Box component="div">Library Item</Box>
            </Grid>
            <Grid item sm={4} className={`${styles['tab-name-tile']}`}
                onClick={e => {
                    dispatch(setAddNewItemWindowType(MEDIA_TAB_NAME))
                    dispatch(resetMediaAssociation(null))
                }}
            >
                <Box
                    component="img"
                    src={MediaIcon}
                    alt="Media icon"
                />
                <Box component="div">Media Item</Box>
            </Grid>
        </Grid>
    </Box>
}

const AddNewItem = ({
    onClose
}: AddNewItemPaneProps) => {

    const handleClose = () => {
        onClose()
    }

    return (
        <Box component={"div"} className={`${styles['add-new-item-parent']}`}>
            <Box component="div" className={`${placeStyles['add-new-item-container']}`}>

                <Box component="div" className={`${placeStyles['content-section']}`}>
                    <Box component="div" className={`${placeStyles['hide-btn']}`}
                        style={{
                            marginRight: 0,
                            marginLeft: 'auto',
                            width: 'fit-content'
                        }}>
                        <DefaultButton variant="text" onClick={e => handleClose()}
                            style={{
                                // paddingInline: 0,
                                minWidth: 'fit-content',
                                padding: 0,
                                color: 'var(--table-black-text)'
                            }}
                        >
                            <CloseIcon fontSize="large" />
                        </DefaultButton>
                    </Box>
                    <Typography className={`${placeStyles['add-title']}`} variant="h4" component="h4" style={{
                    }}>
                        Add New Item
                    </Typography>
                    <>
                        <StepContent
                        />
                    </>
                </Box>
                <Box component="div"
                    className={`${placeStyles["btn-row"]}`}
                    sx={{
                        display: 'flex', flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <Button
                        colors={["#fff", "var(--table-black-text)", "none"]}
                        className={`${placeStyles["plain-whitee-btn"]}`}
                        label={'Cancel'}
                        onClick={e => handleClose()}
                        style={{
                            paddingInline: 0
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default AddNewItem;