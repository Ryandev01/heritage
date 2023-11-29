import {useQuery, useMutation} from '@apollo/client';
import { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { addLibrary, library, updateLibrary } from "../query/library";
import { createMediaAssociate, updateMediaAssociate } from '../query/mediaAssociate';
import { RootState } from '../store';
import { resetMediaAssociation, setAddNewItemWindowType, setDefaultMediaAssociation, setEditPayload, setLibrary, setLibraryMetaData, storeAddItemProgressState, toggleConfirmOpenEdit, toggleEditConfirmationWindowOpen, toggleNewItemWindow, toggleShowAddSuccess, toggleShowEditSuccess} from '../store/reducers/searchResultsReducer';
import { tabNameProps } from '../types/SearchResultsTabsProps';
import {limit, getQueryObj, webUrl, generateUniqueId, LIBRARY_TAB_NAME, formatBytes, formatDate, formatStrapiDate} from '../utils/services/helpers';
import { graphQlHeaders } from '../utils/services/interceptor';
import { mediaDetails } from "../api/details";
import { setLatestItem, setTabData, setTabEdit } from '../store/reducers/tabEditReducer';

const useLibrary = () => {
  const [hasMoreData, setHasMoreData] = useState(false);

  const {searchText, library: libItem, associatedPlaces, associatedEvents,
    addNewItemWindowType, confirmOpenEdit, editPayload, addItemWindowMinimized, deleteItemSuccess,
    deleteItemType } = useSelector((state: RootState) => state.searchResults);
  const { selectedValue, libSort } = useSelector(
    (state: RootState) => state.refinedSearch
  );

  const { edit, tabData } = useSelector(
    (state: RootState) => state.tabEdit
  );

  const {search} = useLocation();
  let { tabName } = useParams<{ tabName?: tabNameProps, uniqueId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    resetLib();
    if (tabName === "Library") {
      fetchData(0);
    }
  }, []);

  const resetLib = async () => {
    await dispatch(setLibrary([]));
    await dispatch(setLibraryMetaData(null));
  };

  const resetEdit = () => {
    dispatch(setTabData({}));
    dispatch(setTabEdit(false));
  }

  const [createLibraryMutation, { loading: addLoading, error: addErr, data: addData, reset: resetLibrary }] = useMutation(addLibrary, {context: graphQlHeaders().context, onCompleted: (data) => {
    dispatch(setLatestItem({tab:'Library', data:data.createMedia.data}));
  }});
  const [updateLibraryMutation, { loading:updateLoading, error: updateErr, data: updateData, reset: resetUpdateLibrary }] = useMutation(updateLibrary, {context: graphQlHeaders().context, onCompleted: () => {
    if (associatedEvents.length == 0 && associatedPlaces.length == 0) {
      dispatch(toggleShowEditSuccess(true));
    }
  }});
  const [createMediaAssociateMutation, { loading: mediaAssociateload, error: mediaAssociateErr, data: mediaAssociate, reset: resetCreateMediaAssociate }] = useMutation(createMediaAssociate, {context: graphQlHeaders().context, onCompleted: () => {
    // dispatch(resetMediaAssociation(null));
    dispatch(toggleShowAddSuccess(true));
    navigate(`/Library/${addData.createMedia.data.attributes.uniqueId}`, {replace: true});
  }});
  const [updateMediaAssociateMutation, { loading: updateMediaAssociateload, error: updateMediaAssociateErr, data: updateMediaAssociateData, reset: resetUpdateAssociate }] = useMutation(updateMediaAssociate, {context: graphQlHeaders().context, onCompleted: () => {
    dispatch(toggleShowEditSuccess(true));
  }});


  /**
   * fetch places with two words
   */
  const { loading, error, data, refetch:refetchLibraryItems } = useQuery(library, graphQlHeaders());

  useEffect(() => {
    if (data?.medias) {
      // update the data for the pagination
      if (data?.medias.meta.pagination.page === 1 && data?.medias.data.length > 0) {
        dispatch(setLibrary([...data?.medias?.data]));
      } else if (data?.medias.data.length > 0) {
        dispatch(setLibrary([...libItem, ...data?.medias?.data]));
      } else if (data?.medias?.meta.pagination.total === 0) {
        dispatch(setLibrary([]));
      }
      // update the meta data
      dispatch(setLibraryMetaData(data?.medias?.meta));
      // this flag decides to fetch next set of data 
      setHasMoreData(data?.medias?.meta.pagination.pageCount !==
        data?.medias.meta.pagination.page);
    }
  }, [data])

  const createAssociation = async (mediaId: number) => {
    if (associatedPlaces.length > 0 || associatedEvents.length > 0) {
      await createMediaAssociateMutation({variables: {
        "place_unique_ids": associatedPlaces.map(x => x.id),
        "visit_unique_ids": associatedEvents.map(x => x.id),
        "media_unique_id": mediaId
      }});
    } 

  }

  useEffect(() => {
    if (updateMediaAssociateData) {
      resetUpdateAssociate();
      resetUpdateLibrary();
    }
  }, [updateMediaAssociateData]);

  useEffect(() => {
    if (addData && (associatedPlaces.length > 0 || associatedEvents.length > 0)) {
      createAssociation(addData.createMedia.data.id);
    } else if(updateData) {
      if (updateData?.updateMedia.data.attributes?.media_associate?.data?.id) {
        updateMediaAssociateMutation({
          variables: {
            "id": updateData?.updateMedia?.data.attributes?.media_associate?.data?.id,
            "place_unique_ids": associatedPlaces.map(x => x.id),
            "visit_unique_ids": associatedEvents.map(x => x.id),
          }
        })
      }
      resetEdit();
      dispatch(storeAddItemProgressState(null));

      /** re-direct */
      navigate(`/Library/${updateData?.updateMedia.data.attributes.uniqueId}`, {replace: true});
    }
  }, [addData, updateData])

  useEffect(() => {

    if (mediaAssociate && addData) {
      dispatch(storeAddItemProgressState(null));
    
      
    } else if (mediaAssociate && updateData) {
      resetCreateMediaAssociate();
      resetUpdateLibrary();
      dispatch(toggleShowEditSuccess(true));
    }

  }, [mediaAssociate, updateData, addData])
  
  const fetchData = (skip: number = libItem.length, local: boolean = false, clear: boolean = false) => {
    const searchData = getQueryObj(search);
    const text = local ? searchText : searchData?.search;
    const searchWordArray = text?.trim()?.split(' ') || [];
    const copiedValue = JSON.parse(JSON.stringify(selectedValue));
    Object.keys(copiedValue).map(x => {
      if (copiedValue[x].length === 0) {delete copiedValue[x];}
      return x;
    });
    const obj: any = {
      search_one: searchWordArray[0] || '',
      search_two: searchWordArray[1],
      search_three: searchWordArray[2],
      limit: limit,
      skip: skip,
      sortBy: libSort.length > 0 ? libSort : [`createdAt:desc`]
    };
    if (clear) {
      obj.skip = 0;
      obj.search_one = '';
      delete obj.search_two;
      delete obj.search_three;
      refetchLibraryItems(obj)
    } {
      refetchLibraryItems(obj);
    }
  };

  const mediaType = (typeCode: string) => {
    let media_type = 2;
    switch (typeCode) {
      case 'REFERENCEURL':
        media_type=3;
        break;
      case 'INLINE':
        media_type=4;
        break;
    }
    return media_type;
  }
 
  const createLibrary = async (payload: any | undefined) => {
    const uniqueId = generateUniqueId();
    const keywords = payload.keywords;
    const data = {
      ...payload,
      visitNumber: parseFloat(payload.visitNumber),
      asset_config_id: [mediaType(payload.documentType)], // documentType should be string and media type
      keywords: keywords,
      siteType: payload.siteType && payload.siteType,
      referenceURL: payload.referenceURL && payload.referenceURL,
      "latitude": payload.latitude && parseFloat(payload.latitude),
      "longitude": payload.longitude && parseFloat(payload.longitude),
      "categoryType": payload.categoryType && payload.categoryType,
      object:payload?.object && payload?.object[0].id,
      fileSize: payload?.object && formatBytes(payload?.object[0]?.size),
      fileName: payload?.object && payload?.object[0]?.name,
      storage: payload?.object && payload?.object[0]?.provider,
      dimension: payload?.object && payload?.object[0]?.height && `${payload?.object[0]?.height}x${payload?.object[0]?.width}`,
      make: "",
      model: "",
      depth: "",
      modified: new Date(),
    }
    if (!edit) {
      data.uniqueId = uniqueId;
      data.created = formatStrapiDate(new Date());
      data.mediaUIPath = `Library/${uniqueId}`;
      createLibraryMutation({variables: data})
    }
    if (edit && tabData?.id) {
      updateLibraryMutation({
        variables: {
          ...data,
          id: tabData.id
        }
      })
    }
  }

  useEffect(() => {
    if (confirmOpenEdit && editPayload && (tabName === LIBRARY_TAB_NAME)) {

      openEditFlow(editPayload)
      dispatch(toggleConfirmOpenEdit(false));
      dispatch(setEditPayload(null));

    }
  }, [confirmOpenEdit])

  useEffect(() => {

    /** get latest list after deleting item */
    if (deleteItemSuccess && (deleteItemType === "Library")) {
      fetchData(0)
    }
  }, [deleteItemSuccess, deleteItemType]);

  useEffect(() => {
    if (libSort.length > 0) {
      fetchData(0);
    }
  }, [libSort]);

  const openEditFlow = async (payload: any) => {
    if (payload) {

      const { record } = payload;
      const payloadRes = await mediaDetails(record.attributes.uniqueId);
      dispatch(setTabData(payloadRes));
      dispatch(setTabEdit(true));
      dispatch(toggleNewItemWindow(true));
      dispatch(setAddNewItemWindowType(LIBRARY_TAB_NAME));
      dispatch(setDefaultMediaAssociation({ events: payloadRes.media_associate?.visit_unique_ids || [], places: payloadRes.media_associate?.place_unique_ids || [] }));
    }
  }


  const setEdit = async (payload: any) => {
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
    loading,
    error,
    data,
    hasMoreData,
    fetchLibraryItems: fetchData,
    createLibrary,
    setEdit,
    searchData:getQueryObj(search)
  };
};

export default useLibrary;
