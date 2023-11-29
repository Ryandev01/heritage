import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setDownloads } from '../store/reducers/downloadReducer';
import { graphQlHeaders } from "../utils/services/interceptor";
import { Download } from '../types/download';
import { download } from "../query/download";
import { getToken } from "../utils/storage/storage";

const useDownload = () => {
    const { downloads: downloadedData } = useSelector(
        (state: RootState) => state.download
      );
    const dispatch = useDispatch();
    const { loading:downloadLoading, error:downloadErrorData, data:downloadData, refetch:refetchhDownloads} = useQuery(download, graphQlHeaders());

    useEffect(() => {
        fetchData();
      }, [downloadData]);
      const fetchData = () => {
        refetchhDownloads({token:getToken()});
        if(downloadData?.downloads){
            const downloads = JSON.parse(JSON.stringify(downloadData?.downloads?.data));
            if(downloadData?.places?.data.length > 0){
                dispatch(setDownloads([...downloads]));
            }else if(downloadedData.length>0){
                dispatch(setDownloads([...downloadedData, ...downloads]));
            }
        }
      };
    return {
        loading: downloadLoading,
        error: downloadErrorData,
        data: downloadData,
        fetchDownload: fetchData,
    };
  };
  
  export default useDownload;