import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { placeDetails } from "../api/details";
import { addPlace, refinePlaces, updatePlace, refinePlacesMap } from "../query/places";
import { RootState } from "../store";
import { initialSelectedValue, setSelectedValue } from "../store/reducers/refinedSearchReducer";
import {
  setPlaces,
  setPlaceMetaData,
  setSearchText,
  toggleNewItemWindow, setAddNewItemWindowType, toggleShowEditSuccess, toggleEditConfirmationWindowOpen, setEditPayload, toggleConfirmOpenEdit, resetMediaAssociation
} from "../store/reducers/searchResultsReducer";
import { setLatestItem, setTabData, setTabEdit } from "../store/reducers/tabEditReducer";
import { Place } from "../types/Place";
import { tabNameProps } from "../types/SearchResultsTabsProps";

import {limit, getQueryObj, generateUniqueId, webUrl, PLACES_TAB_NAME, MAX_FETCH_LIMIT} from '../utils/services/helpers';
import {graphQlHeaders} from '../utils/services/interceptor';


const usePlace = () => {
  const [hasMoreData, setHasMoreData] = useState(true);
  const [directionAsc, setDirectionAsc] = useState(true);
  const [mapPlaces, setMapPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState<Place[] | []>([]);
  const { searchText, places: placeData, addNewItemWindowType, confirmOpenEdit, editPayload,
    addItemWindowMinimized, deleteItemSuccess, deleteItemType, successInventoryName } = useSelector(
    (state: RootState) => state.searchResults
  );
  const { selectedValue, placeSort } = useSelector(
    (state: RootState) => state.refinedSearch
  );

  const { edit, tabData } = useSelector(
    (state: RootState) => state.tabEdit
  );

  const { search } = useLocation();
  let { tabName } = useParams<{ tabName?: tabNameProps, uniqueId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchData = getQueryObj(search);
  useEffect(() => {
    if (searchData) {
      dispatch(setSearchText(searchData.search))
      if (searchData?.refinedSearch) {
        dispatch(setSelectedValue({
          ...initialSelectedValue,
          ...searchData.refinedSearch
        }))
      }
    }
    resetPlaces();
    // if (tabName === "Places") {
      console.log('fetch data..... 1')
    fetchData(0);
    // }
  }, []);

  const resetPlaces = async () => {
    await dispatch(setPlaces([]));
    await dispatch(setPlaceMetaData(null));
  };

  /**
   * fetch places with two words
   */
  const { loading:refineLoadingMap, error:refineErrorDataMap, data:refinePlaceDataMap, refetch:refineSearchPlacesMap} = useQuery(refinePlacesMap, graphQlHeaders());
  const { loading:refineLoading, error:refineErrorData, data:refinePlaceData, refetch:refineSearchPlaces} = useQuery(refinePlaces, graphQlHeaders());
  const { loading:refineLoadingDirect, error:refineErrorDataDirect, data:refinePlaceDataDirect, refetch:refineSearchPlacesDirect} = useQuery(refinePlaces, graphQlHeaders());
  
  const [createPlaceMutation, {data, loading, error}] = useMutation(addPlace, {context: graphQlHeaders().context, onCompleted: (data) => {
    dispatch(setLatestItem({tab:'Places', data:data.createPlace.data}));
    
    console.log('fetchData..... 2')
    fetchData(0);

    navigate(`/Places/${data.createPlace.data.attributes.uniqueId}`, {replace: true})
  }});
  const [updatePlaceMutation, {data: updateData, loading: updateLoading, error: updateErr}] = useMutation(updatePlace, graphQlHeaders());

  useEffect(() => {
    if (refinePlaceData?.places && refinePlaceDataMap?.places) {
      const places = JSON.parse(JSON.stringify(refinePlaceData?.places.data))

      places.map((x: Place) => {
        x.label = `${x?.attributes?.placeNameEnglish}${x?.attributes?.placeNameArabic}` || '';
        x.value = x?.id;
        return x;
      })

      // update the data for the pagination
      if (refinePlaceData?.places?.meta.pagination.page === 1 && refinePlaceData?.places?.data.length > 0) {
        dispatch(setPlaces([...places]));
      } else if (places?.length > 0) {
        dispatch(setPlaces([...placeData, ...places]));
      } else if (refinePlaceData?.places?.meta.pagination.total === 0) {
        dispatch(setPlaces([]));
      }
      // update the meta data
      dispatch(setPlaceMetaData(refinePlaceData?.places?.meta));
      // this flag decides to fetch next set of data
      setHasMoreData(
        refinePlaceData?.places?.meta.pagination.pageCount !==
        refinePlaceData?.places.meta.pagination.page
      );

      if(refinePlaceData?.places?.meta?.pagination?.total){
      let dummyArray: any = [];
      fetchMapData(refinePlaceData?.places?.meta.pagination.total,true)
        for (let i = 0; i < refinePlaceDataMap?.places?.data?.length; i++) {
          if (refinePlaceDataMap?.places?.data[i]?.attributes?.latitude && refinePlaceDataMap?.places?.data[i]?.attributes?.longitude) {
            dummyArray.push({
              id:refinePlaceDataMap?.places?.data[i].id,
              uniqueId:refinePlaceDataMap?.places?.data[i].attributes["uniqueId"],
              name: refinePlaceDataMap?.places?.data[i].attributes["placeNameEnglish"],
              position: {
                lat: refinePlaceDataMap?.places?.data[i].attributes["latitude"],
                lng: refinePlaceDataMap?.places?.data[i].attributes["longitude"],
              },
            });
          }
        }
        setMapPlaces(dummyArray);
      }

    }
  }, [refinePlaceData, refinePlaceDataMap]);

  /** set list of all places the application has */
  useEffect(() => {
    if (refinePlaceDataDirect && !refineLoadingDirect) {
      setAllPlaces(refinePlaceDataDirect?.places?.data)
    }
  }, [refinePlaceDataDirect, refineLoadingDirect])

  useEffect(() => {
    if (updateData && edit) {
        dispatch(setTabEdit(false));
        dispatch(setTabData({}));
        dispatch(toggleShowEditSuccess(true))
        navigate(`/Places/${updateData.updatePlace.data.attributes.uniqueId}`, {replace: true})
    }
  }, [updateData])

  const fetchDataDirect = (skip: number = placeData.length, local: boolean = false, clear: boolean = false) => {

    // get the query from the url parameters
    const searchData = getQueryObj(search);
    // check if the search is coming from local or using link
    const text = local ? searchText : searchData?.search;
    // filter non data from the array object
    const copiedValue = local ? JSON.parse(JSON.stringify(selectedValue)) : searchData?.refinedSearch;
    const searchWordArray = text?.trim()?.split(" ") || [];
    copiedValue && Object.keys(copiedValue)?.map(x => {
      if (copiedValue[x].length === 0) {delete copiedValue[x];}
      return x;
    });
    const obj: any = {
      researchValue: copiedValue&&copiedValue?.researchValue && copiedValue?.researchValue,
      tourismValue: copiedValue&&copiedValue.tourismValue && copiedValue?.tourismValue,
      stateOfConservation: copiedValue&&copiedValue?.stateOfConservation && copiedValue?.stateOfConservation,
      recommendation: copiedValue&&copiedValue?.recommendation && copiedValue?.recommendation,
      risk: copiedValue&&copiedValue?.risk && copiedValue?.risk,
      period: copiedValue&&copiedValue?.period && copiedValue?.period,
      latitude: copiedValue&&copiedValue?.latitude && parseFloat(copiedValue?.latitude),
      longitude: copiedValue&&copiedValue?.longitude && parseFloat(copiedValue?.longitude),
      artifacts: copiedValue&&copiedValue?.artifacts && copiedValue?.artifacts,
      actionType: copiedValue&&copiedValue?.actionType && copiedValue?.actionType,
      keywords: copiedValue&&copiedValue?.keyWords && copiedValue?.keyWords,
      siteType: copiedValue&&copiedValue?.siteType && copiedValue?.siteType,
      search_one: searchWordArray[0],
      search_two: searchWordArray[1],
      search_three: searchWordArray[2],
      text: searchWordArray,
      limit: MAX_FETCH_LIMIT, // only change from the original function
      skip: skip,
    };
    if (clear) {
      obj.skip = 0;
      obj.search_one = '';
      delete obj.search_two;
      delete obj.search_three;
    }
    obj.sortBy = ["createdAt:desc"];
    refineSearchPlacesDirect(obj);
  };


  const fetchData = (skip: number = placeData.length, local: boolean = false, clear: boolean = false) => {
    // get the query from the url parameters
    const searchData = getQueryObj(search);
    // check if the search is coming from local or using link
    const text = local ? searchText : searchData?.search;
    // filter non data from the array object
    const copiedValue = local ? JSON.parse(JSON.stringify(selectedValue)) : searchData?.refinedSearch;
    const searchWordArray = text?.trim()?.split(" ") || [];
    copiedValue && Object.keys(copiedValue)?.map(x => {
      if (copiedValue[x].length === 0) {delete copiedValue[x];}
      return x;
    });

    const obj: any = {
      researchValue: copiedValue&&copiedValue?.researchValue && copiedValue?.researchValue,
      tourismValue: copiedValue&&copiedValue.tourismValue && copiedValue?.tourismValue,
      stateOfConservation: copiedValue&&copiedValue?.stateOfConservation && copiedValue?.stateOfConservation,
      recommendation: copiedValue&&copiedValue?.recommendation && copiedValue?.recommendation,
      risk: copiedValue&&copiedValue?.risk && copiedValue?.risk,
      period: copiedValue&&copiedValue?.period && copiedValue?.period,
      latitude: copiedValue&&copiedValue?.latitude && parseFloat(copiedValue?.latitude),
      longitude: copiedValue&&copiedValue?.longitude && parseFloat(copiedValue?.longitude),
      artifacts: copiedValue&&copiedValue?.artifacts && copiedValue?.artifacts,
      actionType: copiedValue&&copiedValue?.actionType && copiedValue?.actionType,
      keywords: copiedValue&&copiedValue?.keyWords && copiedValue?.keyWords,
      siteType: copiedValue&&copiedValue?.siteType && copiedValue?.siteType,
      search_one: searchWordArray[0],
      search_two: searchWordArray[1],
      search_three: searchWordArray[2],
      text: searchWordArray,
      limit: limit,
      skip: skip,
      sortBy: placeSort.length > 0 ? placeSort : [`createdAt:desc`]
    };
    if (clear) {
      obj.skip = 0;
      obj.search_one = '';
      obj.text = [];
      delete obj.search_two;
      delete obj.search_three;
    }
    refineSearchPlaces(obj);
  };

  const fetchMapData = (limit: number, local: boolean = false) => {
    // get the query from the url parameters
    const searchData = getQueryObj(search);
    // check if the search is coming from local or using link
    const text = local ? searchText : searchData?.search;
    // filter non data from the array object
    const copiedValue = local ? JSON.parse(JSON.stringify(selectedValue)) : searchData?.refinedSearch;
    const searchWordArray = text?.trim()?.split(" ") || [];
    copiedValue && Object.keys(copiedValue)?.map(x => {
      if (copiedValue[x].length === 0) {delete copiedValue[x];}
      return x;
    });
    const objOfMap: any = {
      researchValue: copiedValue&&copiedValue?.researchValue && copiedValue?.researchValue,
      tourismValue: copiedValue&&copiedValue.tourismValue && copiedValue?.tourismValue,
      stateOfConservation: copiedValue&&copiedValue?.stateOfConservation && copiedValue?.stateOfConservation,
      recommendation: copiedValue&&copiedValue?.recommendation && copiedValue?.recommendation,
      risk: copiedValue&&copiedValue?.risk && copiedValue?.risk,
      period: copiedValue&&copiedValue?.period && copiedValue?.period,
      latitude: copiedValue&&copiedValue?.latitude && parseFloat(copiedValue?.latitude),
      longitude: copiedValue&&copiedValue?.longitude && parseFloat(copiedValue?.longitude),
      artifacts: copiedValue&&copiedValue?.artifacts && copiedValue?.artifacts,
      actionType: copiedValue&&copiedValue?.actionType && copiedValue?.actionType,
      keywords: copiedValue&&copiedValue?.keyWords && copiedValue?.keyWords,
      siteType: copiedValue&&copiedValue?.siteType && copiedValue?.siteType,
      search_one: searchWordArray[0],
      search_two: searchWordArray[1],
      search_three: searchWordArray[2],
      text: searchWordArray,
      limit: limit
    };
    refineSearchPlacesMap(objOfMap);
  };
  

  const clearTextSearch = () => {
    fetchData(0, true, true);
  }

  const createPlace = async (payload: any | undefined) => {
    const uniqueId = generateUniqueId();

    const data = {
      ...payload,
      asset_config_id: 8,
      keywords: payload.keywords,
      siteType: payload.siteType,
      previousNumber: payload.previousNumber,
      placeValue: 0,
      "stateOfConservation": [payload.stateOfConservation],
      "risk": [payload.risk],
      "period": payload.period,
      "researchValue": [payload.researchValue],
      "tourismValue": [payload.tourismValue],
      "recommendation": [payload.recommendation],
      "latitude": payload.latitude ? parseFloat(payload.latitude) : null,
      "longitude": payload.longitude ? parseFloat(payload.longitude) : null,
      // "assessmentType": ["Field-based"],
      artifacts: [payload.artifacts]
    }
    if (!edit) {
      data.uniqueId = uniqueId;
      data.placeUIPath = `Places/${uniqueId}`;
      createPlaceMutation({variables: data})
    }
    if (edit && tabData?.id) {
      updatePlaceMutation({
        variables: {
          ...data,
          id: tabData.id
        }
      })
    }
  }

  useEffect(() => {

    if (confirmOpenEdit && editPayload && (tabName === PLACES_TAB_NAME)) {

      openEditFlow(editPayload)
      dispatch(toggleConfirmOpenEdit(false));
      dispatch(setEditPayload(null));

    }
  }, [confirmOpenEdit])

  useEffect(() => {

    /** get latest list after deleting item */
    if (deleteItemSuccess && (deleteItemType === "Places") && (placeSort.length === 0)) {
      fetchData(0)
    }
  }, [deleteItemSuccess, deleteItemType]);

  useEffect(() => {
    if (placeSort.length > 0) {
      fetchData(0);
    }
  }, [placeSort])
  
  const openEditFlow = async (payload: any) => {
    if (payload) {
      const { type, record } = payload;
      if (record) {
        const payloadRes = await placeDetails(record.attributes.uniqueId);
        dispatch(setTabData(payloadRes));
        dispatch(setTabEdit(true));
        dispatch(toggleNewItemWindow(true))
        dispatch(setAddNewItemWindowType(type))
      }
    }
  }

  const setEdit = (payload: any) => {
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
    loading: refineLoading,
    loadingDirect: refineLoadingDirect,
    error: refineErrorData,
    data: refinePlaceData,
    dataDirect: allPlaces,
    mapPlaces,
    hasMoreData,
    fetchPlaces: fetchData,
    fetchPlacesDirect: fetchDataDirect,
    clearSearch: clearTextSearch,
    createPlace: createPlace,
    setEdit,
    searchData : getQueryObj(search)
  };
};

export default usePlace;
