import { useEffect } from "react";
import {useMutation as apolloMutation} from '@apollo/client';
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { eventDetails, mediaDetails } from "../api/details";
import { tabNameProps } from "../types/SearchResultsTabsProps";
import { setEventEdit, setEventData } from "../store/reducers/eventReducer";
import { toggleNewItemWindow, setAddNewItemWindowType, setDefaultMediaAssociation, toggleEditConfirmationWindowOpen, setEditPayload, toggleConfirmOpenEdit, resetMediaAssociation } from "../store/reducers/searchResultsReducer";
import { EVENTS_TAB_NAME } from "../utils/services/helpers";
import { RootState } from "../store";
import { MediaApi } from "../types/Media";
import { setTabData, setTabEdit } from "../store/reducers/tabEditReducer";
import { updateMedia } from "../query/media";
import { graphQlHeaders } from "../utils/services/interceptor";

const useEventDetails = () => {
  let { uniqueId, tabName } = useParams<{ tabName?: tabNameProps; uniqueId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { edit } = useSelector((state:RootState) => state.event)
  const { addNewItemWindowType, confirmOpenEdit , editPayload, addItemWindowMinimized,
    deleteItemSuccess, deleteItemType } = useSelector(
    (state: RootState) => state.searchResults
  );

  useEffect(() => {
    if (uniqueId) {
      fetchEventDetails(uniqueId);
    }
  }, [edit]);

  /**
   * fetch places with two words
   */
  const {
    isLoading,
    error,
    data,
    mutate: fetchEventDetails,
  } = useMutation("event-details", eventDetails, {
    retry: false,
  });

  const [updateMediaMutation, { data: updateData, reset }] = apolloMutation(updateMedia, {context: graphQlHeaders().context, onCompleted: (data) => {
    if (uniqueId) {
 
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
    if (deleteItemSuccess && (deleteItemType === "Events")) {
      navigate(`/Events`, { replace: true })
    }

    /** means if media or libr is deleted from places */
    if (
      uniqueId &&
      tabName &&
      (tabName === EVENTS_TAB_NAME) &&
      deleteItemSuccess && (
        deleteItemType === "Media" ||
        deleteItemType === "Library"
      )
    ) {
      fetchEventDetails(uniqueId)
    }
  }, [deleteItemSuccess, deleteItemType])

  

  const openEditFlow = async (payload: any) => {
    if (payload) {
      const { record, type } = payload;
      let res: any | MediaApi = {};
      if (type === 'Library' && record.media_unique_id) {
        res = await mediaDetails(record.media_unique_id.uniqueId);
        if (res?.media_associate) {
          dispatch(setDefaultMediaAssociation({ events: res.media_associate?.visit_unique_ids || [], places: res.media_associate?.place_unique_ids || [] }));
        }
      }
      if (type === 'Media' && record.media_unique_id) {
        res = await mediaDetails(record.media_unique_id.uniqueId);
        if (res?.media_associate) {
          dispatch(setDefaultMediaAssociation({ events: res.media_associate?.visit_unique_ids || [], places: res.media_associate?.place_unique_ids || [] }));
        }
      }
      if (type === 'Events' && record.uniqueId) {
        res = record;
      }
      dispatch(setTabEdit(true));
      dispatch(setTabData(res));
      dispatch(setEventData(res));
      dispatch(setEventEdit(true));
      dispatch(toggleNewItemWindow(true));
      dispatch(setAddNewItemWindowType(type));
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

  const setFeaturedMedia = async (payload: any) => {
    const featuredMedia: any = data && data?.mediaGallery && data?.mediaGallery.filter(x => x.media_unique_id.featuredImage);
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
      await fetchEventDetails(uniqueId);
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

export default useEventDetails;
