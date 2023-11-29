import { useEffect } from "react";
import { useMutation } from "react-query";
import {useMutation as apolloMutation} from '@apollo/client';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { mediaDetails, placeDetails, eventDetails, libraryDetails } from "../api/details";
import { setTabData, setTabEdit } from "../store/reducers/tabEditReducer";
import { setEventEdit, setPlaces, setEventData } from '../store/reducers/eventReducer';
import { PLACES_TAB_NAME } from "../utils/services/helpers";
import { toggleNewItemWindow, setAddNewItemWindowType, setDefaultMediaAssociation, toggleEditConfirmationWindowOpen, toggleConfirmOpenEdit, setEditPayload, resetMediaAssociation } from "../store/reducers/searchResultsReducer";
import { RootState } from "../store";
import { tabNameProps } from "../types/SearchResultsTabsProps";
import { PlaceApi, Place, MediaAssociateObj } from "../types/Place";
import { Media, MediaApi } from "../types/Media";
import { graphQlHeaders } from "../utils/services/interceptor";
import { updateMedia } from "../query/media";

const usePlaceDetails = () => {
  const { uniqueId , tabName} = useParams<{ uniqueId: string, tabName: tabNameProps }>();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { edit } = useSelector((state:RootState) => state.tabEdit)
  const { addNewItemWindowType, confirmOpenEdit, editPayload, addItemWindowMinimized,
    deleteItemSuccess, deleteItemType } = useSelector(
    (state: RootState) => state.searchResults
  );

  useEffect(() => {
    if (uniqueId) {
      fetchPlaceDetails(uniqueId)
    }
  }, [edit, uniqueId])

  /**
   * fetch places with two words
   */
  const { isLoading, error, data, mutate: fetchPlaceDetails } = useMutation('place-details', placeDetails, {
    retry: false
  });
  const [updateMediaMutation] = apolloMutation(updateMedia, {context: graphQlHeaders().context, onCompleted: () => {
    if (uniqueId) {
      // fetchPlaceDetails(uniqueId);
    }
  }});

  useEffect(() => {

    if (confirmOpenEdit && editPayload) {

      openEditFlow(editPayload)
      dispatch(toggleConfirmOpenEdit(false));
      dispatch(setEditPayload(null));

    }
  }, [confirmOpenEdit])

  useEffect(() => {

    /** navigate to latest list after deleting item */
    if (deleteItemSuccess && (deleteItemType === "Places")) {
      navigate(`/Places`, {replace: true})

      
    }

    /** means if event or libr is deleted from places */
    if (
      uniqueId &&
      tabName &&
      (tabName === PLACES_TAB_NAME )&&
      deleteItemSuccess && (
        deleteItemType === "Events" ||
        deleteItemType === "Library" || 
        deleteItemType === "Media"
      )
    ) {
      fetchPlaceDetails(uniqueId)
    }
  }, [deleteItemSuccess, deleteItemType])
  
  const openEditFlow = async (payload: any) => {
    if (payload) {
      const { record, type } = payload;
      let res: any | MediaApi = {};
      if (type === 'Places') {
        res = await placeDetails(record.uniqueId);
      }
      if (type === 'Library' && record.media_unique_id) {
        res = await mediaDetails(record.media_unique_id.uniqueId);
        if (res?.media_associate) {
          dispatch(setDefaultMediaAssociation({ events: res.media_associate?.visit_unique_ids || [], places: res.media_associate?.place_unique_ids || [] }));
        }
        if (type === 'Library' && record.media_unique_id) {
          res = await mediaDetails(record.media_unique_id.uniqueId);
          if (res?.media_associate) {
            dispatch(setDefaultMediaAssociation({ events: res.media_associate?.visit_unique_ids || [], places: res.media_associate?.place_unique_ids || [] }));
          }
        }
        // if (type === 'Events' && record.visit_unique_id) {
        //   res = await mediaDetails(record.visit_unique_id.uniqueId);
        // }
        dispatch(setTabData(res));
        dispatch(setTabEdit(true));
        dispatch(toggleNewItemWindow(true));
        // dispatch(setAddNewItemWindowType(type));
      }
      if (type === 'Events' && record.visit_unique_id) {
        res = await eventDetails(record.visit_unique_id.uniqueId);
        dispatch(setEventData(res));
        dispatch(setEventEdit(true));
      }
      dispatch(setTabData(res));
      dispatch(setTabEdit(true));
      dispatch(toggleNewItemWindow(true));
      dispatch(setAddNewItemWindowType(type));
    }
  }

  const setEdit = async (payload: { record: any, type: tabNameProps }) => {
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

  const setFeaturedMedia = async (payload: any) => {
    const featuredMedia: any = data?.mediaItems.filter(x => x.media_unique_id.featuredImage);
    if (featuredMedia?.length > 0) {
      await updateMediaMutation({
        variables: {
          featuredImage: false,
          id: featuredMedia[0].media_unique_id.id
        }
      })
    }
    await updateMediaMutation({
      variables: {
        featuredImage: !payload.media_unique_id.featuredImage,
        id: payload.media_unique_id.id
      }
    });
    if (uniqueId) {
      await fetchPlaceDetails(uniqueId);
    }
  }

  return {
    loading: isLoading,
    error,
    data,
    setEdit,
    setFeaturedMedia
  };
};

export default usePlaceDetails;
