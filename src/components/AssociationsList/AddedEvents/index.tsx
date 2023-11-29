import {
    Box
} from "@mui/material";
import { AddEventAssociationTypes } from "../../../types/AddItemTypes";
import styles from '../index.module.css'
import { useDispatch } from "react-redux";
import { modifyAssociatedEvents } from "../../../store/reducers/searchResultsReducer";
import { InventoryAssociationType_Event } from "../../../types/SearchResultsTabsProps";
import EventInventoryItem from "../ItemRowEvents";

const AddedEvents = ({
    list
}: AddEventAssociationTypes) => {

    const dispatch = useDispatch()

    const handleRemoveItem = (e: React.MouseEvent, id: string) => {
        dispatch(modifyAssociatedEvents({
            newItem: null,
            removeId: id
        }))
    }

    if (list.length === 0) return <></>

    return (
        <Box component="div" className={`${styles["added-places"]}`}>
            <Box component="div" className={`${styles["title"]}`}>Events</Box>
            <Box component="div" className={`${styles["list"]}`}>
                {
                    list?.map((event: InventoryAssociationType_Event, indx: number) => (
                        <Box component="div" key={indx}>
                            <EventInventoryItem
                                item={{
                                    id: event.id,
                                    visitNumber: event.visitNumber,
                                    placeNameEnglish: event.placeNameEnglish,
                                    placeNameArabic: event.placeNameArabic,
                                    placeNumber: event.placeNumber,
                                    keywords: event.keywords,
                                    previousMediaPresent: event.previousMediaPresent,
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

export default AddedEvents;