import { AppBar, Toolbar, Box, Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { ConfirmationModalTypes } from '../../types/CustomModalTypes';
import modalStyles from './index.module.css';
import CloseIcon from '@mui/icons-material/Close';
import Button from "../../components/Button";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleConfirmOpenEdit } from '../../store/reducers/searchResultsReducer';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { tabNameProps } from '../../types/SearchResultsTabsProps';
import { EVENTS_TAB_NAME, getSingleInventoryNameFromTabName, LIBRARY_TAB_NAME, MEDIA_TAB_NAME, PLACES_TAB_NAME } from '../../utils/services/helpers';
import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import useLogout from '../../hooks/useLogout';

const addSx = {
    '& .MuiButtonBase-root.MuiCheckbox-root': {
        padding: '5px',
        paddingTop: 0,
        color: 'var(--orange-shade)'
    },
    '& .MuiFormControlLabel-root': {
        alignItems: 'start',
        marginRight: 0,
        marginBottom: '10px'
    }
}
const DeleteInventoryForm = ({
    checkEnabled
}: { checkEnabled: (val: boolean) => void }) => {
    const { deleteItemType } = useSelector((state: RootState) => state.searchResults);

    const assignDefaultState = () => {
        if (deleteItemType === PLACES_TAB_NAME) {
            return [false, false, false, false, false]
        } else if (deleteItemType === EVENTS_TAB_NAME) {
            return [false, false, false, false]
        } else return [false, false, false, false, false]

    }
    const [checkList, setCheckList] = useState<Array<boolean>>(assignDefaultState())


    useEffect(() => {
        if (
            (deleteItemType !== MEDIA_TAB_NAME) &&
            (deleteItemType !== LIBRARY_TAB_NAME)
        ) {
            confirmAllChecked(checkList)
        } else {
            checkEnabled(true)
        }
    }, [])

    useEffect(() => {

        if (
            (deleteItemType !== MEDIA_TAB_NAME) &&
            (deleteItemType !== LIBRARY_TAB_NAME)
        ) {
            confirmAllChecked(checkList)
        } else {
            checkEnabled(true)
        }
    }, [checkList])

    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>, itemNo: number) => {
        setCheckList(state => {
            let newCheckList = [...state]
            newCheckList.fill(!state[itemNo - 1], itemNo - 1, itemNo)
            return newCheckList
        })
    }
    const confirmAllChecked = (checkList_: Array<boolean> | []) => {
        if (checkList_ && (checkList_.length > 0)) {
            checkEnabled(checkList_.every(item => item === true))
        }

    }

    if (deleteItemType === PLACES_TAB_NAME || deleteItemType === EVENTS_TAB_NAME) {

        return <>
            <FormGroup sx={{
                ...addSx
            }}>
                <FormControlLabel className={`${modalStyles['form-control-label']}`} control={
                    <Checkbox className={`${modalStyles['checkbox']}`} checked={checkList[0]} onChange={e => {
                        handleChecked(e, 1)
                    }} />
                }
                    label={`All the ${getSingleInventoryNameFromTabName(deleteItemType).toLowerCase()} information will be deleted`}
                />
                <FormControlLabel className={`${modalStyles['form-control-label']}`} control={
                    <Checkbox className={`${modalStyles['checkbox']}`} checked={checkList[1]} onChange={e => {
                        handleChecked(e, 2)
                    }} />
                }
                    label="All media items linked to this place will be deleted"
                />
                <FormControlLabel className={`${modalStyles['form-control-label']}`} control={
                    <Checkbox className={`${modalStyles['checkbox']}`} checked={checkList[2]} onChange={e => {
                        handleChecked(e, 3)
                    }} />
                }
                    label="All library items linked to this place will be deleted"
                />
                <FormControlLabel className={`${modalStyles['form-control-label']}`} control={
                    <Checkbox className={`${modalStyles['checkbox']}`} checked={checkList[3]} onChange={e => {
                        handleChecked(e, 4)
                    }} />
                }
                    label="All remarks will be deleted"
                />
                {
                    deleteItemType !== EVENTS_TAB_NAME &&
                    <FormControlLabel className={`${modalStyles['form-control-label']}`} control={
                        <Checkbox className={`${modalStyles['checkbox']}`} checked={checkList[4]} onChange={e => {
                            handleChecked(e, 5)
                        }} />
                    }
                        label="All the events linked to this place and their information, library items, media items and remarks will also be deleted"
                    />
                }
            </FormGroup>
        </>
    }

    return <></>

}
export const ConfirmationModal = ({
    type,
    open,
    handleClose,
    handleDelete
}: ConfirmationModalTypes) => {
    const dispatch = useDispatch()
    let { tabName } = useParams<{ tabName?: tabNameProps }>();
    const { isDeleteUserWindowOpen, deleteItemType, isDeleteConfirmationWindowOpen } = useSelector((state: RootState) => state.searchResults);

    const { clientLogout } = useLogout();

    const [enabledFlag, setEnabledFlag] = useState<boolean>(false)

    const modalTypeEdit = type === "confirm-edit"
    const modalTypeDelete = type === "confirm-delete-inventory"
    const modalTypeLogout = type === "confirm-logout"
    const modalTypeDeleteUser = type === "confirm-delete-user"

    return <>
        <Dialog
            open={open}
            onClose={handleClose}
            className={`${modalStyles['dialog-wrapper']}`}
            style={{
                zIndex: 3333
            }}
        >

            <Box component="div" className={`${modalStyles['content']}`} sx={{
            }}>
                <Grid container className={`${modalStyles['title-row']}`} style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: modalTypeLogout ? 'flex-start' : 'flex-end',
                }}>
                    <Grid item className={`${modalStyles['title']}`} sm={11}>
                        {`${
                            modalTypeEdit ? 'Edit' : (modalTypeDelete || modalTypeDeleteUser) ? 'Delete' : 'Adding/editing in Progress'
                        }${ 
                            modalTypeDeleteUser ? ' User' : ''
                        }${
                            (deleteItemType && !modalTypeDeleteUser) ?
                            ` ${getSingleInventoryNameFromTabName(deleteItemType)
                            }${
                                deleteItemType === "Library" || deleteItemType === "Media" ? " Item" : ""
                            }` : ''
                        }`}
                    </Grid>
                    <Grid item sm={1}>
                        <CloseIcon fontSize="large"
                            style={{
                                cursor: 'pointer'
                            }}
                            onClick={handleClose}
                        />
                    </Grid>
                </Grid>
                <Box component="div" className={`${modalStyles['sentence-wrapper']}`}>
                    {
                        isDeleteConfirmationWindowOpen.isAssociatedToPlacesOrEvents &&
                        <Box component="div" className={`${modalStyles[`sentence`]}`} style={{ color: 'var(--orange-shade)' }}>
                            This item is associated with multiple places and/or visits.
                        </Box>
                    }
                    <Box component="div" className={`${modalStyles[`sentence-${modalTypeEdit ? 'Edit' : (modalTypeDelete || modalTypeDeleteUser) ? 'Delete' : 'Logout'}`]}`}>
                        {
                            modalTypeEdit ?
                                `You already have new item being added . Are you sure you still want to edit this item ?` :
                                modalTypeDelete ?
                                    `Are you sure you want to delete this item? This action cannot be undone.` :
                                    modalTypeDeleteUser ?
                                        parse(`<span style="font-weight: bold;">${isDeleteUserWindowOpen?.mailId}</span> will be deleted and will no longer have access to the platform`) :
                                        modalTypeLogout ?
                                            `You are currently adding/editing an item. If you sign out you will lose your changes` :
                                            ``
                        }
                    </Box>
                    {
                        modalTypeDelete &&
                        <DeleteInventoryForm checkEnabled={(val) => setEnabledFlag(val)} />
                    }
                </Box>
                <Box
                    component="div"
                    className={`${modalStyles['btn-row']}`}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: '1em'
                    }}
                >
                    <Button
                        colors={["#fff", "var(--table-black-text)", "none"]}
                        label="Cancel"
                        onClick={(e) => {
                            handleClose(e)
                        }}
                        style={{
                            paddingInline: 0,
                        }}
                    />
                    <Button
                        colors={[
                            modalTypeLogout ? "var(--table-black-text)" : "var(--orange-shade)",
                            "#fff",
                            "none"]
                        }
                        label={modalTypeEdit ? 'Edit' : (modalTypeDelete || modalTypeDeleteUser) ? 'Delete' : 'Sign Out'}
                        disabled={modalTypeDelete ? !enabledFlag : false}
                        type="button"
                        onClick={e => {
                            if (modalTypeEdit) {
                                dispatch(toggleConfirmOpenEdit(true))
                                handleClose(e)
                            }
                            if ((modalTypeDelete || modalTypeDeleteUser) && handleDelete) {
                                handleDelete()

                                if(modalTypeDeleteUser) {
                                    handleClose(e)
                                }
                            }
                            if (modalTypeLogout) {
                                handleClose(e)
                                clientLogout()
                            }

                        }}
                    />
                </Box>
            </Box>
        </Dialog>
    </>
}