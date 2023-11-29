import { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";  
import { PlaceApi, Place } from '../../../../types/Place';
import { Event } from '../../../../types/Event';
import { getRole } from "../../../../utils/storage/storage";
import { tabNameProps } from '../../../../types/SearchResultsTabsProps';
import { Media } from '../../../../types/Media';
import { useDispatch } from 'react-redux';
import { setDeleteItemType, setDeletePayload, toggleDeleteConfirmationWindowOpen } from '../../../../store/reducers/searchResultsReducer';
import { EVENTS_TAB_NAME, isRecordHavingAssociations, LIBRARY_TAB_NAME, PLACES_TAB_NAME, itemAddEditAccess,
    itemDeleteAccess } from '../../../../utils/services/helpers';
import { useParams } from 'react-router-dom';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';

const MoreOptionsComponent = ({
    type,
    record,
    setEdit
}: {
    type: tabNameProps
    record: any;
    setEdit: (payload: {record: PlaceApi | Place | Media | Event, type: tabNameProps}) => void
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const dispatch = useDispatch();
    const open = Boolean(anchorEl);
    const handleClick = (e: any) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };
    const { library } = useSelector(
        (state: RootState) => state.searchResults
    );
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { tabName} = useParams<{ tabName: tabNameProps }>();

    return (
        <>
            <div
                className=""
                onClick={handleClick}
                style={{
                    display: 'flex',
                    justifyContent: 'end'
                }}
            >
                <MoreHorizIcon className="more-menu-div" />
            </div>
            {itemAddEditAccess && <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem
                    key={1}
                    onClick={(e) => {
                        e.stopPropagation();
                        setEdit({record, type});
                        handleClose();
                    }}
                >
                    Edit
                </MenuItem>
                {itemDeleteAccess && <MenuItem key={2}
                    onClick={(e) => {
                        e.stopPropagation();

                        /** keyToCompare is needed since this MoreOption component is used in list as well as 
                         * details page, hence both the delete objects are different
                         */
                        const keyToCompare:string = record ? (
                            record.uniqueId && record.id ? record.id : (
                                record.id && record.attributes?.uniqueId ? record.id : (
                                    record.id && record.media_unique_id?.id ? record.media_unique_id?.id : ''
                                )
                            ) 
                        ): ''

                        dispatch(toggleDeleteConfirmationWindowOpen({
                            flag: true,
                            isAssociatedToPlacesOrEvents: type === "Library" ? isRecordHavingAssociations(
                                library.filter(item => item?.id === keyToCompare.toString())[0]
                            ) : false,
                        }))
                        dispatch(setDeleteItemType(
                            type === "Library" ? LIBRARY_TAB_NAME : type === "Events" ? EVENTS_TAB_NAME : PLACES_TAB_NAME
                            ))
                        dispatch(setDeletePayload({
                            id: tabName === PLACES_TAB_NAME ? (
                                (type === "Events") ? record?.visit_unique_id?.id : 
                                (type === "Library") ? record?.media_unique_id?.id : record.id
                            ) : record.id,
                            
                        }))
                        handleClose();
                    }}
                >
                   Delete
                </MenuItem>}
            </Menu>}
        </>
    );
};

export default MoreOptionsComponent;


