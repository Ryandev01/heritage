import { useDispatch } from "react-redux";
import {Box, Grid, Button} from "@mui/material";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import {
  SearchResultTabsProps,
  tabNameProps,
} from "../../types/SearchResultsTabsProps";
import Header from "../../components/Header";
import SearchResultTabs from "../../components/SearchResultTabs";
import useEvent from "../../hooks/useEvent";
import usePlace from "../../hooks/usePlace";
import useLibrary from "../../hooks/useLibrary";
import useMedia from "../../hooks/useMedia";
import { useEffect, useState } from 'react';

import {
  setActiveTab,
  setAddNewItemWindowType,
  setAllPlaces,
  setDeleteItemType,
  setSearchApply,
  toggleAddItemWindowMinimized,
  toggleDeleteItemSuccess,
  toggleShowAddSuccess,
  toggleShowEditSuccess
} from "../../store/reducers/searchResultsReducer";
import PositionedSnackbar from "../../components/Snackbar";
import { EVENTS_TAB_NAME, getSingleInventoryNameFromTabName, PLACES_TAB_NAME } from "../../utils/services/helpers";
import {setSearchText, } from '../../store/reducers/searchResultsReducer';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import styles from './index.module.css'

const SearchResults = ({ tabIndex }: SearchResultTabsProps) => {
  let { tabName, uniqueId } = useParams<{ tabName?: tabNameProps, uniqueId?: string}>();
  const navigate = useNavigate();
  // const { searchText, activeTab, newItemWindowOpen, showAddSuccess } =
  const { searchText, showAddSuccess,deleteItemType, showEditSuccess, deleteItemSuccess,
    successInventoryName, places, addNewItemWindowType } =
    useSelector((state: RootState) => state.searchResults);
  const {lastAdded} = useSelector((state: RootState) => state.tabEdit);
  const { fetchEvents, clearSearch: clearEventSearch, setEdit: setEditEvents } = useEvent();
  const { fetchLibraryItems, setEdit: setEditLibrary } = useLibrary();
  const { fetchPlaces, clearSearch: clearPlaceSearch, setEdit: setEditPlaces, fetchPlacesDirect, dataDirect } = usePlace();
  const { fetchMediaItems, setEdit: setEditMedia } = useMedia();

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      /** default set tabname in store */
      tabName
    ) {
      dispatch(setActiveTab(tabName));
    }
  }, []);

  useEffect(() => {
    if(
      places &&
      places.length > 0
    ) {
      dispatch(setAllPlaces(places))
    }
  }, [])

  useEffect(() => {
    if(
      addNewItemWindowType &&
      (addNewItemWindowType === EVENTS_TAB_NAME)
    ) {

      fetchPlacesDirect(0)
    }
  }, [addNewItemWindowType])

  useEffect(() => {
    dispatch(setAllPlaces(dataDirect))
  }, [dataDirect])


  const handleSubmit = () => {
    switch (tabName) {
      case "Places":
        fetchPlaces(0, true);
        break;
      case "Events":
        fetchEvents(0, true);
        break;
      case "Library":
        fetchLibraryItems(0, true);
        break;
      case "Media":
        fetchMediaItems(0, true);
        break;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && searchText.trim().length >= 3) {
      handleSubmit();
      e.preventDefault();
      dispatch(setSearchApply(true));
      navigate({
        pathname: `/${tabName}`,
        search: decodeURIComponent(JSON.stringify({
          search: searchText
        }))
      });
    }
  };

  /**on click on cross icon on global search text input */
  const handleClearSearchText = async () => {
    await dispatch(setSearchText(""));
    await dispatch(setSearchApply(false));
    switch (tabName) {
      case "Places":
        clearPlaceSearch();
        break;
      case "Events":
        clearEventSearch();
        break;
      case "Library":
        fetchLibraryItems(0, true, true);
        break;
      case "Media":
        fetchMediaItems(0, true, true);
        break;
    }
    navigate({
      pathname: `/${tabName}`,
    });
  };

  const handleLogo = async () => {
    await dispatch(setSearchText(""));
    await navigate("/");
  };

  const handleEdit = () => {
    if (lastAdded) {
      let record = {}
      switch (lastAdded.tab) {
        case 'Media':
          setEditMedia({attributes: {
            uniqueId: lastAdded.data.attributes.uniqueId
          }});
          break;
        case 'Library':
          setEditLibrary({record: {attributes: {
            uniqueId: lastAdded.data.attributes.uniqueId
          }}, type: 'Library'})
          break;
        case 'Events':
          setEditEvents({record: {attributes: {
            uniqueId: lastAdded.data.attributes.uniqueId
          }}, type: 'Events'})
          break;
        case 'Places':
          setEditPlaces({record: {attributes: {
            uniqueId: lastAdded.data.attributes.uniqueId
          }}, type: 'Places'})
          break;
      }
      dispatch(toggleShowAddSuccess(false));
      return record;
    }
  }

  const ContinueEditing = () => {
    
    return <Box component="div">
      <Grid container style={{
        gap: '10px',
        alignItems: 'center'
      }}>
        <Grid item>{`New ${getSingleInventoryNameFromTabName(successInventoryName).toLowerCase()} added.`}</Grid>
        <Grid item className={`${styles['continue-btn']}`}>
          <Button variant="text" onClick={e => {
              handleEdit();
           }}
            startIcon={<CreateOutlinedIcon fontSize="small" />}
            style={{
              minWidth: 'fit-content',
              padding: 0,
              color: '#fff',
              borderColor: '#fff',
              fontSize: 'smaller'
            }}
            sx={{
              '& .MuiButton-startIcon': {
                marginRight: '2px'
              }
            }}
          >CONTINUE EDITING</Button>
        </Grid>
      </Grid>
    </Box>
  }

  const successMessage = () => {
    let screen = 'Place';
    switch (successInventoryName) {
      case 'Events':
        screen = 'Event'
        break;
      case 'Library':
        screen = 'Library'
        break;
      case 'Media':
        screen = 'Media'
        break;
    }
    return screen;
  }
  return (
    <>
      <Header
        handleLogo={handleLogo}
        onKeyDown={onKeyDown}
        handleClearSearchText={handleClearSearchText}
        showSearch={true}
      />
      <Box component="div" style={{
        position: 'relative',
        height: '100%'
      }}>
        <SearchResultTabs handleSubmit={handleSubmit} tabIndex={tabIndex} />
      </Box>
      <PositionedSnackbar
        message={<ContinueEditing />}
        severity={"success"}
        open={showAddSuccess && !showEditSuccess}
        handleClose={() => {
          dispatch(toggleShowAddSuccess(false))
          dispatch(setAddNewItemWindowType(null))
          dispatch(toggleAddItemWindowMinimized(false))
        }}
        duration={10000}
      />
      <PositionedSnackbar
        message={`${successMessage()} updated`}
        severity={"success"}
        open={showEditSuccess}
        handleClose={() => {
          dispatch(toggleShowEditSuccess(false))
          dispatch(setAddNewItemWindowType(null))
          dispatch(toggleAddItemWindowMinimized(false))
        }}
        duration={5000}
      />
      <PositionedSnackbar
        message={`${getSingleInventoryNameFromTabName(deleteItemType ?? 'Places')} deleted`}
        severity={"success"}
        open={deleteItemSuccess}
        handleClose={() => {
          dispatch(setDeleteItemType(null))
          dispatch(toggleDeleteItemSuccess(false))
        }}
        duration={5000}
      />
    </>
  );
};

export default SearchResults;
