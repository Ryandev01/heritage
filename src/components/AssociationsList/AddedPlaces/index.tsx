import {
    Box
} from "@mui/material";
import { AddPlaceAssociationTypes } from "../../../types/AddItemTypes";
import styles from '../index.module.css'
import { useDispatch } from "react-redux";
import { modifyAssociatedPlaces } from "../../../store/reducers/searchResultsReducer";
import { InventoryAssociationType } from "../../../types/SearchResultsTabsProps";
import PlaceInventoryItem from "../ItemRowPlaces";

const AddedPlaces = ({
    list
}: AddPlaceAssociationTypes) => {

    const dispatch = useDispatch()

    const handleRemoveItem = (e: React.MouseEvent, id: number) => {
        dispatch(modifyAssociatedPlaces({
            newItem: null,
            removeId: id
        }))
    }

    if(list.length === 0) return <></>

    return (
        <Box component="div" className={`${styles["added-places"]}`}>
            <Box component="div" className={`${styles["title"]}`}>Places</Box>
            <Box component="div" className={`${styles["list"]}`}>
                {
                    list?.map((place: InventoryAssociationType, indx: number) => (
                        <Box component="div" key={indx}>
                            <PlaceInventoryItem
                                item={{
                                    id: Number(place.id),
                                    placeNameEnglish: place.placeNameEnglish,
                                    placeNameArabic: place.placeNameArabic,
                                    placeNumber: place.placeNumber,
                                    keywords: place.keywords,
                                    previousMediaPresent: place.previousMediaPresent
                                }}
                                handleRemoveItem={handleRemoveItem}
                            />
                        </Box>
                    ))
                }
            </Box>
        </Box>
    );
}

export default AddedPlaces;