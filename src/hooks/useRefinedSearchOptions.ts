import { useDispatch } from "react-redux";
import {useQuery} from 'react-query';
import {fetchRefinedSearchOptions} from '../api/search';
import { Options } from "../types/RefinedSeachTypes";
import { setOptions } from "../store/reducers/refinedSearchReducer";
import { getToken } from "../utils/storage/storage";

const useRefinedSearch = () => {
  const dispatch = useDispatch();

  const {data, isLoading} = useQuery('search-options', fetchRefinedSearchOptions, {
    onSuccess: (data: Options) => {
      dispatch(setOptions(data));
    },
    retry: false,
    enabled: Boolean(getToken())
  });
  return {
    data,
    isLoading
  };
};

export default useRefinedSearch;
