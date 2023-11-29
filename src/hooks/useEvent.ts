import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { addEvent, refineEvents, updateEvent, refineEventsMap } from "../query/events";
import { createVisitAssociate } from "../query/eventAssociate";
import { RootState } from "../store";
import { setSelectedValue, initialSelectedValue } from "../store/reducers/refinedSearchReducer";
import {
  setEvents,
  setEventMetaData,
  setSearchText,
  toggleShowAddSuccess,
  toggleNewItemWindow, setAddNewItemWindowType, toggleEditConfirmationWindowOpen, toggleConfirmOpenEdit, setEditPayload, resetMediaAssociation, toggleShowEditSuccess
} from "../store/reducers/searchResultsReducer";
import { setEventEdit, setEventData, setPlaces } from '../store/reducers/eventReducer';
import { limit, getQueryObj, generateUniqueId, webUrl, EVENTS_TAB_NAME } from '../utils/services/helpers';
import { tabNameProps } from "../types/SearchResultsTabsProps";
import { graphQlHeaders } from "../utils/services/interceptor";
import { Place } from "../types/Place";
import { eventDetails } from "../api/details";

import { setLatestItem, setTabData, setTabEdit } from "../store/reducers/tabEditReducer";
import { refinePlaces } from "../query/places";

const useEvent = () => {
  const [hasMoreData, setHasMoreData] = useState(true);
  const [mapEvents, setMapEvents] = useState(null);
  const [place, setPlace] = useState<Place>();

  const [searchValue, setSearchValue] = useState<string>('');

  const {
    searchText,
    events: eventsData,
    addNewItemWindowType,
    confirmOpenEdit,
    editPayload,
    addItemWindowMinimized,
    deleteItemSuccess,
    deleteItemType,
    successInventoryName
  } = useSelector((state: RootState) => state.searchResults);
  const { selectedValue, eventSort } = useSelector(
    (state: RootState) => state.refinedSearch
  );
  const { edit, event  } = useSelector(
    (state: RootState) => state.event
  );
  const { search } = useLocation();

  let { tabName, uniqueId: idParams } = useParams<{ tabName?: tabNameProps, uniqueId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchParams = getQueryObj(search);
  useEffect(() => {
    if (searchParams) {
      dispatch(setSearchText(searchParams.search?.trim()))
      if (searchParams?.refinedSearch) {
        dispatch(setSelectedValue({
          ...initialSelectedValue,
          ...searchParams.refinedSearch
        }))
      }
    }
    resetEvents();
    fetchData(0);
  }, []);

  const resetEvents = async () => {
    await dispatch(setEvents([]));
    await dispatch(setEventMetaData(null));
  };

  /**
   * fetch places with two words
   */
  const [createEventMuation, { loading, error, data }] = useMutation(addEvent, {context: graphQlHeaders().context, onCompleted: (data) => {
    dispatch(setLatestItem({tab:'Events', data:data.createVisit.data}));
  }});
  const [updateEventMuation, { loading: updateLoading, error: updateErr, data: updateData, reset }] = useMutation(updateEvent, {context: graphQlHeaders().context, onCompleted: () => {
    // dispatch(setEventEdit(false))
    // dispatch(toggleShowEditSuccess(false));
    /** re-direct */
    // if(updateData?.updateVisit) {
    //   navigate(`/Events/${updateData.updateVisit.data.attributes.uniqueId}`, { replace: true })
    // }

  }});
  const [createVisitAssociateMuation, { loading: visitAssociateload, error: visitAssociateErr, data: visitAssociate }] = useMutation(createVisitAssociate, graphQlHeaders());
  const { loading: refineLoading, error: refineErrorData, data: refineEventData, refetch: refineSearchEvents } = useQuery(refineEvents, graphQlHeaders());
  const { loading: refineLoadingMap, error: refineErrorDataMap, data: refineEventDataMap, refetch: refineSearchEventsMap } = useQuery(refineEventsMap, graphQlHeaders());

  const { data:refinePlaceData, refetch:refineSearchPlaces} = useQuery(refinePlaces, {context: graphQlHeaders().context, onCompleted: (data) => {
    const places = JSON.parse(JSON.stringify(data?.places.data))

    places.map((x: Place) => {
      x.label = `${x?.attributes?.placeNameEnglish}${x?.attributes?.placeNameArabic}` || '';
      x.value = x?.id;
      return x;
    })

    // update the data for the pagination
      dispatch(setPlaces([...places]));
}});
  
  useEffect(() => {
    if (searchValue) {
      refineSearchPlaces({search_one: searchValue, "sortBy": ["createdAt:desc"]});
    }
  }, [searchValue])
  
  useEffect(() => {

    if (updateData && edit) {
        dispatch(setTabEdit(false));
        dispatch(setTabData({}));
        dispatch(toggleShowEditSuccess(true))
        navigate(`/Events/${updateData?.updateVisit?.data?.attributes?.uniqueId}`, {replace: true})
    }
  }, [updateData, edit])

  useEffect(() => {
    if (refineEventData?.visits) {
      // update the data for the pagination
      if (refineEventData?.visits.meta.pagination.page === 1 && refineEventData?.visits.data.length > 0) {
        dispatch(setEvents([...refineEventData?.visits?.data]));
      } else if (refineEventData?.visits.data.length > 0) {
        dispatch(setEvents([...eventsData, ...refineEventData?.visits?.data]));
      } else if (refineEventData?.visits?.meta.pagination.total === 0) {
        dispatch(setEvents([]));
      }
      // update the meta data
      dispatch(setEventMetaData(refineEventData?.visits?.meta));
      // this flag decides to fetch next set of data 
      setHasMoreData(refineEventData?.visits?.meta.pagination.pageCount !==
        refineEventData?.visits.meta.pagination.page);
        
      if(refineEventData?.visits?.meta?.pagination?.total){
        let dummyArray: any = [];
        fetchMapData(refineEventData?.visits?.meta?.pagination?.total,true)
        for (let i = 0; i < refineEventDataMap?.visits?.data?.length; i++) {
          if (refineEventDataMap?.visits?.data[i]?.attributes?.latitude && refineEventDataMap?.visits?.data[i]?.attributes?.longitude)
            dummyArray.push({
              id: refineEventDataMap?.visits?.data[i].id,
              uniqueId:refineEventDataMap?.visits?.data[i].attributes["uniqueId"],
              name: refineEventDataMap?.visits?.data[i].attributes?.visit_associate?.data?.attributes?.place_unique_id?.data?.attributes?.placeNameEnglish,
              position: {
                lat: refineEventDataMap?.visits?.data[i]?.attributes?.latitude,
                lng: refineEventDataMap?.visits?.data[i]?.attributes?.longitude
              }
            })
        }
        setMapEvents(dummyArray)
      }
    }
  }, [refineEventData, refineEventDataMap]);

  useEffect(() => {
    if (data && place) {
      createVisitAssociateMuation({
        variables: {
          "place_unique_id": place?.id,
          "visit_unique_id": data.createVisit.data.id
        }
      });
    }
  }, [data])

  useEffect(() => {
    if (updateData) {
      if (edit) {
      }
    }
  }, [updateData])

  useEffect(() => {
    if (visitAssociate) {
      dispatch(toggleShowAddSuccess(true))

      /** re-direct */
      navigate(`/Events/${data.createVisit.data.attributes.uniqueId}`, { replace: true })
    }
  }, [visitAssociate])

  const fetchData = (skip: number = eventsData.length, local: boolean = false, clear: boolean = false) => {
    const searchData = getQueryObj(search);
    const text = local ? searchText : searchData?.search;
    const copiedValue = local ? JSON.parse(JSON.stringify(selectedValue)) : searchData?.refinedSearch;

    const searchWordArray = text?.trim()?.split(' ') || [];
    copiedValue && Object.keys(copiedValue)?.map(x => {
      if (copiedValue[x].length === 0) { delete copiedValue[x]; }
      return x;
    });

    const startDate = new Date(copiedValue?.startDate);
    //const visitStartDate = startDate && startDate.getFullYear() && `${startDate.getFullYear()}-${zerofill(startDate.getMonth() + 1)}-${zerofill(startDate.getDate())}`;
    const visitStartDate = (copiedValue?.startDate && startDate?.getFullYear()) ? `${startDate?.getFullYear()}-${startDate?.getMonth() + 1}-${startDate?.getDate()}` : undefined;
    const endDate = new Date(copiedValue?.endDate);
   // const visitEndDate = endDate && endDate.getFullYear() && `${endDate.getFullYear()}-${zerofill(endDate.getMonth() + 1)}-${zerofill(endDate.getDate())}`;
   const visitEndDate = (copiedValue?.endDate && endDate?.getFullYear()) ? `${endDate?.getFullYear()}-${endDate?.getMonth() + 1}-${endDate?.getDate()}` : undefined;

    const obj: any = {
      researchValue: copiedValue && copiedValue?.researchValue && copiedValue?.researchValue,
      tourismValue: copiedValue && copiedValue.tourismValue && copiedValue?.tourismValue,
      stateOfConservation: copiedValue && copiedValue?.stateOfConservation && copiedValue?.stateOfConservation,
      recommendation: copiedValue && copiedValue?.recommendation && copiedValue?.recommendation,
      risk: copiedValue && copiedValue?.risk && copiedValue?.risk,
      period: copiedValue && copiedValue?.period && copiedValue?.period,
      latitude: copiedValue && copiedValue?.latitude && parseFloat(copiedValue?.latitude),
      longitude: copiedValue && copiedValue?.longitude && parseFloat(copiedValue?.longitude),
      artifacts: copiedValue && copiedValue?.artifacts && copiedValue?.artifacts,
      assessmentType: copiedValue && copiedValue?.assessmentType && copiedValue?.assessmentType,
      keywords: copiedValue && copiedValue?.keyWords && copiedValue?.keyWords,
      siteType: copiedValue && copiedValue?.siteType && copiedValue?.siteType,
      startDate: visitStartDate && visitStartDate,
      endDate: visitEndDate && visitEndDate,
      search_one: searchWordArray[0],
      search_two: searchWordArray[1],
      search_three: searchWordArray[2],
      text: searchWordArray,
      limit: limit,
      skip: skip,
      sortBy: eventSort.length > 0 ? eventSort : [`createdAt:desc`]
    };

    if (clear) {
      obj.skip = 0;
      obj.search_one = '';
      obj.text = [];
      delete obj.search_two;
      delete obj.search_three;
      delete obj.text;
      refineSearchEvents(obj)
    }
    else {
      refineSearchEvents(obj)
    }
  };

  const fetchMapData = (limit: number, local: boolean = false) => {
    const searchData = getQueryObj(search);
    const text = local ? searchText : searchData?.search;
    const copiedValue = local ? JSON.parse(JSON.stringify(selectedValue)) : searchData?.refinedSearch;

    const searchWordArray = text?.trim()?.split(' ') || [];
    copiedValue && Object.keys(copiedValue)?.map(x => {
      if (copiedValue[x].length === 0) { delete copiedValue[x]; }
      return x;
    });

    const startDate = new Date(copiedValue?.startDate);
    const visitStartDate = (copiedValue?.startDate && startDate?.getFullYear()) ? `${startDate?.getFullYear()}-${startDate?.getMonth() + 1}-${startDate?.getDate()}` : undefined;
    const endDate = new Date(copiedValue?.endDate);
    const visitEndDate = (copiedValue?.endDate && endDate?.getFullYear()) ? `${endDate?.getFullYear()}-${endDate?.getMonth() + 1}-${endDate?.getDate()}` : undefined;

    const objOfMap: any = {
      researchValue: copiedValue && copiedValue?.researchValue && copiedValue?.researchValue,
      tourismValue: copiedValue && copiedValue.tourismValue && copiedValue?.tourismValue,
      stateOfConservation: copiedValue && copiedValue?.stateOfConservation && copiedValue?.stateOfConservation,
      recommendation: copiedValue && copiedValue?.recommendation && copiedValue?.recommendation,
      risk: copiedValue && copiedValue?.risk && copiedValue?.risk,
      period: copiedValue && copiedValue?.period && copiedValue?.period,
      latitude: copiedValue && copiedValue?.latitude && parseFloat(copiedValue?.latitude),
      longitude: copiedValue && copiedValue?.longitude && parseFloat(copiedValue?.longitude),
      artifacts: copiedValue && copiedValue?.artifacts && copiedValue?.artifacts,
      assessmentType: copiedValue && copiedValue?.assessmentType && copiedValue?.assessmentType,
      keywords: copiedValue && copiedValue?.keyWords && copiedValue?.keyWords,
      siteType: copiedValue && copiedValue?.siteType && copiedValue?.siteType,
      startDate: visitStartDate && visitStartDate,
      endDate: visitEndDate && visitEndDate,
      search_one: searchWordArray[0],
      search_two: searchWordArray[1],
      search_three: searchWordArray[2],
      text: searchWordArray,
      limit: limit,
    };
    refineSearchEventsMap(objOfMap);
  };

  const clearTextSearch = () => {
    fetchData(0, true, true);
  }

  function zerofill(i: number) {
    return (i < 10 ? '0' : '') + i;
  }
  const createEvent = async (payload: any | undefined) => {
    const uniqueId = generateUniqueId();
    const keywords = payload.keywords;
    const eventDate = payload.eventDate && payload.eventDate;
    const visitDate = eventDate && eventDate.getFullYear() && `${eventDate.getFullYear()}-${zerofill(eventDate.getMonth() + 1)}-${zerofill(eventDate.getDate())}`;
    const data = {
      ...payload,
      visitNumber: parseFloat(payload.visitNumber),

      asset_config_id: 1,
      keywords: keywords,
      siteType: payload.siteType && payload.siteType,
      visitDate: visitDate,
      "researchValue": payload.researchValue && [payload.researchValue],
      "tourismValue": payload.tourismValue && [payload.tourismValue],
      "stateOfConservation": payload.stateOfConservation && [payload.stateOfConservation],
      "recommendation": payload.recommendation && [payload.recommendation],
      "risk": payload.risk && [payload.risk],
      "period": payload.period && payload.period,
      "latitude": payload.latitude && parseFloat(payload.latitude),
      "longitude": payload.longitude && parseFloat(payload.longitude),
      "assessmentType": payload.assessmentType && [payload.assessmentType],
      artifacts: payload.artifacts && [payload.artifacts]
    }
    setPlace(data.place);
    if (!edit) {
      data.uniqueId = uniqueId;
      data.visitUIPath = `Events/${uniqueId}`;
      createEventMuation({ variables: data })
    }
    if (edit && event?.id) {
      updateEventMuation({
        variables: {
          ...data,
          id: event.id
        }
      })
    }
  }

  useEffect(() => {
    if (confirmOpenEdit && editPayload && (tabName === EVENTS_TAB_NAME)) {

      openEditFlow(editPayload)
      dispatch(toggleConfirmOpenEdit(false));
      dispatch(setEditPayload(null));

    }
  }, [confirmOpenEdit])

  useEffect(() => {

    /** get latest list after deleting item */
    if (deleteItemSuccess && (deleteItemType === "Events")) {
      fetchData(0)
    }
  }, [deleteItemSuccess, deleteItemType])

  useEffect(() => {
    if (eventSort.length > 0) {
      fetchData(0);
    }
  }, [eventSort])

  const openEditFlow = async (payload: any) => {
    if (payload) {
      const { record, type } = payload
      const payloadRes = await eventDetails(record.attributes.uniqueId);
      dispatch(setTabEdit(true));
      dispatch(setTabData(payloadRes));
      dispatch(setEventData(payloadRes));
      dispatch(setEventEdit(true));
      dispatch(toggleNewItemWindow(true))
      dispatch(setAddNewItemWindowType(EVENTS_TAB_NAME))
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


  const setEditEvent = async (payload: any) => {
    if (payload) {
      const { record, type } = payload
      const payloadRes = await eventDetails(record.attributes.uniqueId);
      dispatch(setTabEdit(true));
      dispatch(setTabData(payloadRes));
      dispatch(setEventData(payloadRes));
      dispatch(setEventEdit(true));
      dispatch(toggleNewItemWindow(true))
      dispatch(setAddNewItemWindowType(EVENTS_TAB_NAME))
      
    }
  };

  const deleteEvent = async (id: number) => {
    updateEventMuation({
      variables: {
        id: id,
        deleted: true
      }
    })
  }

  return {
    loading: refineLoading,
    error: refineErrorData,
    data: refineEventData,
    mapEvents,
    hasMoreData,
    fetchEvents: fetchData,
    clearSearch: clearTextSearch,
    createEvent,
    setSearchValue,
    searchValue,
    setEdit,
    setEditEvent,
    deleteEvent,
    searchData:getQueryObj(search)
  };
};

export default useEvent;
