import React, { useState } from "react";
import { Box } from "@mui/material";
import styles from "./index.module.css";
import Logo from "../../pages/UserManagement/img/Logo.svg";
import UserMenuComponent from "./../UserMenu/index";
import { useNavigate } from "react-router-dom";
import CustomSearchField from "../SearchField";
import { ConfirmationModal } from "../ConfirmationModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { setSearchText, toggleDeleteUserSuccess, toggleDeleteUserWindowOpen } from "../../store/reducers/searchResultsReducer";
import { useDispatch } from "react-redux";
import PositionedSnackbar from "../Snackbar";

import { EVENTS_TAB_NAME, LIBRARY_TAB_NAME, MEDIA_TAB_NAME, PLACES_TAB_NAME } from "../../utils/services/helpers";
import { setDeletePayload, toggleAddItemWindowMinimized, toggleAssociationsIconDisabled, toggleAssociationsStepOpen, toggleDeleteConfirmationWindowOpen, toggleDeleteItemSuccess, toggleEditConfirmationWindowOpen, toggleLogoutConfirmationWindowOpen, toggleNewItemWindow } from "../../store/reducers/searchResultsReducer";
import CustomDrawer from "../CustomDrawer";
import AddNewItem from "../../pages/AddNewItem";
import AddNewPlace from "../SearchResultTabs/Places/AddNewItem";
import usePlace from "../../hooks/usePlace";
import AddNewEvent from "../SearchResultTabs/Events/AddNewItem";
import AddNewMedia from "../SearchResultTabs/Media/AddNewItem";
import useEvent from "../../hooks/useEvent";
import AddNewLibraryItem from "../SearchResultTabs/Library/AddNewItem";
import AddItemCollapsedWindow from "../AddItemCollapsedWindow";
import useLibrary from "../../hooks/useLibrary";
import useMedia from "../../hooks/useMedia";
import { deleteRecord } from "../../api/delete";

interface IHeader {
  showSearch?: boolean
  showRefinedSearch?: boolean
  screen?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleClearSearchText?: () => void
  handleLogo?: () => void
}

const Header = (props: IHeader) => {

  const {
    showSearch = false,
    screen,
    onKeyDown,
    handleClearSearchText,
    handleLogo
  } = props
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { createPlace } = usePlace();
  const { createEvent, setSearchValue, searchValue } = useEvent();
  const { createLibrary } = useLibrary();
  const { createMedia } = useMedia();

  const { isDeleteUserWindowOpen, deleteUserSuccess, searchText,
    newItemWindowOpen, addNewItemWindowType, addItemWindowMinimized, isEditConfirmationWindowOpen,
    isDeleteConfirmationWindowOpen, deletePayload, deleteItemType, isLogoutConfirmationWindowOpen
  } = useSelector((state: RootState) => state.searchResults);

  const onHide = () => {
    dispatch(toggleAddItemWindowMinimized(true))
    dispatch(toggleNewItemWindow(false))
  }
  const onClose = () => {
    
    dispatch(toggleAssociationsIconDisabled(false))
    dispatch(toggleAssociationsStepOpen(false))
    dispatch(toggleNewItemWindow(false))
  }

  return (
    <>
      {screen === "landing" ?
        <>
          <Box component="div" sx={{
            position: 'absolute',
            top: '3%',
            right: '0'
          }}>
            <UserMenuComponent screen={screen} />
          </Box>
        </>
        :
        <Box component="div" className={`${styles["header-container"]}`}>
          <Box component="div" className={`${styles["header-lhs-content"]}`}>
            <Box component="div" className={`${styles["logo"]}`}>
              <Box component="img" alt="NEOM logo" src={Logo} onClick={() => navigate('/')} />
            </Box>
            {
              showSearch &&
              <CustomSearchField
                handleChangeParent={(e) => {
                  dispatch(setSearchText(e.target.value));
                }}
                shouldHandleChangeFromParent={true}
                valueFromParent={searchText}
                onKeyDown={onKeyDown}
                handleClearSearchText={handleClearSearchText}
                // className={`${styles["header-search"]}`}
              />
            }
            <UserMenuComponent />
          </Box>
        </Box>}
      <CustomDrawer origin="right" isOpen={newItemWindowOpen} onClose={() => dispatch(toggleNewItemWindow(!newItemWindowOpen))}>
        {!addNewItemWindowType &&
          <AddNewItem onClose={() => onClose()} />
        }
        {
          addNewItemWindowType === PLACES_TAB_NAME && !addItemWindowMinimized &&
          <AddNewPlace create={createPlace} onHide={() => onHide()} />
        }
        {
          addNewItemWindowType === EVENTS_TAB_NAME && !addItemWindowMinimized &&
          <AddNewEvent create={createEvent} setSearchValue={setSearchValue} searchValue={searchValue} onHide={() => onHide()} />
        }
        {
          addNewItemWindowType === LIBRARY_TAB_NAME && !addItemWindowMinimized &&
          <AddNewLibraryItem create={createLibrary} onHide={() => onHide()} />
        }
        {
          addNewItemWindowType === MEDIA_TAB_NAME && !addItemWindowMinimized &&
          <AddNewMedia create={createMedia} onHide={() => onHide()} />
        }
      </CustomDrawer>
      {
        addNewItemWindowType &&
        addItemWindowMinimized &&
        <AddItemCollapsedWindow />
      }
      {
        (
          isEditConfirmationWindowOpen ||
          isDeleteConfirmationWindowOpen.flag ||
          isLogoutConfirmationWindowOpen
        ) &&
        <ConfirmationModal
          type={
            isEditConfirmationWindowOpen ?
              "confirm-edit" :
              isLogoutConfirmationWindowOpen ?
                'confirm-logout' :
                "confirm-delete-inventory"
          }
          open={
            isEditConfirmationWindowOpen ||
            isDeleteConfirmationWindowOpen.flag ||
            isLogoutConfirmationWindowOpen
          }
          handleClose={() => {
            if (isEditConfirmationWindowOpen) {
              dispatch(toggleEditConfirmationWindowOpen(false))
            }
            if (isDeleteConfirmationWindowOpen.flag) {
              dispatch(toggleDeleteConfirmationWindowOpen({
                flag: false,
                isAssociatedToPlacesOrEvents: false,
              }))
            }
            if (isLogoutConfirmationWindowOpen) {
              dispatch(toggleLogoutConfirmationWindowOpen(false))
            }
            dispatch(setDeletePayload(null))
          }}
          handleDelete={
            async () => {
              if (deletePayload && deleteItemType) {

                const type = deleteItemType === 'Places' ? 'place' :
                  deleteItemType === 'Events' ? 'event' :
                    deleteItemType === 'Media' ? 'media' : 'library'

                const res: { success: boolean } = await deleteRecord(type, deletePayload.id)

                if (res.success) {
                  /**call this on delete api success */
                  dispatch(setDeletePayload(null))
                  dispatch(toggleDeleteConfirmationWindowOpen({
                    flag: false,
                    isAssociatedToPlacesOrEvents: false,
                  }))
                  dispatch(toggleDeleteItemSuccess(true))
                }

              }
            }
          }
        />
      }
      <ConfirmationModal
        type={"confirm-delete-user"}
        open={isDeleteUserWindowOpen?.flag}
        handleClose={() => {
            dispatch(toggleDeleteUserWindowOpen({
              flag: false
            }))
        }}
        handleDelete={
          () => {
            dispatch(toggleDeleteUserSuccess(true))
          }
        }
      />
      <PositionedSnackbar
        message={`User deleted`}
        severity={"success"}
        open={deleteUserSuccess}
        handleClose={() => {
          dispatch(toggleDeleteUserSuccess(false))
          dispatch(toggleDeleteUserWindowOpen({
            flag: false,
            mailId: ''
          }))
        }}
        duration={5000}
      />
    </>
  );
};

export default Header;
