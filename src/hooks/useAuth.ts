import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeUser } from "../api/user";
import { setUser } from "../store/reducers/loginReducers";
import {getToken, setDefaultData, setRole} from '../utils/storage/storage';
import { fetchSearchCount } from '../api/dashboard';
import { fetchDefaultData } from "../api/default";
import { setTotalCounts } from "../store/reducers/searchResultsReducer";
import { RootState } from "../store";
import useRefinedSearch from "./useRefinedSearchOptions";

const useAuth = () => {
  const dispatch = useDispatch();
  const { edit, event  } = useSelector(
    (state: RootState) => state.event
  );
  const { edit: tabEdit, tabData  } = useSelector(
    (state: RootState) => state.tabEdit
  );
  const { showAddSuccess, deleteItemSuccess } = useSelector((state: RootState) => state.searchResults);
  
  useRefinedSearch();
  useEffect(() => {
    if (getToken()) {
      fetchSession();
      getSearchCount();
      getDefaultData();
    }
  }, [edit, tabEdit]);

  /**refresh count */
  useEffect(() => {
    if (showAddSuccess || deleteItemSuccess) {
      getSearchCount();
    }
  }, [showAddSuccess , deleteItemSuccess]);

  /**
   * get user session details
   */
   const fetchSession = async () => {
    try {
      
      const data = await fetchMeUser();
      await dispatch(setUser(data));
      setRole(data.role.name);
      return data;
    } catch (error) {
      // console.log('error', error)
    }
  }
  /**
   * get user session details
   */
   const getSearchCount = async () => {
    try {
      
      const data = await fetchSearchCount();
      await dispatch(setTotalCounts(data));
      return data;
    } catch (error) {
      // console.log('error', error)
    }
  }

  const getDefaultData = async () => {
    const data = await fetchDefaultData();
    if (data && data?.data) {
      setDefaultData(data.data);
    }
  }
 
  return {
    
  };
};

export default useAuth;
