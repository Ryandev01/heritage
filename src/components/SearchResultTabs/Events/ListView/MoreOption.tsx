import { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Event } from '../../../../types/Event';
import { Media } from '../../../../types/Media';
import { tabNameProps } from '../../../../types/SearchResultsTabsProps';
import { MediaAssociateObj } from '../../../../types/Place';
import { useDispatch } from 'react-redux';
import { setDeleteItemType, setDeletePayload, toggleDeleteConfirmationWindowOpen } from '../../../../store/reducers/searchResultsReducer';
import { EVENTS_TAB_NAME, isRecordHavingAssociations, LIBRARY_TAB_NAME, MEDIA_TAB_NAME, itemAddEditAccess, itemDeleteAccess } from '../../../../utils/services/helpers';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';


const MoreOptionsComponent = ({
    type,
    record,
    setEdit,
    setFeaturedMedia
}: {
    type: tabNameProps;
    record: any;
    setEdit: (payload: { record: Event | Media | MediaAssociateObj, type: tabNameProps }) => void
    setFeaturedMedia?: (payload: any) => void
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const handleClick = (e: any) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };
    const dispatch = useDispatch();
    const { tabName } = useParams<{ tabName: tabNameProps }>();
    const { library, media } = useSelector(
        (state: RootState) => state.searchResults
    )
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div
                className=""
                onClick={handleClick}
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
                {type === "Media" && setFeaturedMedia && <MenuItem
                    key={1}
                    onClick={(e) => {
                        e.stopPropagation();
                        setFeaturedMedia(record);
                        handleClose();
                    }}
                >
                    Featured
                </MenuItem>}
                <MenuItem
                    key={1}
                    onClick={(e) => {
                        e.stopPropagation();
                        setEdit({ record: record, type });
                        handleClose();
                    }}
                >
                    Edit
                </MenuItem>
                {itemDeleteAccess && <MenuItem key={2}
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleDeleteConfirmationWindowOpen({
                            flag: true,
                            isAssociatedToPlacesOrEvents: type === "Media" ? isRecordHavingAssociations(
                                media.filter(item => item?.id === record?.media_unique_id?.id?.toString())[0]
                            ) : type === "Library" ? isRecordHavingAssociations(
                                library.filter(item => item?.id === record?.media_unique_id?.id?.toString())[0]
                            ) : false,
                        }))
                        dispatch(setDeleteItemType(
                            type === "Library" ? LIBRARY_TAB_NAME : type === "Events" ? EVENTS_TAB_NAME : MEDIA_TAB_NAME 
                        ))

                        dispatch(setDeletePayload({
                            id: tabName === EVENTS_TAB_NAME ? (
                                (type === "Media" || type === "Library") ?  record?.media_unique_id?.id : 
                                typeof record.id === 'string' ? parseInt(record.id) : record.id
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

