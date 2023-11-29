import {
    Box,
    Grid,
    Button
} from "@mui/material";
import { PlaceInventoryItemTypes } from "../../../types/AddItemTypes";
import styles from '../index.module.css'
import CloseIcon from '@mui/icons-material/Close';

const PlaceInventoryItem = ({
    item,
    handleRemoveItem
}: PlaceInventoryItemTypes) => {

    return (
        <Box component="div" className={`${styles["inventory-item"]}`}>
            <Grid container className={`${styles['container']}`}>
                <Grid item>{item.placeNameEnglish}</Grid>
                <Grid item>{item.placeNameArabic}</Grid>
                <Grid item className={`${styles["right-section"]}`} sx={{
                        marginLeft: 'auto'
                    }}>
                    <Grid container className={`${styles['right-container']}`} >
                        <Grid>{item.placeNumber}</Grid>
                        <Grid>
                            <Button variant="text" onClick={e => handleRemoveItem(e, item.id)}
                                style={{
                                    minWidth: 'fit-content',
                                    padding: 0,
                                    color: 'var(--table-black-text)'
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default PlaceInventoryItem;