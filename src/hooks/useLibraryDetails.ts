import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { libraryDetails } from "../api/details";
import { tabNameProps } from "../types/SearchResultsTabsProps";
import { MediaApi } from "../types/Media";
import { setTabData, setTabEdit } from "../store/reducers/tabEditReducer";
import { LIBRARY_TAB_NAME } from '../utils/services/helpers';
import { toggleNewItemWindow, setAddNewItemWindowType, setDefaultMediaAssociation, toggleEditConfirmationWindowOpen, setEditPayload, toggleConfirmOpenEdit, resetMediaAssociation } from "../store/reducers/searchResultsReducer";
import { useSelector } from "react-redux";
import { RootState } from "../store";



const useLibraryDetails = () => {
  const { search } = useLocation();
  const { uniqueId } = useParams<{ uniqueId: string }>()
  const { addNewItemWindowType, confirmOpenEdit, editPayload, addItemWindowMinimized, 
    deleteItemSuccess, deleteItemType, showEditSuccess} = useSelector((state: RootState) => state.searchResults);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (uniqueId) {
      fetchLibraryDetails(uniqueId)
    }
  }, [uniqueId])

  useEffect(() => {
    if (uniqueId && showEditSuccess && addNewItemWindowType === LIBRARY_TAB_NAME ) {
      fetchLibraryDetails(uniqueId)
    }
  }, [showEditSuccess])

  /**
   * fetch with two words
   */
  const { isLoading, error, data, mutate: fetchLibraryDetails } = useMutation('library-details', libraryDetails, {
    retry: false
  });

  useEffect(() => {
    if (confirmOpenEdit && editPayload) {

      openEditFlow(editPayload)
      dispatch(toggleConfirmOpenEdit(false));
      dispatch(setEditPayload(null));

    }
  }, [confirmOpenEdit])

  useEffect(() => {

    /** navigate to latest list after deleting item */
    if (deleteItemSuccess && (deleteItemType === "Library")) {
      navigate(`/Library`, { replace: true })
    }
  }, [deleteItemSuccess, deleteItemType])

  const openEditFlow = async (payload: any) => {
    if (payload) {

      const { record, type } = payload;
      let res: any | MediaApi = {};

      res = await libraryDetails(record.uniqueId);
      if (res?.media_associate) {
        dispatch(setDefaultMediaAssociation({ events: res.media_associate?.visit_unique_ids || [], places: res.media_associate?.place_unique_ids || [] }));
      }
      dispatch(setTabData(res));
      dispatch(setTabEdit(true));
      dispatch(toggleNewItemWindow(true));
      dispatch(setAddNewItemWindowType(LIBRARY_TAB_NAME));
    }
  }


  const setEdit = async (payload: {record: any, type: tabNameProps}) => {
    if (addNewItemWindowType && addItemWindowMinimized) {
      /** Detect if user comes via forced edit */
      dispatch(toggleEditConfirmationWindowOpen(true));
      dispatch(setEditPayload(payload));

    } else {
      /** Detect if user comes via normal edit */
      openEditFlow(payload)
      dispatch(resetMediaAssociation(null));
    }
  };

  return {
    loading: isLoading,
    error,
    data,
    setEdit
  };
};

export default useLibraryDetails;
